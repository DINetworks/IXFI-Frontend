import { ChainType } from '@0xsquid/squid-types'
import { useCallback, useMemo } from 'react'
import { filterChains } from '../../services'
import { useConfigStore, useSwapStore } from '../store/useSwapStore'

// Memoized map to store chain data, calculated only once
let memoizedChainsByIdMap = null

// Optimize calculation to prevent unnecessary re-renders
// This ensures the map is created only once when chains are available
const createChainsByIdMap = chains => {
  if (memoizedChainsByIdMap) return memoizedChainsByIdMap
  if (chains.length > 0) {
    memoizedChainsByIdMap = chains.reduce((acc, chain) => {
      acc[chain.chainId] = chain
      return acc
    }, {})
    return memoizedChainsByIdMap
  }
  return null
}

export const useSquidChains = direction => {
  const squid = useSwapStore(state => state.squid)
  const config = useConfigStore(state => state.config)

  const fuseSearchOptions = useMemo(() => {
    return {
      isCaseSensitive: false,
      includeScore: false,
      minMatchCharLength: 1,
      threshold: 0.1,
      keys: ['networkName', 'chainName', 'nativeCurrency.symbol']
    }
  }, [])

  const chains = useMemo(() => {
    if (!squid?.chains) return []
    if (!direction) return squid.chains

    return filterChains({
      chains: squid.chains,
      config: {
        disabledChains: config.disabledChains
      },
      direction
    })
  }, [squid?.chains, direction, config.disabledChains])

  const chainsByIdMap = useMemo(
    () => createChainsByIdMap(chains),

    // Only re-render if the chains id array has changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains.map(c => c.chainId)]
  )

  const findChain = useCallback(
    chainId => {
      return chainId ? chainsByIdMap?.[chainId] : undefined
    },
    [chainsByIdMap]
  )

  const getChainType = useCallback(
    chainId => {
      if (!chainId) return undefined
      const chain = findChain(chainId)
      return chain?.chainType
    },
    [findChain]
  )

  const { evmChains, cosmosChains, suiChains } = useMemo(() => {
    return chains.reduce(
      (acc, chain) => {
        switch (chain.chainType) {
          case ChainType.EVM:
            acc.evmChains.push(chain)
            break
          case ChainType.COSMOS:
            acc.cosmosChains.push(chain)
            break
          case ChainType.SUI:
            acc.suiChains.push(chain)
            break
        }
        return acc
      },
      {
        evmChains: [],
        cosmosChains: [],
        suiChains: []
      }
    )
  }, [chains])

  const supportedSourceChains = useMemo(() => {
    if (config.availableChains && config.availableChains?.source && config.availableChains.source.length > 0) {
      return chains.filter(c => config.availableChains?.source?.includes(c.chainId))
    }
    return chains
  }, [chains, config.availableChains])

  const supportedDestinationChains = useMemo(() => {
    if (
      config.availableChains &&
      config.availableChains?.destination &&
      config.availableChains.destination.length > 0
    ) {
      return chains.filter(c => config.availableChains?.destination?.includes(c.chainId))
    }
    return chains
  }, [chains, config.availableChains])

  return {
    supportedSourceChains,
    supportedDestinationChains,
    chains,
    fuseSearchOptions,
    cosmosChains,
    evmChains,
    suiChains,
    getChainType,
    findChain
  }
}
