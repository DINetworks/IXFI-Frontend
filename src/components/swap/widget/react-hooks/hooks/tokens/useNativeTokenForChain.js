import { ChainType } from '@0xsquid/squid-types'
import { useMemo } from 'react'
import { findNativeToken } from '../../services'
import { useSquidTokens } from './useSquidTokens'

export function useNativeTokenForChain(chain) {
  const { evmTokens, cosmosTokens, solanaTokens, bitcoinTokens, suiTokens, xrplTokens } = useSquidTokens()

  const getTokensForChainType = () => {
    if (!chain?.chainType) return []
    switch (chain.chainType) {
      case ChainType.EVM:
        return evmTokens
      case ChainType.COSMOS:
        return cosmosTokens
      case ChainType.SOLANA:
        return solanaTokens
      case ChainType.BTC:
        return bitcoinTokens
      case ChainType.SUI:
        return suiTokens
      case ChainType.XRPL:
        return xrplTokens
    }
  }

  const nativeTokenForChainType = useMemo(() => {
    return findNativeToken(getTokensForChainType(), chain)
  }, [chain])

  return { nativeToken: nativeTokenForChainType }
}
