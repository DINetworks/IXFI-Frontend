import { create } from "zustand"

export const useSendStore = create((set) => ({
    token: undefined,
    amount: undefined,
    toAddress: undefined,
    setToken: (token) => set({ token }),
    setAmount: (amount) => set({ amount }),
    setDestinationAddress: (address) => set({ toAddress: address }),
}))
