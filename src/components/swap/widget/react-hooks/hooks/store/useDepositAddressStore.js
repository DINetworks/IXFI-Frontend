import { create } from 'zustand'

export const useDepositAddressStore = create(set => ({
  deposit: null,
  isEnabled: false,
  setDeposit: data => {
    set({ deposit: data })
  },
  toggleDepositFlow: enabled => {
    set({ isEnabled: enabled })
  }
}))
