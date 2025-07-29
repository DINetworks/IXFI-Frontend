import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { parseMarketTokenInfo } from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'

const CG_API = process.env.NEXT_PUBLIC_CG_API

export const useMarketTokenInfo = (chainId, tokenAddress) => {
  const { data: marketTokenInfo, loading } = useQuery({
    queryKey: ['tokenMarketInfo', chainId, tokenAddress],
    queryFn: async () => {
      try {
        const chainInfo = NETWORK_INFO[chainId]

        const tokenApi =
          tokenAddress === chainInfo.wrappedToken.address.toLowerCase()
            ? `${CG_API}/coins/${chainInfo.coingeckoNativeTokenId}`
            : `${CG_API}/coins/${chainInfo.coingeckoNetworkId}/contract/${tokenAddress}`

        const { data } = await axios.get(tokenApi)

        return parseMarketTokenInfo({
          price: data?.market_data?.current_price?.usd || 0,
          marketCap: data?.market_data?.market_cap?.usd || 0,
          marketCapRank: data?.market_data?.market_cap_rank || 0,
          circulatingSupply: data?.market_data?.circulating_supply || 0,
          totalSupply: data?.market_data?.total_supply || 0,
          allTimeHigh: data?.market_data?.ath?.usd || 0,
          allTimeLow: data?.market_data?.atl?.usd || 0,
          tradingVolume: data?.market_data?.total_volume?.usd || 0,
          description: data?.description || { en: '' },
          name: data?.name || ''
        })
      } catch (e) {
        console.log(e.message)
      }
    },
    enabled: !!chainId && !!tokenAddress,
    refetchInterval: 10000
  })

  return {
    loading,
    marketTokenInfo
  }
}

export default useMarketTokenInfo
