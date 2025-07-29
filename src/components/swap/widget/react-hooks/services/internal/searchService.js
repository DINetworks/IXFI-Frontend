import Fuse from 'fuse.js'
import { nativeEvmTokenAddress } from '../../core/constants'

const fuseSearchOptions = {
  isCaseSensitive: false,
  threshold: 0.1,
  findAllMatches: false,
  includeMatches: true,
  keys: [
    { name: 'symbol', weight: 1 },
    { name: 'name', weight: 0.8 }
  ]
}

/**
 * Minimum length of a search query to search by address
 * Some tokens can have very short addresses (e.g. "uosmo", "uixo", "satoshi", etc...)
 * We don't want to search by address for these short queries
 * as they can conflict with other tokens' symbols
 *
 * This value is arbitrary and can be adjusted as needed
 * but most blockchains should have longer addresses than this
 */
const minAddressLength = 7

/**
 * Searches for tokens based on a query string, prioritizing results in the following order:
 * 1. Exact address (if query is long enough)
 * 2. ETH on Ethereum mainnet (chainId 1)
 * 3. Native tokens of chains matching the query (e.g., BNB when searching for "binance")
 * 4. Exact matches for native tokens (e.g., native FTM when searching for "FTM")
 * 5. Other exact matches for token names or symbols
 * 6. Other native tokens that partially match the query
 * 7. Remaining tokens that partially match the query
 *
 * @param query - The search query string
 * @param tokens - Array of all available tokens
 * @param chains - Array of chain data
 * @returns An array of tokens sorted according to the priority described above
 */
export const searchTokens = (query, tokens, chains) => {
  // Query must at least be 2 characters long
  if (query.length <= 1) return tokens

  // Check for exact address match first, only if query is long enough
  const exactAddressMatches =
    query.length >= minAddressLength ? tokens.filter(token => token.address.toLowerCase() === query.toLowerCase()) : []
  // There can be multiple matches for the same address,
  // e.g. ITS tokens share address across chains
  if (exactAddressMatches.length > 0) {
    return exactAddressMatches
  }
  // Init fuse.js
  const fuse = new Fuse(tokens, fuseSearchOptions)
  // Perform the search with fuse
  const searchResults = fuse.search(query)

  // Find native tokens that match the query or related chain names
  const nativeTokens = chains
    .filter(
      chain =>
        chain.nativeCurrency.symbol.toLowerCase() === query.toLowerCase() ||
        chain.nativeCurrency.name.toLowerCase().includes(query.toLowerCase()) ||
        chain.networkName.toLowerCase().includes(query.toLowerCase()) ||
        chain.axelarChainName.toLowerCase().includes(query.toLowerCase())
    )
    .map(chain =>
      tokens.find(token => token.chainId === chain.chainId && token.address.toLowerCase() === nativeEvmTokenAddress)
    )
    .filter(token => token !== undefined)
  // Separate ETH on Ethereum mainnet (chainId 1) for top priority
  const ethMainnet = nativeTokens.find(token => token.symbol === 'ETH' && token.chainId === '1')
  const otherNativeTokens = nativeTokens.filter(token => !(token.symbol === 'ETH' && token.chainId === '1'))

  // Find exact matches for token name or symbol
  const exactMatches = searchResults
    .map(result => result.item)
    .filter(
      token => token.name.toLowerCase() === query.toLowerCase() || token.symbol.toLowerCase() === query.toLowerCase()
    )

  // Prioritize native tokens within exact matches
  const prioritizedExactMatches = exactMatches.sort((a, b) => {
    const aIsNative = a.address.toLowerCase() === nativeEvmTokenAddress
    const bIsNative = b.address.toLowerCase() === nativeEvmTokenAddress
    if (aIsNative && !bIsNative) return -1
    if (!aIsNative && bIsNative) return 1
    return 0
  })

  // Collect remaining search results that aren't exact matches
  const otherResults = searchResults
    .map(result => result.item)
    .filter(
      token => !(token.name.toLowerCase() === query.toLowerCase() || token.symbol.toLowerCase() === query.toLowerCase())
    )

  // Combine all results in the desired priority order
  const combinedResults = [
    ...(ethMainnet ? [ethMainnet] : []),
    ...otherNativeTokens,
    ...prioritizedExactMatches,
    ...otherResults
  ]
  // Remove any duplicate tokens from the results
  const uniqueResults = Array.from(new Set(combinedResults))
  return uniqueResults
}
