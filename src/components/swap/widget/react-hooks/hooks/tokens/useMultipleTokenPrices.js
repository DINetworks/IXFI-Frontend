import { useQuery } from '@tanstack/react-query'
import { TOKEN_PRICE_API_URL } from '../../core/constants'
import { keys } from '../../core/queries/queries-keys'

export const useMultipleTokenPrices = tokens => {
  const coingeckoIds = Array.from(new Set(tokens.map(token => token.coingeckoId).filter(Boolean)))

  const coinGeckoQuery = useQuery({
    queryKey: keys().coinGeckoPrices(coingeckoIds),
    queryFn: async () => {
      if (coingeckoIds.length === 0) return {}

      const params = new URLSearchParams({
        action: 'getTokenPrices',
        ids: coingeckoIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      })
      const response = await fetch(`${TOKEN_PRICE_API_URL}?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch token prices')
      }
      return response.json()
    },
    enabled: coingeckoIds.length > 0
  })

  const tokenPrices = coingeckoIds.reduce((acc, id) => {
    const data = coinGeckoQuery.data?.[id]
    if (data) {
      acc[id] = {
        price: data.usd,
        price24hChange: data.usd_24h_change,
        isUp: data.usd_24h_change > 0
      }
    }
    return acc
  }, {})
  const getTokenPrice = coingeckoId => tokenPrices[coingeckoId]
  return {
    tokenPrices,
    getTokenPrice,
    isLoading: coinGeckoQuery.isLoading,
    isError: coinGeckoQuery.isError,
    error: coinGeckoQuery.error,
    refetch: coinGeckoQuery.refetch
  }
}
