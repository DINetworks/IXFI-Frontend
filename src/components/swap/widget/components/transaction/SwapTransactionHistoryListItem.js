import {
  formatTokenAmount,
  getTokenImage,
  useSquidChains,
  useSquidTokens,
  useSwapTransactionStatus
} from 'src/components/swap/widget/react-hooks'
import { HistoryTxType } from 'src/components/swap/widget/react-hooks/core/types/history'
import { HistoryItem } from '@0xsquid/ui'
import { formatUnits } from 'ethers'
import React, { useCallback, useMemo } from 'react'
import { formatTransactionHistoryDate, getMainExplorerUrl } from '../../services/internal/transactionService'
import { DropdownMenuContent } from './DropdownMenuContent'

export const SwapTransactionHistoryListItem = React.memo(
  ({ transaction, itemsContainerRef, handleRemoveTransaction, handleRepeatTx }) => {
    const { findChain } = useSquidChains()
    const { findToken } = useSquidTokens()
    const { transactionStatusQuery, latestStatus } = useSwapTransactionStatus({
      transaction
    })

    const status = useMemo(() => {
      switch (latestStatus) {
        case 'ongoing':
        case 'initialLoading':
        case 'pending':
          return 'pending'
        case 'error':
          return 'failed'
        case 'warning':
        case 'partial_success':
        case 'refunded':
          return 'warning'
        case 'success':
        default:
          return 'completed'
      }
    }, [latestStatus])

    const { fromChain, toChain, fromToken, toToken } = useMemo(() => {
      return {
        fromChain: findChain(transaction.fromChain),
        toChain: findChain(transaction.toChain),
        fromToken: findToken(transaction.fromToken, transaction.fromChain),
        toToken: findToken(transaction.toToken, transaction.toChain)
      }
    }, [findChain, findToken, transaction.fromChain, transaction.fromToken, transaction.toChain, transaction.toToken])

    const txExplorerData = useMemo(() => {
      if (!transaction) return undefined
      return getMainExplorerUrl({
        ...transaction,
        statusResponse: transactionStatusQuery.data ?? transaction.statusResponse,
        sourceChainObject: fromChain
      })
    }, [transaction, transactionStatusQuery.data, fromChain])

    const canRepeatTransaction = !!fromToken && !!transaction

    const handleRepeatTxCallback = useCallback(() => {
      if (!canRepeatTransaction) return undefined
      return handleRepeatTx(
        {
          data: transaction,
          txType: HistoryTxType.SWAP
        },
        fromToken
      )
    }, [canRepeatTransaction, handleRepeatTx, transaction, fromToken])

    const formattedDate = useMemo(() => formatTransactionHistoryDate(transaction.timestamp), [transaction.timestamp])

    const fromAmount = useMemo(() => {
      return formatTokenAmount(formatUnits(transaction.fromAmount ?? '0', fromToken?.decimals))
    }, [transaction.fromAmount, fromToken?.decimals])

    const toAmount = useMemo(() => {
      return formatTokenAmount(formatUnits(transaction.toAmount ?? '0', toToken?.decimals))
    }, [transaction.toAmount, toToken?.decimals])

    return (
      <HistoryItem
        txType='swap'
        itemsContainerRef={itemsContainerRef}
        dropdownMenuContent={
          <DropdownMenuContent
            handleRemoveTransaction={() =>
              handleRemoveTransaction({
                txType: HistoryTxType.SWAP,
                transactionId: transaction.transactionId
              })
            }
            handleRepeatSwap={canRepeatTransaction ? handleRepeatTxCallback : undefined}
            txExplorerData={txExplorerData}
            txType={HistoryTxType.SWAP}
          />
        }
        dateCompleted={formattedDate ? `${formattedDate.month} ${formattedDate.day}` : ''}
        fromAmount={`${fromAmount} ${fromToken ? fromToken.symbol : ''}`}
        fromLabel={fromChain?.networkName ?? ''}
        toLabel={toChain?.networkName ?? ''}
        toAmount={`${toAmount} ${toToken ? toToken.symbol : ''}`}
        warningLabel='Swap refunded'
        firstImageUrl={getTokenImage(fromToken) ?? ''}
        secondImageUrl={getTokenImage(toToken) ?? ''}
        status={status}
      />
    )
  }
)
