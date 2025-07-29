import { useQuery } from '@tanstack/react-query'
import { keys } from '../../core/queries/queries-keys'
import { fetchHistoricalData, fetchTokensData } from '../../services/external/tokenDataService'

// Coingecko has a limit for some queries for multiple tokens, not sure what it is, but let's use 100 for now
export const useHistoricalData = (coingeckoId, timeFrame) => {
  return useQuery({
    queryKey: keys().historicalData(coingeckoId, timeFrame),
    queryFn: () => fetchHistoricalData(coingeckoId, timeFrame),
    staleTime: 5 * 60 * 1000,
    enabled: !!coingeckoId
  })
}

export const useTokensData = tokens => {
  return useQuery({
    queryKey: keys().tokensData(tokens),
    queryFn: () => fetchTokensData(tokens),
    staleTime: 60 * 1000,
    enabled: !!tokens && tokens.length > 0
  })
}

export const useTokenData = token => {
  return useQuery({
    queryKey: keys().tokenData(token),
    queryFn: () => fetchTokensData([token]).then(tokens => tokens[0]),
    staleTime: 60 * 1000,
    enabled: !!token
  })
}
