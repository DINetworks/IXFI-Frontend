import { ConnectingWalletStatus, useWallet } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { QrCodeModal } from '@0xsquid/ui'
import { QrModalFooter } from '../components/QrModalFooter'
import { routes } from '../core/routes'
import { useSwapRouter } from '../hooks/useSwapRouter'

export function ConnectWalletQr() {
  const { cancelConnectWallet, connectingWalletState } = useWallet()
  const { handleCloseModal, switchRoute, isModalOpen, modalRoute } = useSwapRouter()
  const { wallet, qrData, status } = connectingWalletState
  const chainId = modalRoute?.params?.chainId

  const handleClose = () => {
    handleCloseModal()
    cancelConnectWallet()
  }

  const handleGoBack = () => {
    switchRoute(routes.wallets, {
      chainId
    })
    cancelConnectWallet()
  }

  const isError = status === ConnectingWalletStatus.QR_GENERATION_FAILED

  return (
    <QrCodeModal
      handleClose={handleClose}
      handleGoBack={handleGoBack}
      isModalOpen={isModalOpen}
      qrData={qrData?.matrix}
      isError={isError}
      footerContent={
        <QrModalFooter
          isError={isError}
          description={`Scan the code with your ${wallet?.name} mobile app to connect`}
        />
      }
      title={`Connect with ${wallet?.name}`}
      imageUrl={wallet?.icon}
      ctaButton={{
        label: `Open in ${wallet?.name} app`,
        link: qrData?.deepLinkUrl,
        disabled: !qrData?.deepLinkUrl
      }}
    />
  )
}
