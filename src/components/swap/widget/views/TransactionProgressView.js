import React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  formatTokenAmount,
  getBridgeType,
  getTokenImage,
  TransactionErrorType,
  TransactionStatus,
  useDepositAddress,
  useEstimate,
  useExecuteTransaction,
  useMultiChainWallet,
  useSquidChains,
  useSwap,
  useSwapTransactionStatus,
  useTransactionStore
} from 'src/components/swap/widget/react-hooks'
import { ActionType } from '@0xsquid/squid-types'
import {
  Checkmark1Icon,
  Copy2Icon,
  DropdownMenuItem,
  SwapProgressView,
  TelegramIcon,
  XSocialIcon,
  FarcasterIcon
} from '@0xsquid/ui'
import { formatUnits } from 'ethers'
import { squidSupportLink } from '../core/externalLinks'
import { SwapState } from '../core/types/transaction'
import { useClipboard } from '../hooks/useClipboard'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { defaultAssetsColors } from '../services/internal/assetsService'
import { getRandomSocialPost, getSocialIntentUrl } from '../services/internal/socialService'
import { getMainExplorerUrl, getSwapStateFromTxStatus } from '../services/internal/transactionService'
import { getStepsInfos } from '../services/internal/transactionStatusService'
import { useWalletPoints } from 'src/hooks/useWalletPoints'
import { getSwapPoints } from 'src/wallet/utils'

export const TransactionProgressView = () => {
  const currentTransaction = useTransactionStore(state => state.currentTransaction)
  const { routeData } = useSwapRoute()
  const { cancelSwap } = useExecuteTransaction(routeData)
  const { fromToken, toToken, toChain, fromChain, destinationAddress, fromPrice, fromPriceChanged, onSwapChange } =
    useSwap()

  // The reason of this timeout is to avoid fetching the transaction status too soon (right after getting the hash)
  // Because the backend doesn't know the transaction yet, so it would have been a useless failed request
  const timeToWaitBeforeCheckingTransactionStatus = 5000
  const [isAbleToFetchStatus, setIsAbleToFetchStatus] = useState(false)

  useEffect(() => {
    if (currentTransaction?.transactionId) {
      setTimeout(() => {
        setIsAbleToFetchStatus(true)
      }, timeToWaitBeforeCheckingTransactionStatus)
    }
  }, [currentTransaction?.transactionId])

  const { latestStatus, transactionStatusQuery } = useSwapTransactionStatus({
    enabled: isAbleToFetchStatus,
    transaction: {
      fromAddress: currentTransaction?.fromAddress ?? '',
      fromChain: currentTransaction?.fromChain?.chainId ?? '',
      toChain: currentTransaction?.toChain?.chainId ?? '',
      transactionId: currentTransaction?.transactionId ?? '',
      status: currentTransaction?.status ?? TransactionStatus.PENDING,
      bridgeType: getBridgeType(routeData?.estimate.actions),
      actions: routeData?.estimate.actions,
      transactionIdForStatus: currentTransaction?.transactionIdForStatus,
      quoteId: currentTransaction?.quoteId
    }
  })

  const { isEnabled: isDepositAddressEnabled, isAvailableAsPaymentMethod } = useDepositAddress(routeData)
  const { toAmount, fromAmount, estimatedRouteDuration } = useEstimate(routeData)
  const { connectedAddress: sourceUserAddress } = useMultiChainWallet(fromChain)
  const { findChain } = useSquidChains()

  const { fromAmountFormatted, toAmountFormatted } = useMemo(() => {
    return {
      fromAmountFormatted: formatTokenAmount(formatUnits(fromAmount ?? '0', fromToken?.decimals)),
      // toAmount is already formatted by decimals
      toAmountFormatted: formatTokenAmount(toAmount ?? '0')
    }
  }, [fromAmount, fromToken, toAmount])

  const [txStatus, setTxStatus] = useState(TransactionStatus.PENDING)

  const changeTxStatus = useCallback(
    newTxStatus => {
      if (newTxStatus !== txStatus) {
        setTxStatus(txStatus)
        setTimeout(() => {
          setTxStatus(newTxStatus)
        }, 250)
      }
    },
    [txStatus]
  )

  useEffect(() => {
    const statuses = [
      TransactionStatus.REFUNDED,
      TransactionStatus.PARTIAL_SUCCESS,
      TransactionStatus.NEEDS_GAS,
      TransactionStatus.SUCCESS
    ]

    if (currentTransaction === undefined) {
      changeTxStatus(TransactionStatus.PENDING)
    } else if (currentTransaction?.error?.type === TransactionErrorType.REJECTED_BY_USER) {
      changeTxStatus(TransactionStatus.REJECTED)
    } else if (currentTransaction?.sourceStatus === 'error') {
      changeTxStatus(TransactionStatus.ERROR)
    } else if (currentTransaction?.sourceStatus === 'warning') {
      changeTxStatus(TransactionStatus.WARNING)
    } else if (statuses.includes(latestStatus)) {
      changeTxStatus(latestStatus)
    } else if (latestStatus === 'ongoing' || latestStatus === 'initialLoading') {
      changeTxStatus(TransactionStatus.ONGOING)
    } else {
      changeTxStatus(TransactionStatus.PENDING)
    }
  }, [currentTransaction, latestStatus, changeTxStatus])

  const { fromTokenData, toTokenData } = useMemo(() => {
    return {
      fromTokenData: {
        bgColor: fromToken?.bgColor || defaultAssetsColors.tokenBg,
        logoUrl: getTokenImage(fromToken) ?? '',
        symbol: fromToken?.symbol ?? ''
      },
      toTokenData: {
        bgColor: toToken?.bgColor || defaultAssetsColors.tokenBg,
        logoUrl: getTokenImage(toToken) ?? '',
        symbol: toToken?.symbol ?? ''
      }
    }
  }, [fromToken, toToken])

  const { handleCloseModal, isModalOpen } = useSwapRouter()

  const handleClose = useCallback(
    swapState => {
      const swapExecutedStates = [SwapState.PROGRESS, SwapState.COMPLETED, SwapState.NEEDS_GAS]

      // Reset input amount when swapState is one of the executed states
      // Technically, we want to reset input if the transaction was initiated (got tx hash)
      if (swapExecutedStates.includes(swapState)) {
        fromPriceChanged('')
      }

      handleCloseModal()
      cancelSwap()

      // reset currentTransaction when closing the modal to avoid displaying the old transaction
      // when users close the view, and then opens it with a new transaction
      useTransactionStore.setState({ txLocalId: undefined })
    },
    [handleCloseModal, cancelSwap, fromPriceChanged]
  )

  const transactionWithStatusResponse = currentTransaction
    ? { ...currentTransaction, statusResponse: transactionStatusQuery.data }
    : undefined

  const rawSteps = getStepsInfos({
    fromChain,
    fromToken,
    toChain,
    toToken,
    txStatus,
    transaction: transactionWithStatusResponse,
    statusResponse: transactionStatusQuery,
    actions: routeData?.estimate.actions,
    findChain
  })

  const swapState = useMemo(() => {
    return getSwapStateFromTxStatus(txStatus)
  }, [txStatus])

  const explorerLink = getMainExplorerUrl({
    routeType: transactionWithStatusResponse?.routeType,
    transactionId: transactionWithStatusResponse?.transactionId ?? '',
    sourceTxExplorerUrl: transactionWithStatusResponse?.sourceTxExplorerUrl,
    statusResponse: transactionStatusQuery.data,
    sourceChainObject: fromChain,
    actions: routeData?.estimate.actions
  })

  ///////////////////////// DISWAP START /////////////////////////////////
  const { addPoints } = useWalletPoints(currentTransaction?.fromAddress)
  const amountUsd = Number(formatUnits(fromAmount ?? '0', fromToken?.decimals)) * Number(fromPrice ?? 0)

  const updatePoints = useCallback(async () => {
    if (swapState == SwapState.COMPLETED) {
      if (currentTransaction?.fromAddress && explorerLink?.url) {
        const txHash = explorerLink.url?.split('/').pop()

        if (txHash && amountUsd > 0) {
          await addPoints({
            txHash,
            sPoints: getSwapPoints(amountUsd),
            txUrl: explorerLink.url
          })
        }
      }
    }
  }, [
    swapState,
    fromAmount,
    currentTransaction?.fromAddress,
    currentTransaction?.transactionId,
    addPoints,
    explorerLink?.url
  ])

  useEffect(() => {
    if (swapState === SwapState.COMPLETED && currentTransaction?.transactionId) {
      updatePoints()
    }
  }, [swapState, currentTransaction?.transactionId, updatePoints])

  ///////////////////////// DISWAP END /////////////////////////////////

  const fromAddressFormatted = useMemo(() => {
    if (isAvailableAsPaymentMethod && isDepositAddressEnabled) {
      return 'Deposit'
    }
    return sourceUserAddress.ens?.name ?? sourceUserAddress.formatted ?? ''
  }, [isAvailableAsPaymentMethod, isDepositAddressEnabled, sourceUserAddress])

  const toAddressFormatted = destinationAddress?.ens?.name ?? destinationAddress?.formatted ?? ''

  const bridgeAction = useMemo(() => {
    return routeData?.estimate.actions.find(
      action => action.type === ActionType.BRIDGE || action.type === ActionType.RFQ
    )
  }, [routeData?.estimate.actions])

  /**
   * Close modal, and set the `bridge token` as the source token
   * and the original `toToken` as the destination token
   */
  const handleCompleteSwap = useCallback(
    ({ fromChainId, fromTokenAddress, toAmount = '0', toChainId, toTokenAddress, toTokenDecimals }) => {
      onSwapChange({
        fromChainId,
        fromTokenAddress,
        toChainId,
        toTokenAddress
      })

      fromPriceChanged(formatUnits(toAmount, toTokenDecimals))
      handleClose(SwapState.PARTIAL_SUCCESS)
    },
    [fromPriceChanged, handleClose, onSwapChange]
  )

  return (
    <SwapProgressView
      addGasLink={explorerLink?.url}
      fromAddressFormatted={fromAddressFormatted}
      toAddressFormatted={toAddressFormatted}
      fromAmount={fromAmountFormatted}
      toAmount={toAmountFormatted}
      refundTokenSymbol={bridgeAction?.toToken.symbol}
      fromToken={fromTokenData}
      toToken={toTokenData}
      fromChain={{
        logoUrl: fromChain?.chainIconURI ?? '',
        networkName: fromChain?.networkName ?? ''
      }}
      toChain={{
        logoUrl: toChain?.chainIconURI ?? '',
        networkName: toChain?.networkName ?? ''
      }}
      steps={rawSteps}
      swapState={swapState}
      handleComplete={() => {
        handleCompleteSwap({
          fromTokenAddress: bridgeAction?.toToken.address,
          toTokenAddress: routeData?.params.toToken,
          fromChainId: bridgeAction?.toChain,
          toChainId: bridgeAction?.toChain,
          toAmount: bridgeAction?.toAmount,
          toTokenDecimals: bridgeAction?.toToken.decimals
        })
      }}
      estimatedTimeToComplete={`~${estimatedRouteDuration.format()}`}
      handleClose={handleClose}
      isOpen={isModalOpen}
      shareSwapDropdownContent={<ShareSwapDropdown />}
      supportLink={squidSupportLink}
      footerButton={
        explorerLink
          ? {
              label: `View on ${explorerLink.name}`,
              link: explorerLink.url
            }
          : {
              label: 'View on Axelarscan',
              link: undefined
            }
      }
    />
  )
}

function ShareSwapDropdown() {
  const { fromChain, fromToken, toChain, toToken } = useSwap()
  const { copyToClipboard, isCopied: isTokenAddressCopied } = useClipboard()

  const onTokenAddressItemClick = useCallback(() => {
    copyToClipboard(toToken?.address ?? '')
  }, [copyToClipboard, toToken?.address])

  const socialLinks = useMemo(() => {
    const postContent = getRandomSocialPost({
      fromChain,
      fromToken,
      toChain,
      toToken
    })

    return [
      {
        label: 'x.com',
        icon: <XSocialIcon />,
        link: getSocialIntentUrl('x.com', postContent)
      },
      {
        label: 'Farcaster',
        icon: <FarcasterIcon />,
        link: getSocialIntentUrl('farcaster', postContent)
      },
      {
        label: 'Telegram',
        icon: <TelegramIcon />,
        link: getSocialIntentUrl('telegram', postContent)
      }
    ]
  }, [fromChain, fromToken, toChain, toToken])

  return (
    <>
      <DropdownMenuItem
        label='Token address'
        icon={isTokenAddressCopied ? <Checkmark1Icon size='20' /> : <Copy2Icon size='20' />}
        onClick={onTokenAddressItemClick}
      />

      {socialLinks && socialLinks.length > 0 && <span className='tw-h-[1px] tw-bg-material-light-thin' />}

      {socialLinks?.map(({ icon, label, link }) => (
        <DropdownMenuItem key={label} label={label} icon={icon} link={link} />
      ))}
    </>
  )
}
