import { TransactionErrorType } from '../../core/types/error'
import { WidgetEvents } from './eventService'

/**
 * Normalizes different error structures into a consistent format
 * This helps handle different wallet error formats uniformly
 */
export const normalizeError = error => {
  // Handle nested error objects (like Rainbow's error.error structure)
  if (error?.error && typeof error.error === 'object') {
    return {
      code: error.error.code,
      message: error.error.message,
      reason: error.error.reason
    }
  }
  // Handle direct error properties
  return {
    code: error?.code,
    message: error?.message,
    reason: error?.reason
  }
}

export const transactionErrorCode = {
  // Metamask
  ACTION_REJECTED: {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'EVM: ACTION_REJECTED'
  },
  // Keplr
  'Request rejected': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'Request rejected'
  },
  // Phantom Solana, Cosmostation, Sui Wallet
  'User rejected the request.': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'SOL: User rejected the request'
  },
  // Leap
  'Chain approval rejected': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'Request rejected'
  },
  // Gnosis Safe
  'Transaction was rejected': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'GNOSIS: Transaction was rejected'
  },
  // Metamask, Surf (Sui), OKX (Sui)
  4001: {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'EVM: REJECTED: CODE 4001'
  },
  // Rainbow
  '-32603': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'EVM: REJECTED: CODE -32603'
  },
  // Joey (XRPL)
  'User rejected.': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'WalletConnect: User rejected.'
  },
  // Girin (XRPL)
  'User rejected': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'WalletConnect: User rejected.'
  },
  // Bifrost (XRPL)
  'The request was rejected by the user': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'WalletConnect: User rejected.'
  },
  // Slush web (Sui)
  'User rejected the request': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'SUI: User rejected the request'
  },
  // Slush web (Sui)
  'User closed the wallet window': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'SUI: User closed the wallet window'
  },
  // Nightly (Sui)
  'User rejected approval': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'SUI: User rejected approval'
  },
  // Backpack (Sui)
  'Approval Denied': {
    type: TransactionErrorType.REJECTED_BY_USER,
    internalLabel: 'SUI: Approval Denied'
  },
  CALL_EXCEPTION: {
    type: TransactionErrorType.CALL_EXCEPTION,
    internalLabel: 'EVM: CALL_EXCEPTION'
  },
  UNKNOWN: {
    type: TransactionErrorType.UNKNOWN,
    internalLabel: 'UNKNOWN ERROR: Transaction failed'
  }
}

/**
 * Detects if an error is a user rejection based on normalized error structure
 */
export const isUserRejectionError = normalizedError => {
  const { code, message } = normalizedError
  // Check if the error matches any known rejection patterns from transactionErrorCode
  return Object.entries(transactionErrorCode).some(([key, value]) => {
    if (value.type !== TransactionErrorType.REJECTED_BY_USER) return false
    // Check if code matches (converting to string for comparison)
    if (code != undefined && key === code.toString()) return true
    // Check if message matches
    if (message && key === message) return true
    return false
  })
}

/**
 * Converts any transaction error into a standardized TransactionErrorWithMessage format
 * @param error The error to convert
 * @returns A standardized error object
 */
export const getTransactionError = error => {
  const normalizedError = normalizeError(error)
  if (isUserRejectionError(normalizedError)) {
    // Return the specific rejection error if we can find it
    if (normalizedError.code) {
      const codeError = transactionErrorCode[normalizedError.code.toString()]
      if (codeError?.type === TransactionErrorType.REJECTED_BY_USER) return codeError
    }
    if (normalizedError.message) {
      const messageError = transactionErrorCode[normalizedError.message]
      if (messageError?.type === TransactionErrorType.REJECTED_BY_USER) return messageError
    }
    return transactionErrorCode.ACTION_REJECTED
  }
  if (normalizedError.code) {
    return transactionErrorCode[normalizedError.code.toString()] || transactionErrorCode.UNKNOWN
  }
  if (normalizedError.message) {
    return transactionErrorCode[normalizedError.message] || transactionErrorCode.UNKNOWN
  }
  return transactionErrorCode.UNKNOWN
}

/**
 * Handles dispatching appropriate events based on the error type
 */
export const handleTransactionErrorEvents = ({ error, transactionParams, walletProviderName, squidRoute }) => {
  // Handle wallet rejection events
  if (error.type === TransactionErrorType.REJECTED_BY_USER) {
    // At this point, we don't have transactionParams so we should use the squidRoute
    WidgetEvents.getInstance().dispatchWalletReject({
      chainId: squidRoute?.params.fromChain || '',
      provider: walletProviderName || '',
      reason: error.internalLabel
    })
  } else if (error.type === TransactionErrorType.CALL_EXCEPTION) {
    // Handle on-chain transaction errors
    WidgetEvents.getInstance().dispatchOnchainReject({
      walletAddress: transactionParams?.fromAddress || '',
      chainId: transactionParams?.fromChain?.chainId || '',
      reason: error.internalLabel,
      txHash: transactionParams?.transactionId
    })
  }
  // Always dispatch the swap route execution error
  WidgetEvents.getInstance().dispatchSwapRouteExecutionError({
    error
  })
  return error
}

/**
 * Check if the error is a Squid route error
 */
export const isSwapRouteError = error => {
  return error && (typeof error.code === 'string' || typeof error.errorType === 'string')
}

export const isStatusError = error => {
  return error && typeof error.errorType === 'string'
}
