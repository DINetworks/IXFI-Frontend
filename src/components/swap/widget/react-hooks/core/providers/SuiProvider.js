import { createContext, useContext } from 'react'
import { useSui } from '../../hooks/sui/useSui'

export const SuiContext = createContext(undefined)

export const SuiProvider = ({ children }) => {
  const suiContext = useSui()

  return <SuiContext.Provider value={suiContext}>{children}</SuiContext.Provider>
}

export const useSuiContext = () => {
  const context = useContext(SuiContext)
  if (!context) {
    throw new Error('useSuiContext must be used within a SuiProvider')
  }

  return context
}
