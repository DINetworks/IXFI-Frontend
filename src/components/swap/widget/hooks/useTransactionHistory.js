import { useMemo } from 'react'
import { getMonthFormatted } from '../services/internal/transactionService'

/**
 * Hook to organize transactions by month with headers
 * @param transactions Array of transaction objects that have a timestamp property
 * @returns Array of transaction and header elements organized by month
 */
export function useTransactionHistory(transactions) {
  return useMemo(() => {
    const transactionsByMonth = {}
    // Group transactions by month
    for (const t of transactions) {
      const date = new Date(t.data.timestamp)
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      if (!transactionsByMonth[month]) {
        transactionsByMonth[month] = []
      }
      const transactionElement = {
        type: 'tx',
        element: t
      }
      transactionsByMonth[month].push(transactionElement)
    }
    // Sort transactions within each month
    for (const month in transactionsByMonth) {
      transactionsByMonth[month]?.sort(
        (a, b) => new Date(b.element.data.timestamp).getTime() - new Date(a.element.data.timestamp).getTime()
      )
    }
    // Convert to array and sort by month
    const sortedTransactionsSplitByMonth = Object.entries(transactionsByMonth)
      .map(([month, transactions]) => ({ month, transactions }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
    const txsAndHeaders = []
    // Create final array with headers and transactions
    for (const monthGroup of sortedTransactionsSplitByMonth) {
      txsAndHeaders.push(
        {
          type: 'header',
          element: { month: getMonthFormatted(monthGroup.month) }
        },
        ...monthGroup.transactions
      )
    }
    return txsAndHeaders
  }, [transactions])
}
