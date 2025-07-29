import { ChainType } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { transactionEndStatuses } from '../../core/constants'
import { keys } from '../../core/queries/queries-keys'
import { HistoryTxType } from '../../core/types/history'
import { TransactionStatus } from '../../core/types/transaction'
import {
  fetchSwapTransactionStatus,
  getSwapTxStatusRefetchInterval,
  getTransactionEndStatus,
  getTransactionStatus,
  is404Error,
  isHistoryTransactionEnded
} from '../../services'
import { WidgetEvents } from '../../services/internal/eventService'
import { useSquidChains } from '../chains/useSquidChains'
import { useHistoryStore } from '../store/useHistoryStore'
import { useConfigStore } from '../store/useSwapStore'
import { useHistory } from '../user/useHistory'

/**
 * Fetch status of a Swap transaction
 */
export const useSwapTransactionStatus = ({
  transaction,
  retry = 25,
  refetchOnWindowFocus = 'always',
  enabled = true
}) => {
  const config = useConfigStore(state => state.config)
  const isInitialized = useConfigStore(state => state.isInitialized)
  const { replaceSwapTransactionStatus } = useHistory()
  const findTransaction = useHistoryStore(state => state.findTransaction)
  const [isTransactionComplete, setIsTransactionComplete] = useState(false)
  const [refetchInterval, setRefetchInterval] = useState(getSwapTxStatusRefetchInterval(transaction))
  const { getChainType } = useSquidChains()

  const currentHistoryItem = useMemo(
    () =>
      findTransaction({
        transactionId: transaction?.transactionId,
        txType: HistoryTxType.SWAP
      }),
    [findTransaction, transaction?.transactionId]
  )

  /**
   * Transaction status endpoint
   * Squid api is using axelar endpoint and parsing the response
   * @returns {StatusResponse} Status response
   */
  const fetchTransactionStatusWithLatestConfig = useCallback(async () => {
    const latestConfig = useConfigStore.getState().config

    return fetchSwapTransactionStatus({
      transaction,
      integratorId: latestConfig.integratorId,
      apiUrl: latestConfig.apiUrl
    })
  }, [transaction])

  const transactionStatusQuery = useQuery({
    queryKey: keys().swapTransactionStatus(transaction?.transactionId),
    queryFn: fetchTransactionStatusWithLatestConfig,
    enabled:
      enabled &&
      transaction?.transactionId !== '0' &&
      !!transaction?.transactionId &&
      !!transaction.fromAddress &&
      !!config.apiUrl &&
      transaction !== undefined &&
      !isTransactionComplete &&
      isInitialized &&
      !!currentHistoryItem &&
      !isHistoryTransactionEnded({
        data: currentHistoryItem?.data,
        txType: HistoryTxType.SWAP
      }),
    refetchInterval: data => {
      // If the status response is something telling that the transaction
      // is finished, then store transaction history state if success
      // And return false to indicate refetcher to stop
      if (data && transactionEndStatuses.includes(getTransactionStatus(data) ?? '')) {
        return false
      }

      return refetchInterval // Had to handle a variable here because after error, we want the interval to stop
    },
    // At the moment Cosmos indexing takes more time, so need more time between retries
    retryDelay: getChainType(transaction?.fromChain) === ChainType.COSMOS ? 5000 : 3000,
    retry: getChainType(transaction?.fromChain) === ChainType.COSMOS ? 6 : retry,
    refetchOnWindowFocus
  })

  // Handle success with useEffect instead of onSuccess callback
  useEffect(() => {
    if (transactionStatusQuery.isSuccess && transactionStatusQuery.data) {
      const statusResponse = transactionStatusQuery.data
      // Dispatch event
      WidgetEvents.getInstance().dispatchSwapStatus(statusResponse.squidTransactionStatus ?? '')
      const endStatus = getTransactionEndStatus({ statusResponse })

      if (endStatus && transaction?.transactionId) {
        setIsTransactionComplete(true)
        replaceSwapTransactionStatus({
          transactionId: transaction.transactionId,
          statusResponse,
          status: endStatus
        })
      }
    }
  }, [
    transactionStatusQuery.isSuccess,
    transactionStatusQuery.data,
    transaction?.transactionId,
    replaceSwapTransactionStatus
  ])

  // Handle error with useEffect instead of onError callback
  useEffect(() => {
    if (transactionStatusQuery.isError && transaction?.transactionId) {
      const error = transactionStatusQuery.error
      // `fetchTransactionStatus` throws an error with a cause being an AxiosError
      const is404 = is404Error(error.cause)

      if (is404) {
        replaceSwapTransactionStatus({
          transactionId: transaction.transactionId,
          statusResponse: undefined,
          status: TransactionStatus.NOT_FOUND
        })
      } else {
        setRefetchInterval(-1)
        setIsTransactionComplete(true)
        replaceSwapTransactionStatus({
          transactionId: transaction.transactionId,
          statusResponse: undefined,
          status: TransactionStatus.ERROR
        })
      }
    }
  }, [
    transactionStatusQuery.isError,
    transactionStatusQuery.error,
    transaction?.transactionId,
    replaceSwapTransactionStatus
  ])

  return {
    transactionStatusQuery,
    latestStatus:
      transactionStatusQuery.data?.squidTransactionStatus ?? transaction?.status ?? currentHistoryItem?.data?.status
  }
}
