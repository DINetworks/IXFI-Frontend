import { ChainType } from '@0xsquid/squid-types'
import get from 'lodash/get'
import { chainTypeToNativeTokenAddressMap, defaultConfigValues } from '../../core/constants'
import { keys } from '../../core/queries/queries-keys'
import { shareSubgraphId } from './assetsService'

export const getConfigWithDefaults = config => {
  return {
    integratorId: get(config, 'integratorId', defaultConfigValues.integratorId),
    slippage: get(config, 'slippage', defaultConfigValues.slippage),
    collectFees: get(config, 'collectFees', defaultConfigValues.collectFees),
    enableGetGasOnDestination: get(config, 'enableGetGasOnDestination', defaultConfigValues.enableGetGasOnDestination),
    apiUrl: get(config, 'apiUrl', defaultConfigValues.apiUrl),
    priceImpactWarnings: get(config, 'priceImpactWarnings', defaultConfigValues.priceImpactWarnings),
    initialAssets: get(config, 'initialAssets', defaultConfigValues.initialAssets),
    defaultTokensPerChain: get(config, 'defaultTokensPerChain', defaultConfigValues.defaultTokensPerChain),
    loadPreviousStateFromLocalStorage: get(
      config,
      'loadPreviousStateFromLocalStorage',
      defaultConfigValues.loadPreviousStateFromLocalStorage
    ),
    preferDex: get(config, 'preferDex', defaultConfigValues.preferDex),
    availableChains: get(config, 'availableChains', defaultConfigValues.availableChains),
    disabledChains: get(config, 'disabledChains', defaultConfigValues.disabledChains),
    degenMode: get(config, 'degenMode', defaultConfigValues.degenMode),
    preHook: get(config, 'preHook', defaultConfigValues.preHook),
    postHook: get(config, 'postHook', defaultConfigValues.postHook)
  }
}

export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getTokensForChain = (tokens, chainId) => {
  return chainId ? tokens.filter(t => t.chainId === chainId) : tokens
}

/**
 * Returns the first available chain ID for a specific direction based on config.
 * If no initial chains are found in config, returns the first available chain ID.
 * @returns The first available chain ID.
 */
export const getFirstAvailableChainId = (config, direction, chains = []) => {
  // filter chains based on config
  const unavailableChainIds = getUnavailableChainIdsForDirection({
    config,
    direction
  })
  const availableChains = chains.filter(c => !unavailableChainIds.has(c.chainId))

  // get initial chain ID from config
  const initialChainId = getInitialChainIdFromConfig({
    chains: availableChains,
    config,
    direction
  })
  if (initialChainId) return initialChainId
  // if no initial chain ID is found in config, return the first available chain ID
  return availableChains.length > 0 ? availableChains[0].chainId : undefined
}

export const fetchHighestBalanceToken = (fetchCachedBalance, chainId) => {
  let address = undefined
  if (fetchCachedBalance) {
    const queryCache = fetchCachedBalance?.queryClient?.getQueryCache()

    // get cached balance from key
    const cache = queryCache?.find(
      keys().allTokensBalance(fetchCachedBalance?.address, !isNaN(Number(chainId)) ? ChainType.EVM : ChainType.COSMOS)
    )
    // Parse result to TokenWithBalance[]
    const cacheResult = cache?.state.data ?? []
    if (cacheResult.length > 0) {
      const tokensWithBalance = cacheResult.filter(t => t.chainId === chainId && Number(t.balance) > 0)
      if (tokensWithBalance.length > 0) {
        // Return the token with the highest balance
        // TODO: At the moment we're not taking into account usd price
        const tokenWithHighestBalance = tokensWithBalance.reduce((prev, current) =>
          Number(prev.balance) > Number(current.balance) ? prev : current
        )
        if (tokenWithHighestBalance) {
          address = tokenWithHighestBalance.address
        }
      }
    }
  }
  return address
}

const findNativeTokenForChainType = tokens => {
  return tokens.find(t => t.address.toLowerCase() === chainTypeToNativeTokenAddressMap[t.type].toLowerCase())
}

/**
 * Returns the default token address for a specific chain and direction based on config.
 * If no default tokens are set in config, returns the first token in the tokens array for the specified chain
 *
 * @param tokens The list of tokens.
 * @param config App config
 * @param chainId The chain ID of the token
 * @param direction The direction of the swap
 * @param unavailableTokenAddress The token that is unavailable. Can be useful when we don't want to show the same token in the opposite direction
 * @returns
 */
export const getInitialOrDefaultTokenAddressForChain = ({
  tokens,
  config,
  chainId,
  direction,
  excludeToken,
  fetchCachedBalance
}) => {
  if (!chainId) return

  const unavailableChainIds = getUnavailableChainIdsForDirection({
    config,
    direction
  })
  // filter disabled chains
  if (unavailableChainIds.has(chainId)) return
  const configDefaultTokenForChain = config.defaultTokensPerChain?.find(token => token.chainId == chainId)
  // get default token from config
  if (
    configDefaultTokenForChain &&
    configDefaultTokenForChain.address !== excludeToken?.address &&
    configDefaultTokenForChain.chainId !== excludeToken?.chainId
  ) {
    return configDefaultTokenForChain.address
  }

  // if no default token is found in config, try to get initial token
  const initialToken = getInitialTokenAddressForChain({
    chainId,
    config,
    direction,
    tokens
  })
  if (initialToken) return initialToken
  // At this point all has been tried to return via config params
  // But we can be smarter and see if a token has a balance and select that one
  const highestBalance = fetchHighestBalanceToken(fetchCachedBalance, chainId)
  if (highestBalance) return highestBalance

  const filteredTokens = chainId
    ? tokens.filter(
        t => t.chainId === chainId && !(t.address == excludeToken?.address && t.chainId === excludeToken?.chainId)
      )
    : tokens
  return findNativeTokenForChainType(filteredTokens)?.address || filteredTokens[0]?.address
}

/**
 * Retrieves the initial token address for a specific chain and direction.
 * If no initial assets are set in config, returns undefined.
 *
 * @param tokens - The list of tokens.
 * @param config - The application configuration.
 * @param chainId - The ID of the chain.
 * @param direction - The direction ("from" or "to").
 * @returns The initial token address if found; otherwise, the default token address.
 */
export const getInitialTokenAddressForChain = ({ chainId, config, direction, tokens, unavailableTokenAddress }) => {
  if (
    config.initialAssets &&
    config.initialAssets?.[direction] &&
    config.initialAssets?.[direction]?.chainId === chainId &&
    config.initialAssets?.[direction]?.address !== unavailableTokenAddress &&
    // check if initial asset exists in tokens
    tokens.some(
      t =>
        t.chainId === config.initialAssets?.[direction]?.chainId &&
        t.address.toLowerCase() === config.initialAssets?.[direction]?.address?.toLowerCase()
    )
  ) {
    return config.initialAssets?.[direction]?.address
  }
}

/**
 * Filter tokens for destination chain
 *
 * Case 1: fromToken.bridgeOnly = true
 * Destination token list shows only tokens with the same commonKey as fromToken
 *
 * Case 2: fromToken.bridgeOnly = false
 * Destination token list shows all tokens with bridgeOnly = false
 * OR Destination token list shows all tokens with the same commonKey as fromToken
 * @param tokens
 * @param selectedDestinationChain
 * @param selectedSourceToken
 * @param removeSourceToken
 * @returns
 */
export const filterTokensForDestination = ({
  tokens,
  selectedDestinationChain,
  selectedSourceToken,
  removeSourceToken = false
}) => {
  let filteredTokens = []
  if (selectedSourceToken?.subGraphOnly) {
    filteredTokens = tokens.filter(t => shareSubgraphId(t, selectedSourceToken))
  }
  filteredTokens = tokens.filter(t => !t.subGraphOnly || shareSubgraphId(t, selectedSourceToken))
  return filteredTokens.filter(t => {
    const areSameToken = t.address === selectedSourceToken?.address && t.chainId === selectedSourceToken.chainId

    const isChainValid = !!selectedDestinationChain ? t.chainId === selectedDestinationChain?.chainId : true
    if (removeSourceToken) return !areSameToken && isChainValid
    // return all tokens if destination chain is not selected
    return isChainValid
  })
}

/**
 * Returns the initial chain ID for a specific direction based on the provided chains and config.
 * @returns The initial chain ID if found in config; otherwise, undefined.
 */
export const getInitialChainIdFromConfig = ({ config, direction, chains = [] }) => {
  if (chains.length === 0) return undefined

  const unavailableChains = getUnavailableChainIdsForDirection({
    config,
    direction
  })
  const availableChains = chains.filter(c => !unavailableChains.has(c.chainId))
  if (
    direction === 'from' &&
    config.initialAssets?.from &&
    availableChains.some(c => c.chainId === String(config.initialAssets?.from?.chainId))
  ) {
    return String(config.initialAssets.from.chainId)
  }
  if (
    direction === 'to' &&
    config.initialAssets?.to &&
    availableChains.some(c => c.chainId === String(config.initialAssets?.to?.chainId))
  ) {
    return String(config.initialAssets.to.chainId)
  }
  return undefined
}

/**
 * Returns the unavailable chains for a specific direction based on the provided config,
 * filtering config.disabledChains and config.comingSoonChains
 * @returns The unavailable chains for the specified direction.
 */
export const getUnavailableChainIdsForDirection = ({ config, direction }) => {
  const disabledChainsForDirection = config.disabledChains?.[direction === 'from' ? 'source' : 'destination']
  return new Set(disabledChainsForDirection ?? [])
}
