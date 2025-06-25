import { useQuery } from '@tanstack/react-query'
import { keys } from '../../core/queries/queries-keys'
import { EnsService } from '../../services/external/ens'
import { useDebouncedValue } from '../utils/useUtils'

/**
 * Returns the ENS data of the given address
 *
 * @param address - the address to get the ENS name of
 * @returns the ENS data of the given address
 */
export function useEnsDataForAddress({ address, options }) {
  const ensQuery = useQuery({
    queryKey: keys().ensData(address?.toLowerCase()),
    queryFn: () => EnsService.getEnsDataFromAddress(address),
    ...options,
    enabled: Boolean(address?.trim()) && (options?.enabled === undefined ? true : options.enabled),
    cacheTime: Infinity
  })

  return ensQuery
}

/**
 * Search for ENS names.
 * Returns an exact match if the name is an ENS name, and multiple matches otherwise.
 *
 * @param name - the name to search for
 * @param enabled - whether the search is enabled or not
 * @param delayMs - the debounce delay in milliseconds
 *
 * @returns the ENS search query
 */
export function useEnsSearch({ name, enabled = true, delayMs = 500 }) {
  const debouncedName = useDebouncedValue(enabled ? name : undefined, delayMs)
  const ensSearchQuery = useQuery({
    queryKey: keys().ensSearch(debouncedName),
    queryFn: () => {
      const isExactEnsSearch = checkIsExactEns(debouncedName)
      return isExactEnsSearch ? EnsService.getExactEns(debouncedName) : EnsService.searchEnsNames(debouncedName)
    },
    enabled: Boolean(debouncedName?.trim()) && enabled,
    cacheTime: Infinity
  })

  return ensSearchQuery
}

const ENS_DOMAINS = ['eth', 'cb.id', 'xyz', 'app', 'link', 'bit', 'crypto']

/**
 * Checks if the given name is an exact ens name
 * like "smth.eth", "smth.cb.id", "smth.xyz", etc...
 */
function checkIsExactEns(name = '') {
  if (!name) return false

  const nameParts = name.split('.')
  if (nameParts.length < 2) return false

  const tld = nameParts[nameParts.length - 1]

  return ENS_DOMAINS.includes(tld)
}
