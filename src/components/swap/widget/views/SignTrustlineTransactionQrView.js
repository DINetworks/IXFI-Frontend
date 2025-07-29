import { useMultiChainWallet, useSwap, useXrplTrustLine } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { QrCodeModal } from '@0xsquid/ui'
import { useMemo, useState } from 'react'
import { QrModalFooter } from '../components/QrModalFooter'
import { useQrWalletListener } from '../hooks/useQrWalletListener'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'

export function SignTrustLineTransactionQrView() {
  const { squidRoute } = useSwapRoute()
  const { toChain, toToken, destinationAddress } = useSwap()
  const { wallet } = useMultiChainWallet(toChain)

  const toAmountBn = useMemo(() => {
    return BigInt(squidRoute.data?.estimate.toAmount ?? 0)
  }, [squidRoute.data?.estimate.toAmount])

  const { cancelCreateTrustLine } = useXrplTrustLine({
    address: destinationAddress?.address,
    chain: toChain,
    token: toToken,
    amount: toAmountBn
  })

  const { handleCloseModal, isModalOpen } = useSwapRouter()
  const [qrData, setQrData] = useState()
  const [isError, setIsError] = useState(false)

  const handleClose = () => {
    cancelCreateTrustLine()
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
      handleCloseModal()
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
