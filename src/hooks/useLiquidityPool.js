import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useEarnPoolsStore } from 'src/store/useEarnPoolsStore'
import { nearestUsableTick, MAX_TICK, MIN_TICK } from 'src/components/utils/uniswap'

export const useLiquidityPool = () => {
  const {
    chainId,
    ids,
    protocol,
    tokens,
    dex,
    positionId,
    tokenId,
    type: liquidityType
  } = useEarnPoolsStore(state => state.liquidityModal) || {}

  const { data: pool, isLoading: isLoadingInfo } = useQuery({
    queryKey: ['liquidityPoolInfo', chainId, ids, protocol],
    queryFn: async () => {
      try {
        const token0Address = tokens[0].address
        const token1Address = tokens[1].address

        const [poolRes, priceRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_EARN_POOL_INFO}`, {
            params: {
              chainId,
              address: ids,
              protocol
            }
          }),

          axios.post(
            `${process.env.NEXT_PUBLIC_TOKEN_API}/v1/public/tokens/prices`,
            JSON.stringify({
              [chainId]: [token0Address, token1Address]
            })
          )
        ])

        const { data: pool } = poolRes.data
        const { data: priceData } = priceRes.data

        const prices = priceData?.[chainId]

        return {
          ...pool,
          type: pool.positionInfo?.liquidity ? 'v3' : 'v2',
          token0: {
            ...pool.tokens[0],
            price: prices[token0Address].PriceBuy,
            logoURI: tokens[0].logoURI ?? tokens[0].logo
          },
          token1: {
            ...pool.tokens[1],
            price: prices[token1Address].PriceBuy,
            logoURI: tokens[1].logoURI ?? tokens[1].logo
          },
          ...(pool.positionInfo?.tickSpacing && {
            minTick: nearestUsableTick(MIN_TICK, pool.positionInfo.tickSpacing),
            maxTick: nearestUsableTick(MAX_TICK, pool.positionInfo.tickSpacing)
          })
        }
      } catch (err) {
        console.log('error', err.message)
        return {
          type: 'error'
        }
      }
    },

    refetchInterval: 5000,
    enabled: !!chainId && !!ids && !!protocol && tokens?.length == 2
  })

  return {
    pool,
    isLoadingInfo,
    chainId,
    ids,
    protocol,
    dex,
    liquidityType,
    positionId,
    tokenId,
    tokens
  }
}
