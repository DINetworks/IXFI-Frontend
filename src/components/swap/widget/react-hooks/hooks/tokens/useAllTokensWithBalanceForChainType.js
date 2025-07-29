import { ChainType } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCosmosContext } from '../../core'
import { keys } from '../../core/queries/queries-keys'
import { calculateTotalUsdBalanceUSD, getAllKeysForSupportedCosmosChains } from '../../services'
import {
  getAllBitcoinTokensBalance,
  getAllCosmosBalances,
  getAllEvmTokensBalance,
  getAllSolanaTokensBalance,
  getAllSuiTokensBalance
} from '../../services/external/rpcService'
import { useSquidChains } from '../chains/useSquidChains'
import { useSquidTokens } from './useSquidTokens'

export const useAllTokensWithBalanceForChainType = ({ chainType, address, direction, queryOptions }) => {
  const { cosmosChains, suiChains, chains } = useSquidChains(direction)
  const { evmTokens, cosmosTokens, solanaTokens, bitcoinTokens, suiTokens, xrplTokens } = useSquidTokens(direction)
  const { keplrTypeWallet } = useCosmosContext()

  const placeholderData = useMemo(() => {
    const tokens = {
      [ChainType.EVM]: evmTokens.map(t => ({ ...t, balance: '0' })),
      [ChainType.COSMOS]: cosmosTokens.map(t => ({ ...t, balance: '0' })),
      [ChainType.SOLANA]: solanaTokens.map(t => ({ ...t, balance: '0' })),
      [ChainType.BTC]: bitcoinTokens.map(t => ({ ...t, balance: '0' })),
      [ChainType.SUI]: suiTokens.map(t => ({ ...t, balance: '0' })),
      [ChainType.XRPL]: xrplTokens.map(t => ({ ...t, balance: '0' }))
    }

    if (!chainType) {
      // Return all tokens with zero balance
      return {
        tokens: Object.values(tokens).flat(),
        totalUsdBalance: '0'
      }
    }

    return {
      tokens: tokens[chainType],
      totalUsdBalance: '0'
    }
  }, [chainType, evmTokens, cosmosTokens, solanaTokens, bitcoinTokens, suiTokens, xrplTokens])

  const isQueryEnabled = useMemo(() => {
    // Respect the queryOptions.enabled override if provided
    if (queryOptions?.enabled === false) return false
    if (!chainType || !address) return false

    switch (chainType) {
      case ChainType.EVM:
        return evmTokens.length > 0
      case ChainType.COSMOS:
        return cosmosTokens.length > 0
      case ChainType.SOLANA:
        return solanaTokens.length > 0
      case ChainType.BTC:
        return bitcoinTokens.length > 0
      case ChainType.SUI:
        return suiTokens.length > 0
      case ChainType.XRPL:
        return xrplTokens.length > 0
    }
  }, [
    chainType,
    address,
    queryOptions?.enabled,
    evmTokens.length,
    cosmosTokens.length,
    solanaTokens.length,
    bitcoinTokens.length,
    suiTokens.length,
    xrplTokens.length
  ])

  const query = useQuery({
    queryKey: keys().allTokensBalance(address, chainType),
    queryFn: async () => {
      // Return zero balances if no address
      if (!address) {
        const defaultTokens = placeholderData.tokens

        return {
          tokens: defaultTokens,
          totalUsdBalance: calculateTotalUsdBalanceUSD(defaultTokens)
        }
      }
      let fetchedTokens = []

      // Fetch tokens based on chain type
      switch (chainType) {
        case ChainType.EVM:
          fetchedTokens = await getAllEvmTokensBalance(evmTokens, address, chains)
          break

        case ChainType.COSMOS:
          const addresses = await getAllKeysForSupportedCosmosChains(
            cosmosChains.map(c => c.chainId),
            keplrTypeWallet
          )
          fetchedTokens = await getAllCosmosBalances({
            addresses,
            cosmosChains,
            cosmosTokens
          })
          break

        case ChainType.SOLANA:
          fetchedTokens = await getAllSolanaTokensBalance(solanaTokens, address)
          break

        case ChainType.BTC:
          fetchedTokens = await getAllBitcoinTokensBalance(address, bitcoinTokens)
          break

        case ChainType.SUI:
          fetchedTokens = await getAllSuiTokensBalance(address, suiTokens, suiChains)
          break

        case ChainType.XRPL:
          const xrplChains = chains.filter(c => c.chainType === ChainType.XRPL)
          if (!xrplChains) throw new Error('No XRPL chains found')
          fetchedTokens = await getAllXrplTokensBalance(address, xrplTokens, xrplChains)
          break

        default:
          fetchedTokens = placeholderData.tokens
          break
      }
      return {
        tokens: fetchedTokens,
        totalUsdBalance: calculateTotalUsdBalanceUSD(fetchedTokens)
      }
    },
    ...queryOptions,
    enabled: isQueryEnabled
  })

  // Return placeholder if not fetched yet, otherwise return query data
  return {
    ...query,
    data: query.data ?? placeholderData
  }
}
