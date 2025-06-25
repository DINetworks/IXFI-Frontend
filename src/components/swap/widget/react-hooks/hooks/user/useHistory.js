import { useCallback, useMemo } from 'react'
import { HistoryTxType } from '../../core/types/history'
import { TransactionStatus } from '../../core/types/transaction'
import { formatSwapTxStatusResponseForStorage, simplifyRouteAction } from '../../services'
import {
  getBridgeType,
  isHistoryTransactionFailed,
  isHistoryTransactionPending,
  isHistoryTransactionWarning
} from '../../services/internal/transactionStatusService'
import { useHistoryStore } from '../store/useHistoryStore'

export const useHistory = txType => {
  const transactions = useHistoryStore(state => state.transactions)
  const { persistTransaction, replaceTransactionStatus, replaceTransactionAtNonce } = useHistoryStore()
  const filteredTransactions = useMemo(() => {
    if (txType === undefined) return transactions
    return transactions.filter(tx => tx.txType === txType)
  }, [transactions, txType])

  const pendingTransactions = useMemo(() => {
    return filteredTransactions.filter(isHistoryTransactionPending)
  }, [filteredTransactions])

  const parseSwapTransaction = useCallback(tx => {
    if (!tx.transactionId || !tx.params.toAddress || !tx.params.fromAddress) {
      return null
    }

    const simplifiedActions = tx.estimate?.actions?.map(simplifyRouteAction) ?? []
    const swapTxData = {
      fromChain: tx.params.fromChain,
      fromToken: tx.params.fromToken,
      fromAddress: tx.params.fromAddress,
      fromAmount: tx.params.fromAmount,
      toChain: tx.params.toChain,
      toToken: tx.params.toToken,
      toAddress: tx.params.toAddress,
      toAmount: tx.estimate.toAmount,
      transactionIdForStatus: tx.transactionIdForStatus,
      quoteId: tx.quoteId,
      status: tx.status,
      transactionId: tx.transactionId,
      nonce: tx.nonce,
      routeType: tx.routeType,
      statusResponse: formatSwapTxStatusResponseForStorage(tx.statusResponse),
      sourceTxExplorerUrl: tx.sourceTxExplorerUrl,
      timestamp: tx.timestamp ?? Date.now(),
      bridgeType: getBridgeType(tx.estimate.actions),
      actions: simplifiedActions
    }

    return {
      txType: HistoryTxType.SWAP,
      data: swapTxData
    }
  }, [])

  const addSwapTransaction = useCallback(
    tx => {
      const simplifiedTx = parseSwapTransaction(tx)
      if (simplifiedTx) {
        persistTransaction(simplifiedTx)
      }
    },
    [parseSwapTransaction, persistTransaction]
  )

  const replaceSwapTransactionStatus = useCallback(
    params => {
      replaceTransactionStatus({
        txType: HistoryTxType.SWAP,
        status: params.status,
        transactionId: params.transactionId,
        statusResponse: formatSwapTxStatusResponseForStorage(params.statusResponse)
      })
    },
    [replaceTransactionStatus]
  )

  const replaceSwapTransactionNonce = useCallback(
    (nonce, userAddress, tx) => {
      const simplifiedTx = parseSwapTransaction(tx)
      if (simplifiedTx) {
        replaceTransactionAtNonce({
          nonce,
          fromAddress: userAddress,
          newTx: simplifiedTx
        })
      }
    },
    [parseSwapTransaction, replaceTransactionAtNonce]
  )

  const globalStatus = useMemo(() => {
    const statusPriority = [
      {
        status: TransactionStatus.ERROR,
        check: isHistoryTransactionFailed
      },
      {
        status: TransactionStatus.WARNING,
        check: isHistoryTransactionWarning
      },
      {
        status: TransactionStatus.PENDING,
        check: isHistoryTransactionPending
      }
    ]
    for (const { status, check } of statusPriority) {
      if (filteredTransactions.some(check)) {
        return status
      }
    }
    return TransactionStatus.SUCCESS
  }, [filteredTransactions])

  return {
    addSwapTransaction,
    globalStatus,
    replaceSwapTransactionNonce,
    replaceSwapTransactionStatus,
    pendingTransactions
  }
}
