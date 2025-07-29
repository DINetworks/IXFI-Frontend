import {
  formatHash,
  formatTokenAmount,
  getBridgeType,
  getTokenImage,
  TransactionStatus,
  useDepositAddress,
  useSwap,
  useSwapTransactionStatus,
  useTransactionStore
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { CaptionText, Loader, QrCode, DepositAddressView as UIDepositAddressView } from '@0xsquid/ui'
import { formatUnits } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { routes } from '../core/routes'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'

const depositAddressTooltips = {
  depositAddress: <CaptionText>Send your tokens to this address</CaptionText>,
  timeRemaining: <CaptionText>Time remaining until the deposit channel is closed</CaptionText>
}

export function DepositAddressView() {
  const { squidRoute, routeData } = useSwapRoute()
  const { fromToken, toToken, fromChain, toChain } = useSwap()
  const { closeDepositChannel, depositData } = useDepositAddress()
  const { setTransactionState, txLocalId } = useTransactionStore()

  const transaction = useMemo(() => {
    if (
      !squidRoute.data?.params?.fromAddress ||
      !squidRoute.data?.params?.fromChain ||
      !squidRoute.data?.params?.toChain ||
      !squidRoute.data?.params?.toAddress ||
      !squidRoute.data?.transactionRequest?.type ||
      !depositData?.chainflipStatusTrackingId
    ) {
      return undefined
    }

    return {
      fromAddress: squidRoute.data.params.fromAddress,
      fromChain: squidRoute.data.params.fromChain,
      toChain: squidRoute.data.params.toChain,
      toAddress: squidRoute.data.params.toAddress,
      status: TransactionStatus.ERROR,
      transactionId: depositData.chainflipStatusTrackingId,
      transactionIdForStatus: depositData.chainflipStatusTrackingId,
      bridgeType: getBridgeType(routeData.estimate.actions),
      actions: squidRoute.data.estimate.actions,
      routeType: squidRoute.data.transactionRequest.type,
      // TODO: update types
      quoteId: squidRoute.data.quoteId
    }
  }, [squidRoute.data, depositData, routeData])

  const { transactionStatusQuery } = useSwapTransactionStatus({
    enabled: true,
    transaction
  })

  const { handleCloseModal, isModalOpen, switchRoute } = useSwapRouter()

  useEffect(() => {
    const txStatus = transactionStatusQuery.data?.status
    switch (txStatus) {
      case 'DEPOSIT_RECEIVED':
      case 'COMPLETE':
      case 'BROADCAST_REQUESTED':
        if (transaction) {
          setTransactionState(txLocalId, {
            routeType: transaction.routeType,
            fromAddress: transaction.fromAddress,
            fromChain,
            toChain,
            transactionId: transaction.transactionId,
            status: TransactionStatus.ONGOING,
            sourceStatus: TransactionStatus.SUCCESS,
            quoteId: transaction.quoteId
          })
          switchRoute(routes.transaction)
        }
        break
      default:
        break
    }
  }, [
    transactionStatusQuery.data?.status,
    transaction,
    fromChain,
    toChain,
    switchRoute,
    setTransactionState,
    txLocalId
  ])

  const {
    depositAddress,
    depositAddressFormatted,
    fromAmount,
    fromTokenSymbol,
    toAmount,
    fromChainFormatted,
    toChainFormatted,
    fromTokenFormatted,
    toTokenFormatted
  } = useMemo(() => {
    const depositAddress = depositData?.depositAddress ?? ''
    const depositAddressFormatted = formatHash({
      chainType: fromChain?.chainType,
      hash: depositAddress
    })

    const fromAmount = formatTokenAmount(formatUnits(depositData?.amount ?? '0', fromToken?.decimals), { exact: true })

    const toAmount = formatTokenAmount(formatUnits(squidRoute.data?.estimate.toAmount ?? '0', toToken?.decimals), {
      exact: true
    })

    const fromTokenSymbol = fromToken?.symbol ?? ''

    const fromTokenFormatted = {
      logoUrl: getTokenImage(fromToken) ?? '',
      symbol: fromToken?.symbol ?? ''
    }

    const toTokenFormatted = {
      logoUrl: getTokenImage(toToken) ?? '',
      symbol: toToken?.symbol ?? ''
    }

    const fromChainFormatted = {
      logoUrl: fromChain?.chainIconURI ?? '',
      networkName: fromChain?.networkName ?? ''
    }

    const toChainFormatted = {
      logoUrl: toChain?.chainIconURI ?? '',
      networkName: toChain?.networkName ?? ''
    }

    return {
      depositAddress,
      depositAddressFormatted,
      fromAmount,
      fromTokenSymbol,
      toAmount,
      fromTokenFormatted,
      toTokenFormatted,
      fromChainFormatted,
      toChainFormatted
    }
  }, [
    depositData?.depositAddress,
    depositData?.amount,
    fromChain?.chainType,
    squidRoute.data?.estimate.toAmount,
    fromToken?.decimals,
    fromToken?.symbol,
    toToken?.decimals,
    toToken?.symbol,
    fromChain?.chainIconURI,
    fromChain?.networkName,
    toChain?.chainIconURI,
    toChain?.networkName
  ])

  const [qrData, setQrData] = useState(null)

  useEffect(() => {
    if (!depositAddress) return

    async function generateQr() {
      // @ts-expect-error - qr.js is not typed
      const qr = (await import('qr.js')).default

      const ErrorCorrectionLevel = {
        LOW: 1,
        MEDIUM: 0,
        QUARTILE: 3,
        HIGH: 2
      }

      const qrMatrix = qr(depositAddress, {
        errorCorrectLevel: ErrorCorrectionLevel.LOW
      })

      setQrData(qrMatrix.modules)
    }

    generateQr()
  }, [depositAddress])

  return (
    <UIDepositAddressView
      isOpen={isModalOpen}
      handleClose={() => {
        handleCloseModal()
        closeDepositChannel()
      }}
      depositAddress={depositAddress}
      depositAddressFormatted={depositAddressFormatted}
      description='Do not send other tokens or they will be lost.'
      tooltips={depositAddressTooltips}
      fromAmount={fromAmount}
      fromChain={fromChainFormatted}
      title={`Send ${fromTokenSymbol} to deposit`}
      toAmount={toAmount}
      toChain={toChainFormatted}
      fromToken={fromTokenFormatted}
      toToken={toTokenFormatted}
      timeRemainingSeconds={36600}
      headerContent={
        qrData ? (
          <QrCode matrix={qrData} size={130} />
        ) : (
          <Loader className='tw-text-grey-300' size='32' strokeWidth='3' />
        )
      }
    />
  )
}
