import { createContext, useContext } from 'react'
import { useXrpl } from '../../hooks/xrpl/useXrpl'

export const XrplContext = createContext(undefined)

export const XrplProvider = ({ children }) => {
  const xrplContext = useXrpl()

  return <XrplContext.Provider value={xrplContext}>{children}</XrplContext.Provider>
}

export const useXrplContext = () => {
  const context = useContext(XrplContext)
  if (!context) {
    throw new Error('useXrplContext must be used within a XrplProvider')
  }

  return context
}
