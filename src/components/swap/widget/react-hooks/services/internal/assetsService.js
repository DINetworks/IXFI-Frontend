import { ChainType } from '@0xsquid/squid-types'
import BigNumber from 'bignumber.js'
import {
  CHAIN_IDS,
  destinationAddressResetValue,
  fallbackAddressResetValue,
  nativeEvmTokenAddress
} from '../../core/constants'
import { filterTokensForDestination, getInitialOrDefaultTokenAddressForChain, getTokensForChain } from './configService'
import { convertTokenAmountToUSD } from './priceService'
import { isWalletAddressValid } from './walletService'

export const assetsBaseUrl = 'https://raw.githubusercontent.com/0xsquid/assets/main'

export const shareSubgraphId = (token1, token2) => {
  return Boolean(
    token1?.subGraphIds?.some(sgi => !!token2?.subGraphIds?.includes(sgi)) ||
      token2?.subGraphIds?.some(sgi => !!token1?.subGraphIds?.includes(sgi))
  )
}

/**
 * Check if `tokenToCheck` shares any subgraph id with the tokens being compared
 * If any of the tokens being compared shares a subgraph id with `tokenToCheck`, it will be sorted first
 * @param a first token being compared
 * @param b second token being compared
 * @param tokenToCheck the token to check subgraph ids against
 */
export const sortTokensBySharedSubgraphIds = ({ a, b, tokenToCheck }) => {
  const tokenToCheckSharesIdsWithA = shareSubgraphId(a, tokenToCheck)
  const tokenToCheckSharesIdsWithB = shareSubgraphId(b, tokenToCheck)
  if (tokenToCheckSharesIdsWithA && !tokenToCheckSharesIdsWithB) {
    return -1
  }
  if (!tokenToCheckSharesIdsWithA && tokenToCheckSharesIdsWithB) {
    return 1
  }
  return 0
}

/**
 * Filter chains based on provided config
 * - removes disabled chains
 */
export const filterChains = ({ chains, config, direction }) => {
  const disabledChainsOnDirection = getDisabledChainsIds({
    config,
    direction
  })
  if (disabledChainsOnDirection.length === 0) return chains
  // filter chains that are not disabled
  const availableChains = chains.filter(c => !disabledChainsOnDirection?.includes(c.chainId))
  return availableChains
}

/**
 * Filter tokens based on provided config
 * - removes tokens from disabled chains
 */
export const filterTokens = ({ tokens, config, direction }) => {
  const disabledChainsOnDirection = getDisabledChainsIds({
    config,
    direction
  })
  if (disabledChainsOnDirection.length === 0) return tokens
  // filter tokens that are not disabled
  const availableTokens = tokens.filter(t => !disabledChainsOnDirection?.includes(t.chainId))
  return availableTokens
}

/**
 * Get disabled chains based on the provided config
 * @returns array of disabled chain ids
 */
export function getDisabledChainsIds({ config, direction }) {
  if (!direction) return []
  const parsedDirection = direction === 'from' ? 'source' : 'destination'

  // If we don't have a direction, assume that we won't care about "config.disabledChains"
  const disabledChainsOnDirection = direction ? config.disabledChains?.[parsedDirection] ?? [] : []
  return Array.from(new Set(disabledChainsOnDirection))
}

export function getTokenImage(token) {
  return `${assetsBaseUrl}/images/migration/webp/${getTokenAssetsKey(token)}.webp`
}

/**
 * Destination token address has different logic
 * Some tokens are not available based on the source chain/token
 */
const handleDestinationAddressOnSwapChange = ({
  fromChainId,
  fromTokenAddress,
  toTokenAddress,
  toChainId,
  swapRoute,
  chains,
  tokens,
  config
}) => {
  const srcToken = tokens.find(
    t => t.address === (fromTokenAddress ?? swapRoute?.fromTokenAddress) && t.chainId === fromChainId
  )
  const destChain = chains.find(c => c.chainId === (toChainId ?? swapRoute?.toChainId))
  const removeSourceToken = fromChainId === toChainId

  const destinationTokensFiltered = filterTokensForDestination({
    tokens: getTokensForChain(tokens, toChainId ?? swapRoute?.toChainId),
    selectedDestinationChain: destChain,
    selectedSourceToken: srcToken,
    removeSourceToken
  })

  const defaultToAddress = getInitialOrDefaultTokenAddressForChain({
    tokens: destinationTokensFiltered,
    config,
    chainId: toChainId ?? swapRoute?.toChainId,
    direction: 'to'
  })

  let destinationTokenAddress =
    toChainId && !toTokenAddress ? defaultToAddress : toTokenAddress ?? swapRoute?.toTokenAddress
  const lowerCaseDestinationTokenAddress = destinationTokenAddress?.toLowerCase()
  if (destinationTokensFiltered.find(t => t.address === lowerCaseDestinationTokenAddress) === undefined) {
    destinationTokenAddress = defaultToAddress
  }
  return lowerCaseDestinationTokenAddress
}

/**
 * When user changes something from the SwapView
 * param changed can be chains, tokens, or destination address
 *
 * If source chain is changed but source token is undefined, need to find a default token
 * If destination chain is changed but destination token is undefined, need to find a default token
 * If only source token is changed, and destination token is not, and they were the same, then destination token becomes undefined
 * If only destination token is changed but source is not, and they were the same, then source token updates to something else
 *
 */
export const getNewSwapParamsFromInput = ({
  inputParams,
  initialSwapRoute,
  tokens,
  chains,
  config,
  queryClient,
  connectedSourceAddress
}) => {
  const {
    fromChainId,
    fromTokenAddress,
    toChainId,
    toTokenAddress,
    destinationAddress,
    fallbackAddress,
    depositRefundAddress
  } = inputParams
  const srcChainId = fromChainId ?? initialSwapRoute?.fromChainId
  const destinationChainId = toChainId ?? initialSwapRoute?.toChainId

  const defaultFromAddress = getInitialOrDefaultTokenAddressForChain({
    tokens,
    config,
    chainId: srcChainId,
    direction: 'from',
    excludeToken: toTokenAddress
      ? {
          address: toTokenAddress,
          chainId: destinationChainId ?? ''
        }
      : undefined,
    fetchCachedBalance: {
      address: connectedSourceAddress,
      queryClient
    }
  })
  // Source token has been changed but not destination
  const onlySourceChanged = (!!fromChainId || !!fromTokenAddress) && !toChainId && !toTokenAddress
  const onlySourceChainIdChanged = onlySourceChanged && !fromTokenAddress

  // Source is set to the same token as previous destination
  const sameNewSourceAndInitialDest =
    onlySourceChanged &&
    srcChainId === initialSwapRoute?.toChainId &&
    fromTokenAddress === initialSwapRoute?.toTokenAddress
  // Destination token has been changed but not source
  const onlyDestChanged = (!!toChainId || !!toTokenAddress) && !fromChainId && !fromTokenAddress

  // Destination is set to the same token as previous source
  const sameNewDestAndInitialSource =
    onlyDestChanged &&
    destinationChainId === initialSwapRoute?.fromChainId &&
    toTokenAddress === initialSwapRoute?.fromTokenAddress

  const sourceTokenAddress =
    sameNewDestAndInitialSource || onlySourceChainIdChanged
      ? defaultFromAddress
      : fromTokenAddress ?? initialSwapRoute?.fromTokenAddress
  let destinationTokenAddress = undefined
  if (!sameNewSourceAndInitialDest) {
    if (onlySourceChainIdChanged) {
      // Preserve the destination token when only the source chain is changed
      destinationTokenAddress = toTokenAddress ?? initialSwapRoute?.toTokenAddress
    } else {
      destinationTokenAddress = handleDestinationAddressOnSwapChange({
        fromChainId,
        fromTokenAddress,
        toTokenAddress,
        toChainId,
        swapRoute: initialSwapRoute,
        chains,
        tokens,
        config
      })
    }
  }
  let newDestinationAddress
  if (destinationAddress?.address === destinationAddressResetValue) {
    newDestinationAddress = undefined
  } else {
    const destAddress = destinationAddress ?? initialSwapRoute?.destinationAddress

    const isNewDestAddressValid = isWalletAddressValid(
      chains.find(c => c.chainId === destinationChainId),
      destAddress?.address
    )
    if (isNewDestAddressValid) {
      newDestinationAddress = destAddress
    }
  }
  let newFallbackAddress
  if (destinationAddress?.address === destinationAddressResetValue || fallbackAddress === fallbackAddressResetValue) {
    newFallbackAddress = undefined
  } else {
    newFallbackAddress = fallbackAddress ?? initialSwapRoute?.fallbackAddress
  }
  const newDepositRefundAddress = depositRefundAddress || initialSwapRoute?.depositRefundAddress
  return {
    fromChainId: srcChainId,
    fromTokenAddress: sourceTokenAddress,
    toChainId: destinationChainId,
    toTokenAddress: destinationTokenAddress,
    destinationAddress: newDestinationAddress,
    fallbackAddress: newFallbackAddress,
    depositRefundAddress: newDepositRefundAddress
  }
}

/* Sorts tokens based on the following order:
 * 1. Native token on chain ID "1" (Ethereum) comes first.
 * 2. Other native tokens are sorted by their chain ID priority based on market cap:
 *    - Ethereum (1)
 *    - BNB (56)
 *    - AVAX (43114)
 *    - Polygon (137)
 *    - Filecoin (314)
 *    - Arbitrum (42161)
 *    - Optimism (10)
 *    - Fantom (250)
 * 3. Tokens with symbols "USDC", "USDT", and "axlUSDC" are sorted in that order.
 * 4. If none of the above conditions are met, tokens are sorted by their symbol names.
 */
export const sortAllTokens = (tokenA, tokenB) => {
  const chainIdMcapPriority = [
    '1',
    '56',
    '43114',
    '137',
    '314',
    '42161',
    '10',
    '250' // Fantom
  ]

  const getChainIdPriority = chainId => {
    const index = chainIdMcapPriority.indexOf(chainId)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }

  const isNative = token => {
    return token.address.toLowerCase() === nativeEvmTokenAddress
  }
  if (isNative(tokenA) && isNative(tokenB)) {
    return getChainIdPriority(tokenA.chainId) - getChainIdPriority(tokenB.chainId)
  }
  if (isNative(tokenA)) {
    return -1
  }
  if (isNative(tokenB)) {
    return 1
  }
  const tokenPriority = ['USDC', 'USDT', 'axlUSDC']
  const indexA = tokenPriority.indexOf(tokenA.symbol)
  const indexB = tokenPriority.indexOf(tokenB.symbol)
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB
  }
  if (indexA !== -1) {
    return -1
  }
  if (indexB !== -1) {
    return 1
  }
  return 0
}

export const findToken = (tokens, chainId, address) => tokens.find(t => t.chainId === chainId && t.address === address)

export const findNativeToken = (tokens, chain) =>
  tokens.find(t => t.symbol.toUpperCase() === chain?.nativeCurrency.symbol.toUpperCase() && t.chainId == chain?.chainId)

export const normalizeIbcAddress = address => {
  if (!address.toLowerCase().startsWith('ibc/')) {
    return address
  }
  const [prefix, denom] = address.split('/')
  return `${prefix.toLowerCase()}/${denom.toUpperCase()}`
}

export const areSameCosmosAddress = (addressA, addressB) => {
  const normalizedAddressA = normalizeIbcAddress(addressA)
  const normalizedAddressB = normalizeIbcAddress(addressB)
  return normalizedAddressA === normalizedAddressB
}

// Native tokens that can have wrapped versions
const nativeWrappedPairs = ['ETH', 'BTC', 'FIL', 'BNB', 'AVAX', 'POL', 'FTM', 'IMX', 'KAVA', 'GLMR', 'CELO']

/**
 * Selects the default information for a group of tokens.
 * Prioritizes native tokens (EVM or Cosmos), then falls back to the first unique token symbol.
 */
function selectGroupDefaultInfo(tokens) {
  // Check for native EVM token
  const nativeToken = tokens.find(token => token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase())
  if (nativeToken) {
    return {
      symbol: nativeToken.symbol.split('.')[0],
      logoURI: getTokenImage(nativeToken) || '',
      name: nativeToken.name.split('.')[0]
    }
  }
  // Check for native Cosmos token
  // Example ATOM address is "uatom"
  const cosmosNativeToken = tokens.find(token => !token.address.startsWith('0x') && !token.address.startsWith('ibc/'))
  if (cosmosNativeToken) {
    return {
      symbol: cosmosNativeToken.symbol.split('.')[0],
      logoURI: getTokenImage(cosmosNativeToken) || '',
      name: cosmosNativeToken.name.split('.')[0]
    }
  }

  // Sanitize token symbols by removing everything after the first dot
  const sanitizedTokens = tokens.map(token => ({
    ...token,
    symbol: token.symbol.split('.')[0]
  }))

  // Find the first token with a unique sanitized symbol
  const firstUniqueToken = sanitizedTokens.find(
    (token, index, self) => self.findIndex(t => t.symbol === token.symbol) === index
  )
  return {
    symbol: firstUniqueToken?.symbol || '',
    logoURI: getTokenImage(firstUniqueToken) || '',
    name: firstUniqueToken?.name.split('.')[0] || ''
  }
}

/**
 * Groups tokens based on their properties (symbol, coingeckoId)
 * Some custom logic to handle native/wrapped pairs
 *
 * @param tokens - Array of TokenWithBalance objects to be grouped
 * @param chainType - Optional parameter to filter tokens by chain type ('evm' or 'cosmos')
 * @returns Object containing grouped tokens and ungrouped tokens
 */
export const groupTokensBySymbol = (tokens, chainType) => {
  const groups = {}

  // Filter tokens by chain type if specified
  const filteredTokens = chainType ? tokens.filter(token => token.type === chainType) : tokens
  // First pass: group by coingeckoId or symbol
  filteredTokens.forEach(token => {
    const groupKey = token.coingeckoId || token.symbol.split('.')[0]
    if (!groups[groupKey]) {
      groups[groupKey] = {
        symbol: '',
        logoURI: '',
        name: '',
        tokens: [],
        totalBalance: '0',
        totalBalanceUsd: '0',
        balance: '0',
        chainId: '',
        chainLogoURI: ''
      }
    }
    groups[groupKey].tokens.push(token)
    groups[groupKey].totalBalance = new BigNumber(groups[groupKey].totalBalance).plus(token.balance).toString()
    const tokenUsdValue = convertTokenAmountToUSD(token.balance, token.usdPrice || 0)
    groups[groupKey].totalBalanceUsd = new BigNumber(groups[groupKey].totalBalanceUsd ?? '0')
      .plus(tokenUsdValue)
      .toString()
  })
  // Second pass: merge groups based on native/wrapped pairs
  const mergedGroups = {}
  Object.entries(groups).forEach(([key, group]) => {
    const baseSymbol = group.tokens[0].symbol.split('.')[0]
    let mergeKey = key
    // Handle native/wrapped pairs
    if (
      nativeWrappedPairs.includes(baseSymbol) ||
      (baseSymbol.startsWith('W') && nativeWrappedPairs.includes(baseSymbol.slice(1)))
    ) {
      mergeKey = baseSymbol.replace(/^W/, '')
    }
    // Merge groups or create a new one if it doesn't exist
    if (!mergedGroups[mergeKey]) {
      mergedGroups[mergeKey] = { ...group }
    } else {
      // Combine tokens and sum up total balance for existing groups
      mergedGroups[mergeKey].tokens.push(...group.tokens)
      mergedGroups[mergeKey].totalBalance = new BigNumber(mergedGroups[mergeKey].totalBalance)
        .plus(group.totalBalance)
        .toString()
      // Add this line to properly merge USD values
      mergedGroups[mergeKey].totalBalanceUsd = new BigNumber(mergedGroups[mergeKey].totalBalanceUsd ?? '0')
        .plus(group.totalBalanceUsd ?? '0')
        .toString()
    }
  })
  // Final pass: set group info and separate single-token groups
  const finalGroups = []
  const ungrouped = []
  Object.values(mergedGroups).forEach(group => {
    if (group.tokens.length === 1) {
      ungrouped.push(group.tokens[0])
    } else {
      const defaultInfo = selectGroupDefaultInfo(group.tokens)
      finalGroups.push({ ...group, ...defaultInfo })
    }
  })
  return { grouped: finalGroups, ungrouped }
}

/**
 * Groups tokens based on their chainId
 *
 * @param tokens - Array of TokenWithBalance objects to be grouped
 * @param chains - Array of ChainData objects to find chain information
 * @returns Array of TokenGroup objects
 */
export const groupTokensByChainId = (tokens, chains) => {
  const groups = {}
  tokens.forEach(token => {
    const chainData = chains.find(chain => chain.chainId === token.chainId)
    const groupKey = token.chainId
    if (!groups[groupKey]) {
      groups[groupKey] = {
        symbol: chainData?.nativeCurrency.symbol || '',
        logoURI: chainData?.chainIconURI || '',
        name: chainData?.networkName || '',
        tokens: [],
        totalBalance: '0',
        totalBalanceUsd: '0',
        balance: '0',
        chainId: token.chainId,
        chainLogoURI: chainData?.chainIconURI || ''
      }
    }
    groups[groupKey].tokens.push(token)
    groups[groupKey].totalBalance = new BigNumber(groups[groupKey].totalBalance).plus(token.balance).toString()
    // Only add to USD total if token has a valid price
    if (token.usdPrice && token.usdPrice > 0) {
      const tokenUsdValue = convertTokenAmountToUSD(token.balance, token.usdPrice)
      groups[groupKey].totalBalanceUsd = new BigNumber(groups[groupKey].totalBalanceUsd ?? '0')
        .plus(tokenUsdValue)
        .toString()
    }
  })
  return Object.values(groups)
}

const CELO_CHAIN_ID = '42220'

// remove some tokens based on address & chainid
// Some tokens will be returned by backend but should be hidden
// For example for celo, native token & custom address tokens are returned, so we should hide the native one but keep receiving it to use gas balance
export const filterViewableTokens = tokens => {
  const disabledTokens = [{ chainId: CELO_CHAIN_ID, address: nativeEvmTokenAddress }]
  return (
    tokens.filter(
      token =>
        !disabledTokens.some(
          disabledToken =>
            disabledToken.chainId === token.chainId &&
            disabledToken.address.toLowerCase() === token.address.toLowerCase()
        )
    ) ?? []
  )
}

export const getSecretNetworkBalances = async (chainData, cosmosAddress, squidTokens, keplrTypeWallet) => {
  const squidSecretTokens = squidTokens.filter(t => t.chainId === CHAIN_IDS.SECRET)
  const { fetchAllSecretBalances } = await import('../external/secretService')
  return fetchAllSecretBalances(chainData, cosmosAddress, squidSecretTokens, keplrTypeWallet)
}

export function getTokenAssetsKey(token) {
  // Remove slashes and colons and lowercase token address
  return `${token?.chainId}_${token?.address?.replace(/[/\:]/g, '').toLowerCase()}`
}

export async function fetchAssetsColors() {
  try {
    const response = await fetch(`${assetsBaseUrl}/scripts/update-tokens/colors.json`)
    const assetsColors = await response.json()

    const isValidResponse =
      typeof assetsColors === 'object' &&
      typeof assetsColors.chains === 'object' &&
      typeof assetsColors.tokens === 'object'
    if (!isValidResponse) {
      throw new Error('Invalid assets colors response')
    }
    return assetsColors
  } catch (error) {
    console.error('Error fetching colors file:', error)
    return {
      chains: {},
      tokens: {}
    }
  }
}

export function initializeSquidWithAssetsColors(squid, assetsColors) {
  const evmosChainIds = squid.chains.filter(isEvmosChain).map(c => c.chainId)
  squid.tokens = squid.tokens.map(token => {
    const isEvmosToken = evmosChainIds.includes(token.chainId)
    return {
      ...token,
      type: isEvmosToken ? ChainType.EVM : token.type,
      bgColor: assetsColors.tokens[getTokenAssetsKey(token)]?.bgColor,
      textColor: assetsColors.tokens[getTokenAssetsKey(token)]?.textColor
    }
  })
  squid.chains = squid.chains.map(chain => {
    const bgColor = assetsColors.chains[chain.chainId]?.bgColor
    // convert evmos cosmos chains to evm chains
    // TODO: this will be fixed in the backend
    if (isEvmosChain(chain)) {
      const evmChain = convertEvmosToEvmChain(chain)
      return {
        ...evmChain,
        bgColor
      }
    }
    return {
      ...chain,
      bgColor
    }
  })
}

export function isEmptyObject(obj) {
  if (!obj) return true
  return Object.values(obj).every(value => value === undefined)
}

export const normalizeTokenSymbol = symbol => {
  return symbol.toUpperCase()
}

export const areTokenSymbolsCompatible = (symbol1, symbol2) => {
  return normalizeTokenSymbol(symbol1) === normalizeTokenSymbol(symbol2)
}

export function isEvmosChain(chain) {
  return chain?.isEvmos || false
}

function convertEvmosToEvmChain(cosmosChain) {
  return {
    // @ts-expect-error - isEvmos is not a property on EvmChain
    // We still need this attribute in evmos chains
    // even after they are converted to evm chains, to perform certain checks
    // e.g checking ics20 allowance instead of erc20 allowance
    isEvmos: true,
    chainType: ChainType.EVM,
    axelarChainName: cosmosChain.axelarChainName,
    blockExplorerUrls: cosmosChain.blockExplorerUrls,
    chainId: cosmosChain.chainId,
    bridges: cosmosChain.bridges,
    chainIconURI: cosmosChain.chainIconURI,
    enableBoostByDefault: cosmosChain.enableBoostByDefault,
    chainNativeContracts: {
      ensRegistry: '',
      multicall: '',
      usdcToken: '',
      wrappedNativeToken: ''
    },
    internalRpc: cosmosChain.internalRpc,
    nativeCurrency: {
      decimals: cosmosChain.nativeCurrency.decimals,
      name: cosmosChain.nativeCurrency.name,
      symbol: cosmosChain.nativeCurrency.symbol,
      icon: cosmosChain.nativeCurrency.icon
    },
    networkName: cosmosChain.networkName,
    rpc: cosmosChain.rpc,
    networkIdentifier: cosmosChain.networkIdentifier,
    sameChainSwapsSupported: cosmosChain.sameChainSwapsSupported,
    squidContracts: cosmosChain.squidContracts,
    swapAmountForGas: cosmosChain.swapAmountForGas,
    boostSupported: cosmosChain.boostSupported,
    compliance: cosmosChain.compliance,
    interchainService: cosmosChain.interchainService
  }
}
