import { useQueries } from '@tanstack/react-query'
import { keys } from '../../core/queries/queries-keys'
import { HistoryTxType } from '../../core/types/history'
import {
  fetchSwapTransactionStatus,
  getSendTxStatusRefetchInterval,
  getSwapTxStatusRefetchInterval,
  getTransactionEndStatus
} from '../../services'
import { OnrampService } from '../../services/external/onrampAdapter'
import { getSendTransactionStatus } from '../../services/internal/sendTransactionStatus'
import { useSquidChains } from '../chains/useSquidChains'
import { SendTransactionStatus } from '../../core/types/transaction'
import { FINAL_TRANSACTION_STATUSES, TX_STATUS_CONSTANTS } from '../onramp/useFiatToCrypto'
import { useHistoryStore } from '../store/useHistoryStore'
import { useConfigStore } from '../store/useSwapStore'
import { useHistory } from '../user/useHistory'
import { useEffect } from 'react'

export const useAllTransactionsStatus = ({ enabled }) => {
  const { pendingTransactions, replaceSwapTransactionStatus } = useHistory()
  const replaceTransactionStatus = useHistoryStore(state => state.replaceTransactionStatus)
  const config = useConfigStore(state => state.config)
  const { findChain } = useSquidChains()
  const onrampService = new OnrampService()

  const statusQueries = pendingTransactions.map(({ txType, data }) => {
    switch (txType) {
      case HistoryTxType.SWAP: {
        return {
          queryKey: keys().swapTransactionStatus(data.transactionId),
          queryFn: async () => {
            return fetchSwapTransactionStatus({
              transaction: {
                ...data,
                transactionId: data.transactionIdForStatus ?? data.transactionId
              },
              apiUrl: config.apiUrl,
              integratorId: config.integratorId
            })
          },
          enabled: true,
          retry: 4,
          retryDelay: getSwapTxStatusRefetchInterval(data),
          refetchInterval: 5000
        }
      }
      case HistoryTxType.BUY:
        return {
          queryKey: keys().fiatToCryptoStatus(data.orderId),
          queryFn: () => onrampService.getTransactionStatus(data.orderId, data.toAddress, data.providerId),
          retry: TX_STATUS_CONSTANTS.RETRY_COUNT,
          retryDelay: TX_STATUS_CONSTANTS.RETRY_DELAY,
          refetchInterval: (oldData, newData) => {
            if (newData?.status && FINAL_TRANSACTION_STATUSES.includes(newData.status)) {
              return false
            }
            return TX_STATUS_CONSTANTS.REFETCH_INTERVAL
          },
          enabled: true,
          meta: {
            txType: HistoryTxType.BUY,
            orderId: data.orderId
          }
        }
      case HistoryTxType.SEND:
        return {
          queryKey: keys().sendTransactionStatus(data.hash, data.token.chainId),
          queryFn: async () => {
            const chain = findChain(data.token.chainId)
            if (!chain) {
              throw new Error(`Could not find chain ${data.token.chainId} for tx status`)
            }
            return getSendTransactionStatus({
              chain,
              txHash: data.hash
            })
          },
          refetchInterval: getSendTxStatusRefetchInterval(data.token.type),
          meta: {
            txType: HistoryTxType.SEND,
            hash: data.hash
          }
        }
    }
  })

  const queries = useQueries({
    queries: enabled && config.apiUrl ? statusQueries : []
  })

  useEffect(() => {
    if (!enabled || !config.apiUrl) return

    pendingTransactions.forEach(({ txType, data }, index) => {
      const query = queries[index]

      if (!query) return

      // SWAP transaction success handling
      if (txType === HistoryTxType.SWAP && query.isSuccess && query.data) {
        const statusResponse = query.data
        const endStatus = getTransactionEndStatus({ statusResponse })

        if (endStatus) {
          replaceSwapTransactionStatus({
            transactionId: data.transactionId,
            statusResponse,
            status: endStatus
          })
        }
      }

      // BUY transaction success handling
      if (txType === HistoryTxType.BUY) {
        if (query.isSuccess && query.data) {
          const statusData = query.data
          replaceTransactionStatus({
            orderId: data.orderId,
            status: statusData.status,
            transactionHash: statusData.transactionHash,
            txType: HistoryTxType.BUY
          })
        } else if (query.isError) {
          replaceTransactionStatus({
            txType: HistoryTxType.BUY,
            orderId: data.orderId,
            status: 'failed',
            transactionHash: undefined
          })
        }
      }

      // SEND transaction success/error handling
      if (txType === HistoryTxType.SEND) {
        if (query.isSuccess && query.data) {
          const status = query.data
          if (status !== SendTransactionStatus.ONGOING) {
            replaceTransactionStatus({
              txType: HistoryTxType.SEND,
              status,
              hash: data.hash
            })
          }
        } else if (query.isError) {
          replaceTransactionStatus({
            txType: HistoryTxType.SEND,
            status: SendTransactionStatus.ERROR,
            hash: data.hash
          })
        }
      }
    })
  }, [queries, pendingTransactions, replaceSwapTransactionStatus, replaceTransactionStatus, enabled, config.apiUrl])

  return {
    isLoading: queries.some(q => q.isLoading),
    isError: queries.some(q => q.isError),
    data: queries.map(q => q.data).filter(Boolean)
  }
}
