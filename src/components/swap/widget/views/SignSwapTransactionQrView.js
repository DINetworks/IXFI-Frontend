import { useExecuteTransaction, useMultiChainWallet, useSwap } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { QrCodeModal } from '@0xsquid/ui'
import { useState } from 'react'
import { QrModalFooter } from '../components/QrModalFooter'
import { routes } from '../core/routes'
import { useQrWalletListener } from '../hooks/useQrWalletListener'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'

export function SignSwapTransactionQrView() {
  const { routeData } = useSwapRoute()
  const { fromChain } = useSwap()
  const { wallet } = useMultiChainWallet(fromChain)
  const { cancelSwap } = useExecuteTransaction(routeData)
  const { handleCloseModal, switchRoute, isModalOpen } = useSwapRouter()
  const [qrData, setQrData] = useState()
  const [isError, setIsError] = useState(false)

  const handleClose = () => {
    cancelSwap()
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
      switchRoute(routes.transaction)
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
