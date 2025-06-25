import {
  CHAIN_IDS,
  DEFAULT_LOCALE,
  TransactionStatus,
  chainTypeToNativeTokenAddressMap,
  getTokenImage,
  isChainflipBridgeTransaction
} from 'src/components/swap/widget/react-hooks'
import { SquidDataType, SquidRouteType } from '@0xsquid/squid-types'
import { DEFAULT_ROUTE_REFETCH_INTERVAL } from '../../core/constants'
import { SwapState } from '../../core/types/transaction'

export const formatTransactionHistoryDate = timestamp => {
  if (!timestamp) return undefined
  try {
    const date = new Date(Number(timestamp))
    const month = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      month: 'short'
    }).format(date)
    const day = date.toLocaleString(DEFAULT_LOCALE, { day: '2-digit' })
    return { month, day }
  } catch (error) {
    console.error('Error formatting date:', error)
    return undefined
  }
}

/**
 * Formats a YYYY-MM date string with the following rules:
 * - "This month" if the date is in the current month
 * - "<month>" if the date is in a previous month of the current year (e.g "February")
 * - "<month> <year>" if the date is in a previous year (e.g "February 2022")
 * @param yearMonthKey - YYYY-MM date string
 * @returns formatted date string
 */
export function getMonthFormatted(yearMonthKey) {
  const currentMonth = new Date().getMonth() + 1
  const formattedMonth = new Date(yearMonthKey).getUTCMonth() + 1
  const isCurrentMonth = formattedMonth === currentMonth
  if (isCurrentMonth) {
    return 'This month'
  }
  const currentYear = new Date().getFullYear().toString()
  const isCurrentYear = yearMonthKey.includes(currentYear)
  const [year, month] = yearMonthKey.split('-')
  const date = new Date(Number(year ?? 0), Number(month ?? 0) - 1)
  if (isCurrentYear) {
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, { month: 'long' }).format(date)
  }
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export const getAxelarExplorerTxUrl = (urlPrefix, routeType, txID) => {
  if (!urlPrefix) {
    return undefined
  }
  const txType = routeType ?? SquidRouteType.BRIDGE
  if (txType === SquidRouteType.CALL_BRIDGE || txType === SquidRouteType.BRIDGE) {
    return `${urlPrefix}transfer/${txID}`
  }
  return `${urlPrefix}gmp/${txID}`
}

export const getMainExplorerUrl = transaction => {
  // The most accurate one is coming from squid /status api
  if (transaction?.statusResponse?.axelarTransactionUrl) {
    return {
      url: transaction?.statusResponse.axelarTransactionUrl,
      name: 'Axelarscan'
    }
  }
  const chainflipScanUrl = transaction?.statusResponse?.toChain?.transactionUrl
  const isChainflipBridgeTx = isChainflipBridgeTransaction(transaction?.actions ?? [])
  if (isChainflipBridgeTx && !!chainflipScanUrl) {
    return {
      url: chainflipScanUrl,
      name: 'Chainflip'
    }
  }
  // If not, we can try to get it from the source chain
  if (transaction?.sourceTxExplorerUrl) {
    return {
      url: transaction?.sourceTxExplorerUrl,
      name: `${transaction.sourceChainObject?.networkName} explorer`
    }
  }
  // If not, we can try to guess it from the transaction type
  if (transaction && transaction?.transactionId) {
    return {
      url:
        getAxelarExplorerTxUrl(
          transaction.statusResponse?.axelarTransactionUrl,
          transaction.routeType,
          transaction.transactionId
        ) ?? '',
      name: 'Axelarscan'
    }
  }
  return undefined
}

// Initial status mapping
export const getSwapStateFromTxStatus = txStatus => {
  switch (txStatus) {
    case 'warning':
      return SwapState.CONFIRMATION_TOO_LONG
    case 'partial_success':
      return SwapState.PARTIAL_SUCCESS
    case 'needs_gas':
      return SwapState.NEEDS_GAS
    case 'error':
      return SwapState.ERROR
    case 'rejected':
      return SwapState.CONFIRMATION_REJECTED
    case 'success':
      return SwapState.COMPLETED
    case 'ongoing':
    case 'initialLoading':
      return SwapState.PROGRESS
    case 'refunded':
      return SwapState.PARTIAL_SUCCESS
    case 'pending':
    default:
      return SwapState.CONFIRM
  }
}

// Status mapping according to 0xsquid/ui
export const getSwapStateItemStatus = ({ stepStatus }) => {
  switch (stepStatus) {
    case 'warning':
      return 'warning'
    case 'partial_success':
      return 'warning'
    case 'needs_gas':
      return 'warning'
    case 'error':
      return 'error'
    case 'rejected':
      return 'error'
    case 'success':
      return 'executed'
    case 'ongoing':
    case 'initialLoading':
    case 'pending':
      return 'ongoing'
    default:
      return 'pending'
  }
}

export const getConfirmInWalletStep = ({ txStatus }) => {
  const waitingLabel = 'Waiting for confirmation'
  switch (txStatus) {
    case TransactionStatus.PENDING:
    case TransactionStatus.INITIAL_LOADING:
      return {
        descriptionBlocks: [
          {
            type: 'string',
            value: waitingLabel
          }
        ],
        status: 'waiting'
      }
    case TransactionStatus.REJECTED:
      return {
        descriptionBlocks: [
          {
            type: 'string',
            value: 'Confirmation rejected'
          }
        ],
        status: 'error'
      }
    case TransactionStatus.WARNING:
      return {
        descriptionBlocks: [
          {
            type: 'string',
            value: 'Confirmation taking too long'
          }
        ],
        status: 'warning'
      }
    default:
      return {
        descriptionBlocks: [
          {
            type: 'string',
            value: waitingLabel
          }
        ],
        status: 'executed'
      }
  }
}

export function getDescriptionBlocks({ action, toChain }) {
  if (!action.description) return []
  const { description } = action
  const { fromToken } = action
  const { toToken } = action
  const blocks = []
  const fromTokenIndexInDescription = description.indexOf(fromToken.symbol)
  const toTokenIndexInDescription = description.indexOf(toToken.symbol)
  const descriptionIncludesFromToken = containsExactWord(description, fromToken.symbol)
  const actionIndexInDescription = descriptionIncludesFromToken
    ? fromTokenIndexInDescription
    : toTokenIndexInDescription

  blocks.push({
    type: 'string',
    value: description.slice(0, actionIndexInDescription).trim()
  })

  if (descriptionIncludesFromToken) {
    blocks.push({
      type: 'image',
      value: getTokenImage(fromToken) ?? '',
      rounded: true
    })
    blocks.push({
      type: 'string',
      value: fromToken.symbol
    })
  }

  const descriptionAfterFromTokenAndAction = descriptionIncludesFromToken
    ? description.slice(fromTokenIndexInDescription + fromToken.symbol.length).trim()
    : description.slice(actionIndexInDescription)
  const match = descriptionAfterFromTokenAndAction.match(createSmartRegex(toToken.symbol))
  const toTokenIndexInRestOfDescription = match?.index ?? -1
  const descriptionBetweenFromAndToTokens = descriptionAfterFromTokenAndAction
    .slice(0, toTokenIndexInRestOfDescription)
    .trim()

  if (toTokenIndexInRestOfDescription !== -1 && descriptionBetweenFromAndToTokens.trim().length > 0) {
    blocks.push({
      type: 'string',
      value: descriptionBetweenFromAndToTokens
    })
  }

  const descriptionIncludesToToken = containsExactWord(descriptionAfterFromTokenAndAction, toToken.symbol)
  if (descriptionIncludesToToken) {
    blocks.push({
      type: 'image',
      value: getTokenImage(toToken) ?? '',
      rounded: true
    })
    blocks.push({
      type: 'string',
      value: toToken.symbol
    })
  }

  const descriptionAfterToToken =
    toTokenIndexInRestOfDescription === -1
      ? descriptionAfterFromTokenAndAction
      : descriptionAfterFromTokenAndAction.slice(toTokenIndexInRestOfDescription + toToken.symbol.length).trim()

  const descriptionIncludesToChain = toChain && containsExactWord(descriptionAfterToToken, toChain.networkName)
  if (descriptionIncludesToChain) {
    const toChainIndexInDescription = descriptionAfterToToken.indexOf(toChain.networkName)
    const descriptionBetweenToTokenAndToChain = descriptionAfterToToken.slice(0, toChainIndexInDescription).trim()
    blocks.push({
      type: 'string',
      value: descriptionBetweenToTokenAndToChain
    })
    if (toChainIndexInDescription === 0) {
      blocks.push({
        type: 'string',
        value: descriptionAfterToToken
      })
    }
    if (descriptionIncludesToChain) {
      blocks.push({
        type: 'image',
        value: toChain?.chainIconURI ?? ''
      })
      blocks.push({
        type: 'string',
        value: toChain?.networkName ?? ''
      })
    }
  }

  return blocks
}

/**
 * Creates a smart regular expression from the given text.
 *
 * - Escapes all special regex characters in the input text.
 * - If the text does not contain whitespace, wraps the pattern with word boundaries (`\b`).
 * - If the text contains whitespace, uses the escaped text as-is (no word boundaries).
 *
 * This is needed since we need to support:
 * - token symbol with spaces + parens: "mcUSD (old)"
 * - token symbol which also match the chain name partially: "XRP on XRPL"
 */
function createSmartRegex(text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const hasEmptySpaces = /\s/.test(text)
  const pattern = hasEmptySpaces ? escaped : `\\b${escaped}\\b`

  return new RegExp(pattern)
}

/**
 * Returns true if the exact substr is found in str
 *
 * @param str - The string to search in
 * @param substr - The substring to search for in str
 *
 * @example
 * containsExactWord("Swap axlARB to ARB", "ARB") // true
 * containsExactWord("Transfer axlARB", "ARB") // false
 * containsExactWord("swap to USDC (old)", "USDC (old)") // true
 * containsExactWord("swap to USDC(old)", "USDC (old)") // false
 */
function containsExactWord(str, substr) {
  const escapedSubstr = substr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(^|\\s)${escapedSubstr}(\\s|$)`)

  return regex.test(str)
}

export function getTokenExplorerUrl({ tokenAddress, chain }) {
  if (!chain?.blockExplorerUrls[0]) return undefined

  const isNativeTokenForChain =
    chainTypeToNativeTokenAddressMap[chain.chainType].toLowerCase() === tokenAddress.toLowerCase()
  if (isNativeTokenForChain) return undefined

  let addressSuffix
  switch (chain.chainId) {
    case CHAIN_IDS.SUI:
    case CHAIN_IDS.SUI_TESTNET:
      addressSuffix = '/coin/'
      break
    default:
      addressSuffix = '/address/'
  }
  if (chain.blockExplorerUrls[0].endsWith('/')) {
    addressSuffix = addressSuffix.slice(1)
  }

  return `${chain.blockExplorerUrls[0]}${addressSuffix}${tokenAddress}`
}

/**
 * Return the expiry of a route in milliseconds
 *
 * @param route - Squid route
 * @returns expiry in milliseconds
 */
export function getRouteExpiry(route) {
  if (!route?.transactionRequest) return DEFAULT_ROUTE_REFETCH_INTERVAL
  if (route.transactionRequest.type !== SquidDataType.OnChainExecution) {
    return DEFAULT_ROUTE_REFETCH_INTERVAL
  }
  const { expiryOffset } = route.transactionRequest
  if (expiryOffset != null && Number(expiryOffset) >= 0) {
    return Number(expiryOffset) * 1000
  }
  const expiryTimestamp = route?.transactionRequest?.expiry
  if (expiryTimestamp == null || route == null) {
    return DEFAULT_ROUTE_REFETCH_INTERVAL
  }
  const msUntilExpiry = Number(expiryTimestamp) * 1000 - Date.now()

  return msUntilExpiry
}
