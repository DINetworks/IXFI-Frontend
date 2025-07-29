import { useQuery } from '@tanstack/react-query'
import { chainIdToChain } from 'src/components/utils/uniswap'
import { poolTypeToDexId } from 'src/configs/protocol'

export const useZapOutAction = ({ chainId, poolAddress, protocol, positionId, liquidityOut, tokenOut }) => {
  const { data: zapOutInfo, isLoading: isLoadingZapOutRoute } = useQuery({
    queryKey: ['zapOutInfo', chainId, poolAddress, positionId, liquidityOut, tokenOut?.address],
    queryFn: async () => {
      const params = {
        dexFrom: poolTypeToDexId[protocol], //poolTypeToDexId[poolType],
        'poolFrom.id': poolAddress,
        'positionFrom.id': positionId,
        liquidityOut: liquidityOut.toString(),
        tokenOut: tokenOut.address,
        slippage: 50
      }

      let search = ''
      Object.keys(params).forEach(key => {
        search = `${search}&${key}=${params[key]}`
      })

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ZAP_API}/${chainIdToChain[chainId]}/api/v1/out/route?${search.slice(1)}`
        ).then(res2 => res2.json())

        console.log('Zap to', res.data)

        return res.data
      } catch (e) {
        console.log(e)

        return {}
      }
    },
    enabled: !!chainId && !!poolAddress && !!positionId && !!liquidityOut && !!tokenOut?.address,
    refetchInterval: 15000
  })

  return { zapOutInfo, isLoadingZapOutRoute }
}
