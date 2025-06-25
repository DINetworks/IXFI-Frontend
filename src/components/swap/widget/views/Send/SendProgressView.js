import {
  formatHash,
  formatSeconds,
  getSourceExplorerTxUrl,
  getTokenImage,
  SendTransactionStatus,
  TransactionStatus,
  useMultiChainWallet,
  useSendTransaction,
  useSendTransactionStatus,
  useSendTransactionStore,
  useSquidChains
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { TransactionErrorType } from 'src/components/swap/widget/react-hooks/core/types/error'
import { SwapProgressView } from '@0xsquid/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { defaultAssetsColors } from '../../services/internal/assetsService'
import { getConfirmInWalletStep, getSwapStateFromTxStatus } from '../../services/internal/transactionService'
import { getEstimatedConfirmationTimeForChain } from '../../services/internal/transactionStatusService'
import { useSendStore } from '../../store/useSendStore'

export function SendProgressView() {
  const currentTransaction = useSendTransactionStore(state => state.currentTransaction)
  const [txStatus, setTxStatus] = useState(TransactionStatus.PENDING)

  const token = useSendStore(store => store.token)
  const amount = useSendStore(store => store.amount)
  const toAddress = useSendStore(store => store.toAddress)
  const setAmount = useSendStore(store => store.setAmount)

  const { findChain } = useSquidChains()
  const chain = findChain(token?.chainId)
  const { handleCloseModal, isModalOpen } = useSwapRouter()
  const { connectedAddress } = useMultiChainWallet(chain)

  const { cancelSend } = useSendTransaction({
    amount,
    chain,
    to: toAddress?.address,
    token
  })

  const txHash = currentTransaction?.txHash ?? ''

  const { status: latestStatus } = useSendTransactionStatus({
    txHash,
    chain
  })

  const uiToken = {
    bgColor: token?.bgColor || defaultAssetsColors.tokenBg,
    logoUrl: getTokenImage(token) ?? '',
    symbol: token?.symbol ?? ''
  }

  const uiChain = {
    logoUrl: chain?.chainIconURI ?? '',
    networkName: chain?.networkName ?? ''
  }

  useEffect(() => {
    if (currentTransaction?.error) {
      switch (currentTransaction?.error?.type) {
        case TransactionErrorType.REJECTED_BY_USER:
          setTxStatus(TransactionStatus.REJECTED)
          break
        default:
          setTxStatus(TransactionStatus.ERROR)
          break
      }
    } else if (latestStatus == null && txHash) {
      // as soon as the txHash is available, set the status to ongoing
      setTxStatus(TransactionStatus.ONGOING)
    } else {
      switch (latestStatus) {
        case SendTransactionStatus.ERROR:
          setTxStatus(TransactionStatus.ERROR)
          break
        case SendTransactionStatus.SUCCESS:
          setTxStatus(TransactionStatus.SUCCESS)
          break
        case SendTransactionStatus.ONGOING:
          setTxStatus(TransactionStatus.ONGOING)
          break
        default:
          setTxStatus(TransactionStatus.PENDING)
      }
    }
  }, [currentTransaction?.error, latestStatus, txHash])

  const swapState = useMemo(() => {
    return getSwapStateFromTxStatus(txStatus)
  }, [txStatus])

  const explorerLink = getSourceExplorerTxUrl(chain, txHash)

  const steps = useMemo(() => {
    if (!token || !chain) {
      return []
    }

    const sendingStepDescriptionBlocks = [
      {
        type: 'string',
        value: 'Sending'
      },
      {
        type: 'image',
        value: getTokenImage(token) ?? '',
        rounded: true
      },
      {
        type: 'string',
        value: token.symbol
      }
    ]

    const sentStepDescriptionBlocks = [
      {
        type: 'string',
        value: 'Sent'
      },
      {
        type: 'image',
        value: getTokenImage(token) ?? '',
        rounded: true
      },
      {
        type: 'string',
        value: `${token.symbol} on`
      },
      {
        type: 'image',
        value: chain.chainIconURI
      },
      {
        type: 'string',
        value: chain.networkName
      }
    ]

    const stepStatus = (() => {
      switch (txStatus) {
        case TransactionStatus.SUCCESS:
          return 'success'
        case TransactionStatus.ERROR:
          return 'error'
        case TransactionStatus.ONGOING:
          return 'ongoing'
        default:
          return 'waiting'
      }
    })()

    const confirmInWalletStep = getConfirmInWalletStep({
      txStatus
    })

    const sendingStep = {
      status: stepStatus === 'success' ? 'executed' : stepStatus,
      descriptionBlocks: sendingStepDescriptionBlocks,
      link: explorerLink
    }

    const sentStep = {
      status: stepStatus,
      descriptionBlocks: sentStepDescriptionBlocks,
      link: explorerLink
    }

    return [confirmInWalletStep, sendingStep, sentStep]
  }, [chain, explorerLink, token, txStatus])

  const estimatedTimeToComplete = useMemo(() => {
    if (!chain?.chainType) return formatSeconds(0)

    const estimatedTime = getEstimatedConfirmationTimeForChain({
      chainId: chain.chainId,
      chainType: chain.chainType
    })

    return formatSeconds(estimatedTime)
  }, [chain?.chainId, chain?.chainType])

  const handleClose = useCallback(() => {
    // we want to reset input if the transaction was initiated (got tx hash)
    if (txHash) {
      setAmount('')
    }

    handleCloseModal()
    cancelSend()

    // reset currentTransaction when closing the modal to avoid displaying the old transaction
    // when users close the view, and then opens it with a new transaction
    useSendTransactionStore.setState({ txLocalId: undefined })
  }, [handleCloseModal, cancelSend, setAmount, txHash])

  return (
    <SwapProgressView
      handleClose={handleClose}
      isOpen={isModalOpen}
      fromAddressFormatted={connectedAddress.formatted ?? ''}
      toAddressFormatted={formatHash({
        hash: toAddress?.address,
        chainType: chain?.chainType
      })}
      fromAmount={amount ?? '0'}
      toAmount={amount ?? '0'}
      fromChain={uiChain}
      toChain={uiChain}
      fromToken={uiToken}
      toToken={uiToken}
      steps={steps}
      swapState={swapState}
      isSendTransaction={true}
      footerButton={
        explorerLink && chain
          ? {
              label: `View on ${chain.networkName} explorer`,
              link: explorerLink
            }
          : undefined
      }
      shareSwapDropdownContent={null}
      estimatedTimeToComplete={estimatedTimeToComplete}
    />
  )
}
