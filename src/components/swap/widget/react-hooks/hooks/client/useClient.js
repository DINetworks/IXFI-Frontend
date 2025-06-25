import { useQuery } from '@tanstack/react-query'
import { DEFAULT_COUNTRY_CODE } from '../../core/constants'
import { keys } from '../../core/queries/queries-keys'
import { countryCurrencyMap } from '../../services/internal/countryCurrencyMap'
import { getUserCountry } from '../../services/internal/fiatToCryptoService'

const CACHE_TIME = 1000 * 60 * 60 * 24 * 2 // 2 days
const STALE_TIME = 1000 * 60 * 60 * 12 // 12 hours

// List of European Union country codes that use the Euro
const EU_COUNTRIES = [
  'at',
  'be',
  'bg',
  'hr',
  'cy',
  'cz',
  'dk',
  'ee',
  'fi',
  'fr',
  'de',
  'gr',
  'hu',
  'ie',
  'it',
  'lv',
  'lt',
  'lu',
  'mt',
  'nl',
  'pl',
  'pt',
  'ro',
  'sk',
  'si',
  'es',
  'se'
]

export const useClient = () => {
  const isClient = typeof window !== 'undefined'
  const clientWindow = isClient ? window : undefined

  const { data: countryData } = useQuery({
    queryKey: keys().country(),
    queryFn: getUserCountry,
    enabled: isClient,
    retry: false,
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME
  })

  const userCountry = countryData?.countryCode || DEFAULT_COUNTRY_CODE

  // Get default currency based on user country
  const defaultCurrency = (() => {
    const userCountryLower = userCountry.toLowerCase()
    // Check if user is from an EU country
    if (EU_COUNTRIES.includes(userCountryLower)) {
      return 'EUR'
    }
    // Fall back to country-specific currency or USD
    const countryInfo = countryCurrencyMap.find(c => c.countryCode.toLowerCase() === userCountryLower)

    return countryInfo?.currencyCode || 'USD'
  })()

  return { clientWindow, isClient, userCountry, defaultCurrency }
}
