import { ChainType } from '@0xsquid/squid-types'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useWallet } from '../wallet/useWallet'
import { useAllTokensWithBalanceForChainType } from './useAllTokensWithBalanceForChainType'

const BALANCE_STALE_TIME = 60000 // 1 minute
const BALANCE_CACHE_TIME = 300000 // 5 minutes

export const useAllConnectedWalletBalances = ({
  direction,
  queryOptions = {
    staleTime: BALANCE_STALE_TIME,
    cacheTime: BALANCE_CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  }
} = {}) => {
  const { connectedAddresses } = useWallet()
  const evmBalancesQuery = useAllTokensWithBalanceForChainType({
    chainType: ChainType.EVM,
    address: connectedAddresses?.[ChainType.EVM],
    direction,
    queryOptions: {
      ...queryOptions,
      enabled: Boolean(connectedAddresses?.[ChainType.EVM])
    }
  })

  const cosmosBalancesQuery = useAllTokensWithBalanceForChainType({
    chainType: ChainType.COSMOS,
    address: connectedAddresses?.[ChainType.COSMOS],
    direction,
    queryOptions: {
      ...queryOptions,
      enabled: Boolean(connectedAddresses?.[ChainType.COSMOS])
    }
  })

  const bitcoinBalancesQuery = useAllTokensWithBalanceForChainType({
    chainType: ChainType.BTC,
    address: connectedAddresses?.[ChainType.BTC],
    direction,
    queryOptions: {
      ...queryOptions,
      enabled: Boolean(connectedAddresses?.[ChainType.BTC])
    }
  })

  const solanaBalancesQuery = useAllTokensWithBalanceForChainType({
    chainType: ChainType.SOLANA,
    address: connectedAddresses?.[ChainType.SOLANA],
    direction,
    queryOptions: {
      ...queryOptions,
      enabled: Boolean(connectedAddresses?.[ChainType.SOLANA])
    }
  })

  const suiBalancesQuery = useAllTokensWithBalanceForChainType({
    chainType: ChainType.SUI,
    address: connectedAddresses?.[ChainType.SUI],
    direction,
    queryOptions: {
      ...queryOptions,
      enabled: Boolean(connectedAddresses?.[ChainType.SUI])
    }
  })

  const xrplBalancesQuery = useAllTokensWithBalanceForChainType({
    chainType: ChainType.XRPL,
    address: connectedAddresses?.[ChainType.XRPL],
    direction,
    queryOptions: {
      ...queryOptions,
      enabled: Boolean(connectedAddresses?.[ChainType.XRPL])
    }
  })

  // Create a map of chain type to balance query results
  const balanceQueries = useMemo(
    () => ({
      [ChainType.EVM]: evmBalancesQuery,
      [ChainType.COSMOS]: cosmosBalancesQuery,
      [ChainType.BTC]: bitcoinBalancesQuery,
      [ChainType.SOLANA]: solanaBalancesQuery,
      [ChainType.SUI]: suiBalancesQuery,
      [ChainType.XRPL]: xrplBalancesQuery
    }),
    [
      evmBalancesQuery,
      cosmosBalancesQuery,
      bitcoinBalancesQuery,
      solanaBalancesQuery,
      suiBalancesQuery,
      xrplBalancesQuery
    ]
  )

  // Combine all tokens from different chains
  const allTokens = useMemo(
    () => Object.values(balanceQueries).flatMap(query => query.data?.tokens ?? []),
    [balanceQueries]
  )
  // Calculate total USD balance across all chains
  const totalUsdBalance = useMemo(() => {
    return Object.values(balanceQueries)
      .reduce((total, query) => {
        const balanceStr = query?.data?.totalUsdBalance
        if (!balanceStr) return total

        const balance = new BigNumber(balanceStr)

        return balance.isFinite() ? total.plus(balance) : total
      }, new BigNumber(0))
      .toString()
  }, [balanceQueries])

  // Aggregate loading states
  const queryStates = useMemo(
    () => ({
      isInitialLoading: Object.values(balanceQueries).some(q => q.isInitialLoading),
      isFetching: Object.values(balanceQueries).some(q => q.isFetching),
      isLoading: Object.values(balanceQueries).some(q => q.isLoading),
      isRefetching: Object.values(balanceQueries).some(q => q.isRefetching),
      isError: Object.values(balanceQueries).some(q => q.isError),
      isSuccess: Object.values(balanceQueries).every(q => q.isSuccess)
    }),
    [balanceQueries]
  )

  return {
    ...queryStates,
    tokens: allTokens,
    totalUsdBalance
  }
}
