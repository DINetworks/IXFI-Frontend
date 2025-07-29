import { ChainType } from '@0xsquid/squid-types'
import { useCallback, useMemo } from 'react'
import { filterTokens, getDisabledChainsIds, sortAllTokens } from '../../services'
import { useSquid } from '../squid/useSquid'
import { useConfigStore } from '../store/useSwapStore'

export const useSquidTokens = direction => {
  const { tokens: allSquidTokens = [], squidInfoQuery } = useSquid()
  const disabledChains = useConfigStore(state => state.config.disabledChains)

  const updatedTokens = useMemo(() => {
    let tokenArray = allSquidTokens
    if (squidInfoQuery.isSuccess && squidInfoQuery?.data && squidInfoQuery?.data?.tokens?.length > 0) {
      tokenArray = squidInfoQuery?.data?.tokens
    }

    return filterTokens({
      tokens: tokenArray,
      config: {
        disabledChains
      },
      direction
    }).sort(sortAllTokens)
  }, [squidInfoQuery.isSuccess, squidInfoQuery.data, allSquidTokens, disabledChains, direction])

  const disabledChainsForDirection = useMemo(
    () =>
      getDisabledChainsIds({
        config: {
          disabledChains
        },
        direction
      }),
    [direction, disabledChains]
  )

  const filteredTokensForDirection = useMemo(
    () => updatedTokens?.filter(token => !disabledChainsForDirection.includes(String(token.chainId))),
    [updatedTokens, disabledChainsForDirection]
  )

  const { evmTokens, cosmosTokens, solanaTokens, bitcoinTokens, suiTokens, xrplTokens } = useMemo(() => {
    return filteredTokensForDirection?.reduce(
      (acc, token) => {
        switch (token.type) {
          case ChainType.EVM:
            acc.evmTokens.push(token)
            break
          case ChainType.COSMOS:
            acc.cosmosTokens.push(token)
            break
          case ChainType.SOLANA:
            acc.solanaTokens.push(token)
            break
          case ChainType.BTC:
            acc.bitcoinTokens.push(token)
            break
          case ChainType.SUI:
            acc.suiTokens.push(token)
            break
          case ChainType.XRPL:
            acc.xrplTokens.push(token)
            break
        }

        return acc
      },
      {
        evmTokens: [],
        cosmosTokens: [],
        solanaTokens: [],
        bitcoinTokens: [],
        suiTokens: [],
        xrplTokens: []
      }
    )
  }, [filteredTokensForDirection])

  const findToken = useCallback(
    (address, chainId) => {
      if (!address || !chainId) return undefined

      return updatedTokens?.find(t => t.address === address && t.chainId === chainId)
    },
    [updatedTokens]
  )
  return {
    tokens: updatedTokens,
    findToken,
    evmTokens,
    solanaTokens,
    cosmosTokens,
    bitcoinTokens,
    suiTokens,
    xrplTokens
  }
}
