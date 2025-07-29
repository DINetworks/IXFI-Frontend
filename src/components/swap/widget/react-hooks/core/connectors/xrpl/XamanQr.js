import { QrCodeGenerationError } from '../../../core/types/error'
import { WidgetEvents } from '../../../services'
import { websocket } from '../../../services/external/websocket'
import { XamanClient } from '../../../services/external/xaman'
import { XrplTxStatus } from '../../types/xrpl'

const genericXamanQrErrorMessage = 'Failed to generate Xaman QR code'

export class XamanQrConnector {
  cancelConnectQr = null
  cancelSignAndSubmitQr = null

  cancelConnect() {
    this.cancelConnectQr?.()
  }

  cancelSignAndSubmit() {
    this.cancelSignAndSubmitQr?.()
  }

  async connect() {
    const controller = new AbortController()
    this.cancelConnectQr = () => {
      controller.abort('User canceled the connection process')
    }
    let response
    try {
      response = await XamanClient.signIn(controller.signal)
    } catch (error) {
      throw new QrCodeGenerationError(genericXamanQrErrorMessage)
    }
    WidgetEvents.getInstance().dispatchQrCodeGeneratedForConnect({
      matrix: response.qrMatrix,
      deepLinkUrl: response.deepLinkUrl
    })
    const { promise, close } = websocket(response.wsStatusUrl, (event, resolve, reject) => {
      const msg = JSON.parse(event.data)
      if (msg.signed === true) {
        XamanClient.userSession(msg.payload_uuidv4).then(data => {
          resolve(data.response.account)
        })
      } else if (msg.signed === false) {
        reject(new Error('User rejected the request.'))
      }
    })
    this.cancelConnectQr = () => {
      close()
    }
    const address = await promise
    return address
  }

  async signAndSubmit({ tx, network }) {
    const controller = new AbortController()
    this.cancelSignAndSubmitQr = () => {
      controller.abort('User canceled the transaction')
    }
    let response

    try {
      response = await XamanClient.sendTx({
        tx,
        network,
        signal: controller.signal
      })
    } catch (error) {
      WidgetEvents.getInstance().dispatchQrCodeGenerationFailedForSign(undefined)
      throw new QrCodeGenerationError(genericXamanQrErrorMessage)
    }

    WidgetEvents.getInstance().dispatchQrCodeGeneratedForSign({
      matrix: response.qrMatrix,
      deepLinkUrl: response.deepLinkUrl
    })

    const { promise, close } = websocket(response.wsStatusUrl, (event, resolve, reject) => {
      const msg = JSON.parse(event.data)
      if (msg.opened === true) {
        // User has scanned the QR code
        WidgetEvents.getInstance().dispatchQrTxScannedAwaitingApproval(undefined)
      } else if (msg.signed === true) {
        // Tx has been signed
        resolve({
          hash: msg.txid,
          status: XrplTxStatus.SUCCESS
        })
      } else if (msg.signed === false) {
        // User rejected the transaction
        reject(new Error('User rejected the request.'))
      }
    })

    this.cancelSignAndSubmitQr = () => {
      close()
    }
    const result = await promise

    return result
  }
}
