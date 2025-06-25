import React, { createContext, useContext } from 'react'
import { useBitcoin } from '../../hooks/bitcoin/useBitcoin'

export const BitcoinContext = createContext(undefined)

export const BitcoinProvider = ({ children }) => {
  const bitcoinContext = useBitcoin()

  return <BitcoinContext.Provider value={bitcoinContext}>{children}</BitcoinContext.Provider>
}

export const useBitcoinContext = () => {
  const context = useContext(BitcoinContext)
  if (!context) {
    throw new Error('useBitcoinContext must be used within a BitcoinProvider')
  }

  return context
}
