import { TOKEN_PRICE_API_URL } from '../../core/constants'
import { formatUsdAmount } from '../internal/numberService'

const MAX_COINGECKO_QUERY_TOKENS = 100

export const fetchHistoricalData = async (coingeckoId, timeFrame) => {
  const now = Math.floor(Date.now() / 1000)
  let from
  switch (timeFrame) {
    case '1H':
      from = now - 3600
      break
    case '1D':
      from = now - 86400
      break
    case '1W':
      from = now - 604800
      break
    case '1Y':
      from = now - 31536000
      break
  }
  try {
    const response = await fetch(
      `${TOKEN_PRICE_API_URL}?action=getHistoricalData&id=${coingeckoId}&vs_currency=usd&from=${from}&to=${now}`
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return null
  }
}

export const fetchTokensData = async tokens => {
  try {
    const coingeckoIds = Array.from(new Set(tokens.map(token => token.coingeckoId).filter(Boolean)))
    if (!coingeckoIds.length) {
      throw new Error('No valid CoinGecko IDs provided')
    }
    if (coingeckoIds.length > MAX_COINGECKO_QUERY_TOKENS) {
      throw new Error(`Too many tokens requested. Maximum allowed is ${MAX_COINGECKO_QUERY_TOKENS}.`)
    }
    const response = await fetch(`${TOKEN_PRICE_API_URL}?action=getCoinData&ids=${coingeckoIds.join(',')}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    if (!data || data.length === 0) {
      throw new Error('No data returned from API')
    }

    const tokenDataMap = new Map(
      data.map(coinData => [
        coinData.id,
        {
          price: coinData.current_price,
          priceChange: coinData.price_change_percentage_24h,
          volume24h: {
            formatted: formatUsdAmount(coinData.total_volume, {
              includeSign: false
            }),
            value: coinData.total_volume
          },
          marketCap: {
            formatted: formatUsdAmount(coinData.market_cap, {
              includeSign: false
            }),
            value: coinData.market_cap
          },
          totalSupply: {
            formatted: formatUsdAmount(coinData.total_supply, {
              includeSign: false
            }),
            value: coinData.total_supply
          },
          symbol: coinData.symbol,
          name: coinData.name,
          image: coinData.image,
          marketCapRank: coinData.market_cap_rank,
          fullyDilutedValuation: coinData.fully_diluted_valuation,
          high24h: coinData.high_24h,
          low24h: coinData.low_24h,
          priceChange24h: coinData.price_change_24h,
          marketCapChange24h: coinData.market_cap_change_24h,
          marketCapChangePercentage24h: coinData.market_cap_change_percentage_24h,
          circulatingSupply: coinData.circulating_supply,
          maxSupply: coinData.max_supply,
          ath: coinData.ath,
          athChangePercentage: coinData.ath_change_percentage,
          athDate: coinData.ath_date,
          atl: coinData.atl,
          atlChangePercentage: coinData.atl_change_percentage,
          atlDate: coinData.atl_date,
          roi: coinData.roi,
          lastUpdated: coinData.last_updated,
          priceChangePercentage24hInCurrency: coinData.price_change_percentage_24h_in_currency
        }
      ])
    )
    return tokens.map(token => ({
      ...token,
      tokenData: token.coingeckoId ? tokenDataMap.get(token.coingeckoId) || null : null
    }))
  } catch (error) {
    console.error('Error fetching tokens data:', error)
    return tokens.map(token => ({ ...token, tokenData: null }))
  }
}
