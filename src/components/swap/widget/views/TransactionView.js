import { TransactionErrorType, TransactionStatus, useTransactionStore } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { useEffect } from 'react'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { TransactionProgressView } from './TransactionProgressView'

export const TransactionView = () => {
  const { quoteExpiryMs } = useSwapRoute()
  const setTransactionState = useTransactionStore(store => store.setTransactionState)
  const currentTransaction = useTransactionStore(store => store.currentTransaction)
  const txLocalId = useTransactionStore(store => store.txLocalId)

  // Set up warning timer
  useEffect(() => {
    const timeoutMs = quoteExpiryMs != null ? quoteExpiryMs : 45000
    const timerId = setTimeout(() => {
      if (!currentTransaction) {
        setTransactionState(txLocalId, {
          quoteId: '',
          transactionId: '0',
          status: TransactionStatus.WARNING,
          routeType: '',
          sourceStatus: TransactionStatus.WARNING,
          error: {
            type: TransactionErrorType.WARNING,
            internalLabel: 'Transaction exceeded quote expiry timeout'
          }
        })
      }
    }, timeoutMs)
    return () => clearTimeout(timerId)
  }, [currentTransaction, quoteExpiryMs, setTransactionState, txLocalId])

  return <TransactionProgressView />
}
