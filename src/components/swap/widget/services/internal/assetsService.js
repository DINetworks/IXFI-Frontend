import {
  CHAIN_IDS,
  sortTokensBySharedSubgraphIds,
  nativeBitcoinTokenAddress,
  nativeXrplTokenAddress,
  nativeEvmTokenAddress
} from 'src/components/swap/widget/react-hooks'
import { ChainType } from '@0xsquid/squid-types'
import { CHAINFLIP_BRIDGE_CHAIN_IDS, CORAL_CHAIN_IDS, CORAL_ONLY_CHAIN_IDS } from '../../core/constants'

export const sortTokens = (a, b, oppositeDirectionToken, sortWithSubgraphIds = false) => {
  if (+a.balance * +(a?.usdPrice ?? 0) > +b.balance * +(b?.usdPrice ?? 0)) {
    return -1
  }

  if (+a.balance * +(a?.usdPrice ?? 0) < +b.balance * +(b?.usdPrice ?? 0)) {
    return 1
  }

  if (+(a?.balance ?? 0) > +(b?.balance ?? 0)) {
    return -1
  }

  if (+(a?.balance ?? 0) < +(b?.balance ?? 0)) {
    return 1
  }
  if (!oppositeDirectionToken) return 0

  if (sortWithSubgraphIds) {
    return sortTokensBySharedSubgraphIds({
      a,
      b,
      tokenToCheck: oppositeDirectionToken
    })
  }

  return 0
}

export function getActionProviderImage({ logoURI }) {
  if (logoURI?.includes('0xsquid/assets/main/images/providers')) {
    return logoURI?.replace('images/providers', 'images/png128/providers').replace('.svg', '.png')
  }

  return logoURI ?? ''
}

export function stringIncludes(str1 = '', str2 = '') {
  if (!str1) return false

  return str1.toLowerCase().includes(str2.toLowerCase())
}

const areSameSymbol = (symbol1, symbol2) => {
  return symbol1.toLowerCase() === symbol2.toLowerCase()
}

// Tokens that can be bridged from Solana to other chains via Chainflip
// Other tokens on Solana are only available for same-chain swaps
const CHAINFLIP_SOLANA_BRIDGE_TOKENS = ['SOL', 'USDC']
export const isTokenBlocked = ({ token, direction, fromToken, fromChain }) => {
  if (direction === 'from') return false
  if (!fromToken || !fromChain) return false
  // Swaps between Cosmos and Chainflip chains is not supported
  // TODO: remove this check when this route is supported
  if (fromChain.chainType === ChainType.COSMOS) {
    const destIsChainflipToken = CHAINFLIP_BRIDGE_CHAIN_IDS.includes(token.chainId)
    return destIsChainflipToken
  }
  if (fromChain.chainType === ChainType.SUI) {
    // only route supported from/to Sui is Ethereum
    switch (fromChain.chainId) {
      case CHAIN_IDS.SUI:
        return token.chainId !== CHAIN_IDS.ETHEREUM
      case CHAIN_IDS.SUI_TESTNET:
        return token.chainId !== CHAIN_IDS.ETHEREUM_SEPOLIA
      default:
        return true
    }
  }
  const isFromTokenNativeXrp =
    fromChain.chainType === ChainType.XRPL && fromToken.address.toLowerCase() === nativeXrplTokenAddress.toLowerCase()
  // When native XRP is the source token, only supported path is XRP on XRPL EVM
  if (isFromTokenNativeXrp) {
    const isToTokenNativeEvm = token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()
    switch (fromChain.chainId) {
      case CHAIN_IDS.XRPL:
        // block if to chain is not XRPL EVM or if to token is not native EVM token
        return token.chainId !== CHAIN_IDS.XRPL_EVM || !isToTokenNativeEvm
      case CHAIN_IDS.XRPL_TESTNET:
        return token.chainId !== CHAIN_IDS.XRPL_EVM_TESTNET || !isToTokenNativeEvm
      default:
        return true
    }
  }
  const isToTokenNativeXrp = token.address.toLowerCase() === nativeXrplTokenAddress.toLowerCase()
  // When native XRP is the destination token,
  // only enable swaps from Coral chains
  if (isToTokenNativeXrp) {
    const isFromChainCoral = CORAL_CHAIN_IDS.includes(fromChain.chainId)
    return !isFromChainCoral
  }
  // For Coral-only chains, only paths supported are to Coral chains
  if (CORAL_ONLY_CHAIN_IDS.includes(fromChain.chainId)) {
    const isCoralSupportedToken = CORAL_CHAIN_IDS.includes(token.chainId)
    return !isCoralSupportedToken
  }
  // EVM source chain rules
  if (fromChain.chainType === ChainType.EVM) {
    // Only allow SOL/USDC on Solana and BTC on Bitcoin
    if (token.chainId === CHAIN_IDS.SOLANA) {
      return !CHAINFLIP_SOLANA_BRIDGE_TOKENS.some(s => areSameSymbol(s, token.symbol))
    }
    if (token.chainId === CHAIN_IDS.BITCOIN) {
      return !areSameSymbol(token.symbol, 'BTC')
    }
    return false
  }
  // Bitcoin source chain rules
  if (fromChain.chainId === CHAIN_IDS.BITCOIN) {
    // Enable swaps from Bitcoin to Solana bridge tokens
    if (token.chainId === CHAIN_IDS.SOLANA) {
      const isSupportedSolanaDestToken = CHAINFLIP_SOLANA_BRIDGE_TOKENS.some(s => areSameSymbol(s, token.symbol))
      return !isSupportedSolanaDestToken
    }
  }
  // Solana source chain rules
  if (fromChain.chainId === CHAIN_IDS.SOLANA) {
    if (token.chainId === CHAIN_IDS.SOLANA) {
      return false
    }
    if (!CHAINFLIP_SOLANA_BRIDGE_TOKENS.some(s => areSameSymbol(s, fromToken.symbol))) {
      return true
    }
    // Enable swaps from Solana bridge tokens to BTC
    if (token.chainId === CHAIN_IDS.BITCOIN) {
      const isNativeBtcDestToken = token.address.toLowerCase() === nativeBitcoinTokenAddress.toLowerCase()
      return !isNativeBtcDestToken
    }
  }

  return false
}

/**
 * Validates if a path between two chains is supported using the source chain id as indexer
 *
 * @example chainTypeValidatorMap[sourceChain.chainId].isDestinationSupported(destinationChain)
 */
const chainIdValidatorMap = {
  ...CORAL_ONLY_CHAIN_IDS.reduce((acc, chainId) => {
    acc[chainId] = {
      isDestinationSupported: chain => {
        const isCoralChain = CORAL_CHAIN_IDS.includes(chain.chainId)
        return isCoralChain
      },
      message(fromChainName, toChainName) {
        return `Swaps from ${fromChainName} to ${toChainName} are not supported yet.`
      }
    }
    return acc
  }, {}),
  [CHAIN_IDS.SUI]: {
    isDestinationSupported(chain) {
      return chain.chainId === CHAIN_IDS.ETHEREUM
    },
    message(fromChainName, toChainName) {
      return `Swaps from ${fromChainName} to ${toChainName} are not supported yet.`
    }
  }
}

/**
 * Validates if a path between two chains is supported using the source chain type as indexer
 *
 * @example chainTypeValidatorMap[sourceChain.chainType].isDestinationSupported(destinationChain)
 */
const chainTypeValidatorMap = {
  [ChainType.COSMOS]: {
    isDestinationSupported: chain => {
      return !CHAINFLIP_BRIDGE_CHAIN_IDS.includes(chain.chainId)
    },
    message: (_, toChainName) => `Swaps from Cosmos chains to ${toChainName} are not supported yet.`
  },
  [ChainType.BTC]: {
    isDestinationSupported: chain => {
      return chain.chainType !== ChainType.COSMOS
    },
    message: () => `Swaps from Bitcoin to Cosmos chains are not supported yet.`
  },
  [ChainType.SOLANA]: {
    isDestinationSupported: chain => {
      return chain.chainType !== ChainType.COSMOS
    },
    message: () => `Swaps from Solana to Cosmos chains are not supported yet.`
  }
}

/**
 * Validates if a path between two chains is supported
 * If the path is not supported, returns a message that can be displayed to the user
 *
 * @param fromChain - source chain
 * @param toChain - destination chain
 * @returns a message if the path is not supported, undefined otherwise
 */
export const validateChainsPath = (fromChain, toChain) => {
  const chainTypeValidator = chainTypeValidatorMap[fromChain.chainType]
  if (chainTypeValidator && !chainTypeValidator.isDestinationSupported(toChain)) {
    return chainTypeValidator.message(fromChain.networkName, toChain.networkName)
  }
  const chainIdValidator = chainIdValidatorMap[fromChain.chainId]
  if (chainIdValidator && !chainIdValidator.isDestinationSupported(toChain)) {
    return chainIdValidator.message(fromChain.networkName, toChain.networkName)
  }
  return undefined
}

export const defaultAssetsColors = {
  chainBg: '#000',
  tokenBg: '#000',
  tokenText: '#fff'
}

export const getTokensForFiatOnRampView = ({ onRampConfig, tokens }) => {
  if (!onRampConfig?.supportedCryptos) return []
  // Create a Map for faster lookups of supported tokens
  const supportedTokensMap = new Map(
    onRampConfig.supportedCryptos.map(t => [`${t.address.toLowerCase()}-${t.chainId}`, true])
  )
  // Filter existing tokens to match supported fiat on-ramp tokens
  return tokens.filter(token => supportedTokensMap.has(`${token.address.toLowerCase()}-${token.chainId}`))
}

export const getTokensForSendView = ({ isConnected, isFetchingBalances, tokens }) => {
  // if user is not connected or balances are being fetched, return all tokens
  if (!isConnected || isFetchingBalances) {
    return tokens
  }
  // otherwise only return tokens with balance
  return tokens.filter(token => Number(token.balance || 0) > 0)
}

const ENS_AVATAR_BASE_URL = 'https://metadata.ens.domains/mainnet/avatar/'
export const getEnsAvatar = address => {
  if (!address?.ens) return undefined
  return address.ens.avatar || (address.ens.name ? `${ENS_AVATAR_BASE_URL}${address.ens.name}` : undefined)
}
