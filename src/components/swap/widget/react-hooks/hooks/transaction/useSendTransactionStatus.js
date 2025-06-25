import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { keys } from '../../core/queries/queries-keys'
import { HistoryTxType } from '../../core/types/history'
import { SendTransactionStatus } from '../../core/types/transaction'
import { getSendTransactionStatus } from '../../services/internal/sendTransactionStatus'
import {
  getSendTxStatusRefetchInterval,
  isHistoryTransactionEnded
} from '../../services/internal/transactionStatusService'
import { useHistoryStore } from '../store/useHistoryStore'

export function useSendTransactionStatus({ chain, txHash }) {
  const [isTransactionComplete, setIsTransactionComplete] = useState(false)
  const replaceTransactionStatus = useHistoryStore(state => state.replaceTransactionStatus)
  const findTransaction = useHistoryStore(state => state.findTransaction)

  const currentHistoryItem = findTransaction({
    transactionId: txHash,
    txType: HistoryTxType.SEND
  })

  const query = useQuery({
    queryKey: keys().sendTransactionStatus(txHash, chain?.chainId),
    queryFn: async () => {
      if (!chain || !txHash) throw new Error('Chain or txHash not provided')

      return getSendTransactionStatus({
        chain,
        txHash
      })
    },
    refetchInterval: (_, data) => {
      // Stop refetching when we get a terminal status
      if (data && data !== SendTransactionStatus.ONGOING) {
        return false
      }
      return chain ? getSendTxStatusRefetchInterval(chain.chainType) : false
    },
    enabled:
      !!chain &&
      !!txHash &&
      !isTransactionComplete &&
      !!currentHistoryItem &&
      !isHistoryTransactionEnded({
        data: currentHistoryItem?.data,
        txType: HistoryTxType.SEND
      })
  })

  const { data: status, isSuccess, isError } = query

  // Handle success state
  useEffect(() => {
    if (status && isSuccess) {
      setIsTransactionComplete(status !== SendTransactionStatus.ONGOING)

      if (status != null && !!txHash) {
        replaceTransactionStatus({
          txType: HistoryTxType.SEND,
          status: status,
          hash: txHash
        })
      }
    }
  }, [isSuccess, status, txHash, replaceTransactionStatus])

  // Handle error state
  useEffect(() => {
    if (isError) {
      setIsTransactionComplete(true)

      if (txHash) {
        replaceTransactionStatus({
          txType: HistoryTxType.SEND,
          status: SendTransactionStatus.ERROR,
          hash: txHash
        })
      }
    }
  }, [isError, txHash, replaceTransactionStatus])

  return {
    status: status ?? currentHistoryItem?.data?.status
  }
}
