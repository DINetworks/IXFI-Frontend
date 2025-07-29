import { createContext, useContext } from 'react'
import { useEvm } from '../../hooks/evm/useEvm'

export const EvmContext = createContext(undefined)

export const EvmProvider = ({ children }) => {
  const evmContext = useEvm()

  return <EvmContext.Provider value={evmContext}>{children}</EvmContext.Provider>
}

export const useEvmContext = () => {
  const context = useContext(EvmContext)
  if (!context) {
    throw new Error('useEvmContext must be used within a EvmProvider')
  }

  return context
}
