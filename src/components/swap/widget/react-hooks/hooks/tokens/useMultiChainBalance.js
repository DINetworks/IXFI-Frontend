import { ChainType } from '@0xsquid/squid-types'
import { useMemo } from 'react'
import {
  useBitcoinBalance,
  useCosmosBalance,
  useEvmBalance,
  useSolanaBalance,
  useSuiBalance,
  useXrplBalance
} from './useBalance'

/**
 * Hook to get balance depending on the chain type
 * @param {ChainData} chain
 * @param {Token} token
 * @param {string} userAddress
 * @param {boolean} enabled
 * @returns balance as string
 */
export const useMultiChainBalance = ({ chain, token, userAddress, enabled = true }) => {
  const { balance: evmBalance } = useEvmBalance({
    chain,
    token,
    userAddress,
    enabled: chain?.chainType === ChainType.EVM && enabled
  })

  const { balance: cosmosBalance } = useCosmosBalance({
    chain,
    token,
    userAddress,
    enabled: chain?.chainType === ChainType.COSMOS && enabled
  })

  const { balance: bitcoinBalance } = useBitcoinBalance({
    chain,
    token,
    userAddress,
    enabled: chain?.chainType === ChainType.BTC && enabled
  })

  const { balance: solanaBalance } = useSolanaBalance({
    chain,
    token,
    userAddress,
    enabled: chain?.chainType === ChainType.SOLANA && enabled
  })

  const { balance: suiBalance } = useSuiBalance({
    chain,
    token,
    userAddress,
    enabled: chain?.chainType === ChainType.SUI && enabled
  })

  const { balance: xrplBalance } = useXrplBalance({
    chain,
    token,
    userAddress,
    enabled: chain?.chainType === ChainType.XRPL && enabled
  })

  const balance = useMemo(() => {
    if (!chain?.chainType) return '0'
    switch (chain.chainType) {
      case ChainType.EVM:
        return evmBalance
      case ChainType.COSMOS:
        return cosmosBalance
      case ChainType.BTC:
        return bitcoinBalance
      case ChainType.SOLANA:
        return solanaBalance
      case ChainType.SUI:
        return suiBalance
      case ChainType.XRPL:
        return xrplBalance
    }
  }, [chain?.chainType, evmBalance, cosmosBalance, bitcoinBalance, solanaBalance, suiBalance, xrplBalance])

  return { balance }
}
