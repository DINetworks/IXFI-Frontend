import { useTokenPrices } from './useTokenPrices'

export const useMarketPrice = (chainId, tokensAddress) => {
  const { prices } = useTokenPrices({
    addresses: tokensAddress
      .split(',')
      .filter(Boolean)
      .map(item => item.toLowerCase()),
    chainId
  })

  return tokensAddress
    .split(',')
    .filter(Boolean)
    .map(item => prices[item.toLowerCase()] || 0)
}
