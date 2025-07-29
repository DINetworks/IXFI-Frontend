import { useMultiChainWallet, useSendTransaction, useSquidChains } from 'src/components/swap/widget/react-hooks'
import { QrCodeModal } from '@0xsquid/ui'
import { useState } from 'react'
import { QrModalFooter } from '../components/QrModalFooter'
import { routes } from '../core/routes'
import { useQrWalletListener } from '../hooks/useQrWalletListener'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { useSendStore } from '../store/useSendStore'

export function SignSendTransactionQrView() {
  const { findChain } = useSquidChains()
  const token = useSendStore(store => store.token)
  const chain = findChain(token?.chainId)
  const destinationAddress = useSendStore(store => store.toAddress)
  const amount = useSendStore(store => store.amount)
  const { wallet } = useMultiChainWallet(chain)
  const { cancelSend } = useSendTransaction({
    amount,
    chain,
    to: destinationAddress?.address,
    token
  })

  const { handleCloseModal, switchRoute, isModalOpen } = useSwapRouter()
  const [qrData, setQrData] = useState()
  const [isError, setIsError] = useState(false)

  const handleClose = () => {
    cancelSend()
    handleCloseModal()
  }

  useQrWalletListener({
    onQrCodeGenerated(qrData) {
      setQrData(qrData)
    },
    onQrCodeGenerationFailed() {
      setIsError(true)
    },
    onQrCodeScanned() {
      switchRoute(routes.sendInProgress)
    }
  })

  return (
    <QrCodeModal
      handleClose={handleClose}
      isModalOpen={isModalOpen}
      qrData={qrData?.matrix}
      footerContent={
        <QrModalFooter
          isError={isError}
          description={`Scan the code with your ${wallet?.name} mobile app to confirm your transaction`}
        />
      }
      isError={isError}
      title={`Confirm in ${wallet?.name}`}
      imageUrl={wallet?.icon}
      ctaButton={{
        label: `Open in ${wallet?.name} app`,
        link: qrData?.deepLinkUrl,
        disabled: !qrData?.deepLinkUrl
      }}
    />
  )
}
