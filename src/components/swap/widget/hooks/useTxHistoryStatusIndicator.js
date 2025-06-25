import { TransactionStatus, useAllTransactionsStatus, useHistory } from 'src/components/swap/widget/react-hooks'
import { HistoryTxType } from 'src/components/swap/widget/react-hooks/core/types/history'
import { useEffect, useRef, useState } from 'react'
import { routes } from '../core/routes'
import { useSwapRouter } from './useSwapRouter'

const DisplayState = {
  DEFAULT: 'default',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success'
}

const DISPLAY_TIMEOUT = 5000

export const useTxHistoryStatusIndicator = source => {
  const [displayState, setDisplayState] = useState(DisplayState.DEFAULT)
  const prevStatusRef = useRef(null)
  const prevSourceRef = useRef(undefined)
  const timerRef = useRef(null)
  const { currentRoute, isModalOpen } = useSwapRouter()
  // Map source to transaction type
  const sourceToTxType = {
    swap: HistoryTxType.SWAP,
    buy: HistoryTxType.BUY,
    send: HistoryTxType.SEND
  }
  const currentTxType = source ? sourceToTxType[source] : undefined
  const { globalStatus } = useHistory(currentTxType)
  // This will refetch all tx status in the background and update the global status (useHistory)
  useAllTransactionsStatus({
    // Prevents fetching all tx if not needed for the view
    enabled:
      (currentRoute?.id === routes.swap.id ||
        currentRoute?.id === routes.send.id ||
        currentRoute?.id === routes.fiatOnRamp.id ||
        currentRoute?.id === routes.history.id) &&
      !isModalOpen
  })
  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    const setTimedState = state => {
      clearTimer()
      setDisplayState(state)
      timerRef.current = setTimeout(() => {
        setDisplayState(DisplayState.DEFAULT)
      }, DISPLAY_TIMEOUT)
    }
    // Handle source changes
    if (source !== prevSourceRef.current) {
      clearTimer()
      // Immediately show loading if the new tab has pending transactions
      if (globalStatus === TransactionStatus.PENDING) {
        setDisplayState(DisplayState.LOADING)
      } else {
        setDisplayState(DisplayState.DEFAULT)
      }
      prevStatusRef.current = globalStatus
      prevSourceRef.current = source
      return
    }
    // Handle status changes within the same tab
    if (globalStatus === TransactionStatus.PENDING) {
      clearTimer()
      setDisplayState(DisplayState.LOADING)
    } else if (globalStatus === TransactionStatus.SUCCESS || globalStatus === TransactionStatus.ERROR) {
      if (prevStatusRef.current === TransactionStatus.PENDING) {
        setTimedState(globalStatus === TransactionStatus.SUCCESS ? DisplayState.SUCCESS : DisplayState.ERROR)
      } else {
        clearTimer()
        setDisplayState(DisplayState.DEFAULT)
      }
    }
    prevStatusRef.current = globalStatus
    prevSourceRef.current = source
    return clearTimer
  }, [globalStatus, source])
  return { globalStatus, displayState, currentTxType }
}
