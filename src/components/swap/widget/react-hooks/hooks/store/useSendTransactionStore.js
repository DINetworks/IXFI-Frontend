import { create } from 'zustand'

export const useSendTransactionStore = create((set, get) => ({
  txLocalId: undefined,
  transactions: {},
  currentTransaction: undefined,
  setTransactionState(txId, tx) {
    if (!txId) return
    set(state => {
      const newTransactions = { ...state.transactions, [txId]: tx }
      return {
        transactions: newTransactions,
        currentTransaction: txId === state.txLocalId ? tx : state.currentTransaction
      }
    })
  },
  getTransaction(id) {
    return get().transactions[id]
  }
}))
