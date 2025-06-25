import { getXummClient, XamanClient } from '../../../services/external/xaman'
import { XrplTxStatus } from '../../types/xrpl'

export class XamanConnector {
  xumm = null
  validateXummInitialized() {
    if (!this.xumm) {
      throw new Error('Xumm is not initialized')
    }
  }

  async initializeXumm() {
    if (!this.xumm) {
      this.xumm = await getXummClient()
    }
  }

  async connect() {
    await this.initializeXumm()
    this.validateXummInitialized()
    const connectedAddress = await this.xumm.user.account
    if (!connectedAddress) {
      throw new Error('User not connected')
    }

    return connectedAddress
  }

  async signAndSubmit({ network, tx }) {
    this.validateXummInitialized()
    if (!this.xumm.xapp) {
      throw new Error('Not in xApp context')
    }

    if (!this.xumm.payload) {
      throw new Error('Payload not available')
    }

    const xamanNetwork = XamanClient.getXamanNetwork(network)
    const txPayload = await this.xumm.payload.create({
      TransactionType: 'Payment',
      options: {
        force_network: xamanNetwork
      },
      txjson: tx
    })

    await this.xumm.xapp.openSignRequest(txPayload)

    const response = await new Promise((resolve, reject) => {
      this.validateXummInitialized()
      if (!this.xumm.xapp) {
        reject(new Error('Not in xApp context'))
      }

      this.xumm.on('payload', async data => {
        this.validateXummInitialized()
        if (data && data.reason === 'DECLINED') {
          reject(new Error('User rejected the request.'))
        }
        if (data && data.reason === 'SIGNED') {
          if (!this.xumm.payload) {
            throw new Error('Payload not available')
          }
          const fullPayload = await this.xumm.payload.get(data.uuid)
          if (fullPayload?.response.txid) {
            resolve({
              hash: fullPayload.response.txid,
              status: XrplTxStatus.SUCCESS
            })
          } else {
            reject(new Error('Transaction hash not found'))
          }
        }
      })
    })

    return response
  }
}
