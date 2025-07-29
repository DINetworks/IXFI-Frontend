import { useEffect } from 'react'
import { WidgetEvents } from '../react-hooks'
// import { squidWidgetEvents } from "../../index"
/**
 * Listens for events from QR-based wallets (e.g. Xaman)
 */
export function useQrWalletListener({ onQrCodeGenerated, onQrCodeGenerationFailed, onQrCodeScanned }) {
  useEffect(() => {
    const onSignTxQrCodeGenerated = data => {
      onQrCodeGenerated(data.detail)
    }

    const onSignTxQrCodeGenerationFailed = () => {
      onQrCodeGenerationFailed()
    }

    const onSignTxQrCodeScanned = () => {
      onQrCodeScanned()
    }

    const squidWidgetEvents = WidgetEvents.getInstance()

    squidWidgetEvents?.listenToWidget('qrCodeGeneratedForSign', onSignTxQrCodeGenerated)
    squidWidgetEvents?.listenToWidget('qrCodeGenerationFailedForSign', onSignTxQrCodeGenerationFailed)
    squidWidgetEvents.listenToWidget('qrTxScannedAwaitingUserApproval', onSignTxQrCodeScanned)

    return () => {
      squidWidgetEvents.removeWidgetListener('qrCodeGeneratedForSign', onSignTxQrCodeGenerated)
      squidWidgetEvents?.removeWidgetListener('qrCodeGenerationFailedForSign', onSignTxQrCodeGenerationFailed)
      squidWidgetEvents?.removeWidgetListener('qrTxScannedAwaitingUserApproval', onSignTxQrCodeScanned)
    }
  }, [onQrCodeGenerated, onQrCodeScanned, onQrCodeGenerationFailed])
}
