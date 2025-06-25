import { createContext, useContext } from 'react'
import { useSolana } from '../../hooks/solana/useSolana'

export const SolanaContext = createContext(undefined)

export const SolanaProvider = ({ children }) => {
  const solanaHook = useSolana()

  return <SolanaContext.Provider value={solanaHook}>{children}</SolanaContext.Provider>
}

export const useSolanaContext = () => {
  const context = useContext(SolanaContext)
  if (!context) {
    throw new Error('useSolanaContext must be used within a SolanaProvider')
  }

  return context
}
