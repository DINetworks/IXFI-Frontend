import { ActionType, BridgeType, SquidDataType } from '@0xsquid/squid-types'
import axios from 'axios'
import { CHAIN_IDS, DEFAULT_LOCALE } from '../../core/constants'
import { HistoryTxType } from '../../core/types/history'
import { TransactionType } from '../../core/types/transaction'
import { getQueryHeaders } from './apiService'

export const formatTransactionHistoryDate = transaction => {
  if (!transaction?.timestamp) return undefined
  try {
    const date = new Date(Number(transaction.timestamp))
    // Format date to: MMM DD. Examples:
    // Jan 01
    // May 12
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

export const getAxelarExplorerTxUrl = (urlPrefix, routeType, txID) => {
  if (!urlPrefix) {
    return undefined
  }

  const txType = routeType ?? TransactionType.BRIDGE
  if (txType === TransactionType.CALL_BRIDGE || txType === TransactionType.BRIDGE) {
    return `${urlPrefix}transfer/${txID}`
  }

  return `${urlPrefix}gmp/${txID}`
}

export const getSourceExplorerTxUrl = (chain, txID) => {
  if (!chain || !chain.blockExplorerUrls[0] || !txID) {
    return undefined
  }

  let txSuffix
  switch (chain.chainId) {
    case CHAIN_IDS.AGORIC:
    case CHAIN_IDS.XRPL:
    case CHAIN_IDS.XRPL_TESTNET:
      txSuffix = '/transactions/'
      break
    default:
      txSuffix = '/tx/'
  }

  if (chain.blockExplorerUrls[0].endsWith('/')) {
    txSuffix = txSuffix.slice(1)
  }
  return `${chain.blockExplorerUrls[0]}${txSuffix}${txID}`
}

export const getMainExplorerUrl = transaction => {
  // The most accurate one is coming from squid /status api
  if (transaction?.statusResponse?.axelarTransactionUrl) {
    return transaction?.statusResponse.axelarTransactionUrl
  }
  // If not, we can try to get it from the source chain
  if (transaction?.sourceTxExplorerUrl) {
    return transaction?.sourceTxExplorerUrl
  }
  // If not, we can try to guess it from the transaction type
  if (transaction && transaction?.transactionId) {
    return getAxelarExplorerTxUrl(
      transaction.statusResponse?.axelarTransactionUrl,
      transaction.routeType,
      transaction.transactionId
    )
  }

  return undefined
}

export const formatDistance = (date, baseDate, options) => {
  const { includeSeconds = false, addSuffix = false, locale = { locale: DEFAULT_LOCALE } } = options || {}
  const elapsedMilliseconds = Math.abs(new Date(date).getTime() - new Date(baseDate).getTime())
  const seconds = Math.round(elapsedMilliseconds / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  const months = Math.round(days / 30.44)
  const years = Math.round(days / 365.25)
  const rtf = new Intl.RelativeTimeFormat(locale.locale, { numeric: 'auto' })
  let formatted = ''
  if (includeSeconds && seconds < 45) {
    const unit = addSuffix ? 'second' : 'seconds'
    formatted = rtf.format(-seconds, unit)
  } else if (minutes < 60) {
    formatted = rtf.format(-minutes, 'minutes')
  } else if (hours < 24) {
    formatted = rtf.format(-hours, 'hours')
  } else if (days < 30) {
    formatted = rtf.format(-days, 'days')
  } else if (months < 12) {
    formatted = rtf.format(-months, 'months')
  } else {
    formatted = rtf.format(-years, 'years')
  }
  // remove "ago" from the string
  // before: "2 minutes ago"
  // after: "2 minutes"
  return addSuffix ? formatted : formatted.replace(/\b(?:ago)\b/, '').trim()
}

export const formatSeconds = (seconds, secondsTemplate = 's', minutesTemplate = 'm', hoursTemplate = 'h') => {
  let duration = ''
  if (seconds < 60) {
    duration = `${seconds.toString()}${secondsTemplate}`
  } else {
    duration = formatDistance(0, seconds * 1000, { includeSeconds: true })
  }
  const result = duration.startsWith('1 ')
    ? duration.replace(' minute', minutesTemplate).replace(' hour', hoursTemplate)
    : duration.replace(' minutes', minutesTemplate).replace(' hours', hoursTemplate)

  return result
}

/**
 * Remove the chainData from statusResponse to gain some storage space
 */
export const formatSwapTxStatusResponseForStorage = sr => {
  if (!sr) {
    return sr
  }

  return {
    axelarTransactionUrl: sr.axelarTransactionUrl,
    toChain: sr.toChain?.transactionUrl
      ? {
          transactionUrl: sr.toChain?.transactionUrl
        }
      : undefined
  }
}

export const simplifyRouteAction = action => {
  return {
    type: action.type,
    provider: action.provider,
    data: {
      type: action.data?.type
    }
  }
}

export const fetchSwapTransactionStatus = async ({ transaction, integratorId, apiUrl }) => {
  const statusEndpoint = `${apiUrl}/v2/status`
  try {
    const response = await axios.get(statusEndpoint, {
      params: {
        transactionId: transaction?.transactionIdForStatus ?? transaction?.transactionId,
        fromChainId: transaction?.fromChain,
        toChainId: transaction?.toChain,
        bridgeType: transaction?.bridgeType,
        quoteId: transaction?.quoteId
      },
      headers: getQueryHeaders(integratorId, transaction?.quoteId)
    })
    return response.data
  } catch (error) {
    if (error) {
      throw new Error('Fetch transaction status failed', { cause: error })
    }
    throw new Error('Fetch transaction status failed', { cause: undefined })
  }
}

export const compareTransactionIds = (idA, idB) => {
  if (!idA || !idB) {
    return false
  }
  const normalizedA = idA.toLowerCase()
  const normalizedB = idB.toLowerCase()

  return normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)
}

/**
 * Checks if the provided action is Coral bridge action
 */
export function isCoralBridgeAction(action) {
  return (
    action.type === ActionType.RFQ &&
    // TODO: update types
    action.provider?.toLowerCase() === 'coral'
  )
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isDepositRoute = route => {
  return !!route && route.transactionRequest?.type === SquidDataType.ChainflipDepositAddress
}

/**
 * Checks if the route contains a Chainflip bridge action
 */
export function isChainflipBridgeTransaction(actions = []) {
  return actions.some(action => action.type === ActionType.BRIDGE && action.data?.type === BridgeType.CHAINFLIP)
}

export function getHistoryTransactionId(tx) {
  switch (tx.txType) {
    case HistoryTxType.SWAP:
      return tx.data.transactionId
    case HistoryTxType.BUY:
      return tx.data.orderId
    case HistoryTxType.SEND:
      return tx.data.hash
  }
}
