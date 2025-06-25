import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultConfigValues } from '../../core/constants'

export const useSwapStore = create(() => ({
  squid: undefined,
  maintenanceMode: {
    active: false,
    message: undefined
  }
}))

export const useConfigStore = create(() => ({
  config: defaultConfigValues,
  isInitialized: false
}))

export const useTransactionStore = create((set, get) => ({
  fromPrice: undefined,
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

export const useSwapRoutePersistStore = create()(
  persist(
    set => ({
      swapRoute: undefined,
      resetAddresses: () =>
        set(state => ({
          swapRoute: state.swapRoute
            ? {
                ...state.swapRoute,
                destinationAddress: undefined,
                fallbackAddress: undefined
              }
            : undefined
        }))
    }),
    {
      name: 'squid-swap-route.store',
      onRehydrateStorage: () => state => {
        // Reset addresses on page load/rehydration
        state?.resetAddresses()
      }
    }
  )
)
