import { create } from "zustand"

export const useFiatOnRampStore = create((set) => ({
    selectedCountry: undefined,
    selectedToken: undefined,
    currentQuote: undefined,
    selectedCurrency: undefined,
    selectedQuote: undefined,
    selectedPaymentMethod: undefined,
    destinationAddress: undefined,
    setSelectedProvider: () => set({}), // Keep for backward compatibility
    setSelectedCountry: (country) => set({ selectedCountry: country }),
    setSelectedToken: (token) => set({ selectedToken: token }),
    setCurrentQuote: (quote) => set({ currentQuote: quote }),
    setSelectedQuote: (quote) => set({ selectedQuote: quote }),
    setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
    setSelectedPaymentMethod: (paymentMethod) => set({ selectedPaymentMethod: paymentMethod }),
    setDestinationAddress: (address) => set({ destinationAddress: address }),
}))
