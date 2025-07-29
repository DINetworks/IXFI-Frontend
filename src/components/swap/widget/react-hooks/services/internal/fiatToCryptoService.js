import axios from 'axios'
import { countries } from 'countries-list'
import getSymbolFromCurrency from 'currency-symbol-map'
import { DEFAULT_COUNTRY_CODE, internalSquidApiBaseUrl } from '../../core/constants'
import { countryCurrencyMap } from './countryCurrencyMap'

export const getUserCountry = async () => {
  try {
    const { data } = await axios.get(`${internalSquidApiBaseUrl}/country`)
    return data
  } catch (error) {
    return {
      countryName: 'United Kingdom',
      countryCode: DEFAULT_COUNTRY_CODE
    }
  }
}

/**
 * Get country data from country code
 * TODO: Host the flags on our own CDN
 * @param countryCode - The country code (e.g., "US", "GB")
 * @returns Country details including name, flag URL, and other information
 */
export function getCountryData(countryCode) {
  const countryCodeUpper = countryCode.toUpperCase()
  const countryCodeLower = countryCode.toLowerCase()
  return {
    ...countries[countryCodeUpper],
    code: countryCodeUpper,
    flagUrl: countryCodeLower ? `https://flagcdn.com/w80/${countryCodeLower}.png` : ''
  }
}

/**
 * Get currency data from currency code
 */
export function getCurrencyData(currencyCode) {
  const symbol = getSymbolFromCurrency(currencyCode)
  if (!symbol) return undefined
  const currencyInfo = countryCurrencyMap.find(c => c.currencyCode === currencyCode)
  const countryData = getCountryData(currencyInfo?.countryCode ?? '')
  return {
    denomination: currencyCode,
    symbol,
    name: currencyInfo?.name,
    flagUrl: countryData.flagUrl
  }
}

/**
 * Adaptive rounding: rounds value up to a nice number based on its magnitude
 * e.g. 3840 -> 4000, 38400 -> 40000, 384000 -> 400000
 * For values >= 100, round up to the nearest power-of-ten
 */
export const adaptiveRound = value => {
  if (value < 10) return Math.round(value * 100) / 100
  if (value < 100) return Math.round(value)
  if (value < 100) return Math.round(value)
  // For 100 and above, round up to the nearest power of ten
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  return Math.ceil(value / magnitude) * magnitude
}

/**
 * Get suggested amounts for a given currency code, based on rateAgainstUSD
 * Returns 3 amounts (low, medium, high) roughly equivalent to $100, $500, $1000 in local currency
 */
export function getSuggestedAmountsForCurrency(currencyCode) {
  const baseUsdAmounts = [100, 500, 1000]
  const currencyInfo = countryCurrencyMap.find(c => c.currencyCode === currencyCode)
  if (!currencyInfo?.rateAgainstUSD || currencyInfo.rateAgainstUSD <= 0) {
    return baseUsdAmounts
  }
  if (currencyInfo.rateAgainstUSD >= 0.7 && currencyInfo.rateAgainstUSD <= 1.3) {
    return baseUsdAmounts
  }
  const amounts = baseUsdAmounts.map(usd => usd * currencyInfo.rateAgainstUSD)
  return amounts.map(adaptiveRound)
}
