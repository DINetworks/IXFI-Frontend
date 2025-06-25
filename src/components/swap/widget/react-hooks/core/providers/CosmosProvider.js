import { createContext, useContext } from 'react'
import { useCosmos } from '../../hooks/cosmos/useCosmos'

export const CosmosContext = createContext({
  getCosmosAddressForChain: async () => ''
})

export const CosmosProvider = ({ children }) => {
  const cosmosContext = useCosmos()
  return <CosmosContext.Provider value={cosmosContext}>{children}</CosmosContext.Provider>
}

export function useCosmosContext() {
  return useContext(CosmosContext)
}
