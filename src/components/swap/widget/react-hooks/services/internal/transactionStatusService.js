import { ActionType, BridgeType, ChainType } from '@0xsquid/squid-types'
import {
  transactionEndStatuses,
  transactionErrorStatuses,
  transactionRefundedStatuses,
  transactionSuccessStatuses
} from '../../core/constants'
import { SquidStatusErrorType } from '../../core/types/error'
import { HistoryTxType } from '../../core/types/history'
import {
  AxelarStatusResponseType,
  SendTransactionStatus,
  TransactionStatus,
  TransactionType
} from '../../core/types/transaction'
import { FINAL_TRANSACTION_STATUSES } from '../../hooks/onramp/useFiatToCrypto'
import { isStatusError } from './errorService'
import { getMainExplorerUrl, isCoralBridgeAction } from './transactionService'

/**
 * Get the steps for a transaction
 * First step and second step are always the same
 * @param transaction
 * @param statusResponse
 * @returns {TransactionStepStatus[]}
 */
export const getStepStatuses = ({ transaction, statusResponse, onlyFullStatusStep }) => {
  let firstStepStatus
  // "warning" state is a custom one indicating that
  // the user is taking too much time to validate the transaction
  // And can be set to loading
  switch (transaction?.sourceStatus) {
    case 'error':
    case 'success':
    case 'ongoing':
      firstStepStatus = transaction.sourceStatus
      break
    case 'warning':
      firstStepStatus = TransactionStatus.ONGOING
      break
    default:
      firstStepStatus = TransactionStatus.PENDING
  }

  let middleStepStatus =
    !onlyFullStatusStep && firstStepStatus !== 'success' ? TransactionStatus.PENDING : middleStepChecker(statusResponse)
  const lastStepStatus = getLastStepStatus(firstStepStatus, middleStepStatus)
  // Once we have the last step status,
  // we have to override the middle step for some states
  middleStepStatus =
    middleStepStatus === 'needs_gas' || middleStepStatus === 'partial_success'
      ? TransactionStatus.SUCCESS
      : middleStepStatus

  return onlyFullStatusStep ? [middleStepStatus] : [firstStepStatus, middleStepStatus, lastStepStatus]
}

const getLastStepStatus = (first, middle) => {
  if (first === TransactionStatus.PENDING || first === 'ongoing' || first === 'error') {
    return TransactionStatus.PENDING
  }

  switch (middle) {
    case 'initialLoading':
    case 'ongoing':
      return TransactionStatus.PENDING
    default:
      return middle
  }
}

export const getHalfSuccessState = status => {
  switch (status) {
    case 'success':
      return TransactionStatus.SUCCESS
    case 'partial_success': // Received axlUSDC
      return TransactionStatus.PARTIAL_SUCCESS
    case 'needs_gas':
      return TransactionStatus.NEEDS_GAS
    default:
      return undefined
  }
}

const middleStepChecker = statusResponse => {
  const squidStatus = statusResponse?.data
  const successState = getHalfSuccessState(squidStatus?.squidTransactionStatus)
  if (successState) {
    return successState
  }

  if (squidStatus?.status === AxelarStatusResponseType.ERROR) {
    const { error } = squidStatus
    if (isStatusError(error)) {
      if (error.errorType === SquidStatusErrorType.NotFoundError) {
        return TransactionStatus.ERROR
      }
    }
    return TransactionStatus.ERROR
  }

  if (statusResponse?.isInitialLoading) {
    return TransactionStatus.INITIAL_LOADING
  }

  return TransactionStatus.ONGOING
}

export const getStepsInfos = ({
  fromChain,
  toChain,
  fromToken,
  toToken,
  amount,
  txType,
  transaction,
  statusResponse
}) => {
  const [firstStepStatus, middleStepStatus, lastStepStatus] = getStepStatuses({
    transaction,
    statusResponse
  })

  const payLabel = `Pay ${amount} ${fromToken?.symbol} on ${fromChain?.networkName}`
  const swapForUSDCLabel = `Swap ${fromToken?.symbol} for axlUSDC`
  const sendUSDCLabel = `Send axlUSDC to ${toChain?.networkName}`
  const swapUSDCLabel = `Swap axlUSDC for ${toToken?.symbol}`
  const receiveLabel = `Receive ${toToken?.symbol} on ${toChain?.networkName}`
  const axelarUrl = getMainExplorerUrl(transaction)
  const sourceExplorerUrl = transaction?.sourceTxExplorerUrl
  const destinationExplorerUrl = statusResponse?.data?.toChain?.transactionUrl

  switch (txType) {
    case TransactionType.CALL_BRIDGE_CALL:
      return [
        {
          label: payLabel,
          status: firstStepStatus,
          link: sourceExplorerUrl,
          subTitle: 'View on explorer'
        },
        {
          label: swapForUSDCLabel,
          status: firstStepStatus !== 'success' ? TransactionStatus.PENDING : firstStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: sendUSDCLabel,
          status: middleStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: swapUSDCLabel,
          status: middleStepStatus !== 'success' ? TransactionStatus.PENDING : middleStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: receiveLabel,
          status: lastStepStatus,
          link: destinationExplorerUrl,
          subTitle: 'View on explorer'
        }
      ]
    case TransactionType.CALL_BRIDGE:
      return [
        {
          label: payLabel,
          status: firstStepStatus,
          link: sourceExplorerUrl,
          subTitle: 'View on explorer'
        },
        {
          label: swapForUSDCLabel,
          status: firstStepStatus !== 'success' ? TransactionStatus.PENDING : firstStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: sendUSDCLabel,
          status: middleStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: receiveLabel,
          status: lastStepStatus,
          link: destinationExplorerUrl,
          subTitle: 'View on explorer'
        }
      ]
    case TransactionType.BRIDGE:
      return [
        {
          label: payLabel,
          status: firstStepStatus,
          link: sourceExplorerUrl,
          subTitle: 'View on explorer'
        },
        {
          label: sendUSDCLabel,
          status: firstStepStatus !== 'success' ? TransactionStatus.PENDING : firstStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: receiveLabel,
          status: lastStepStatus,
          link: destinationExplorerUrl,
          subTitle: 'View on explorer'
        }
      ]
    case TransactionType.BRIDGE_CALL:
      return [
        {
          label: payLabel,
          status: firstStepStatus,
          link: sourceExplorerUrl,
          subTitle: 'View on explorer'
        },
        {
          label: sendUSDCLabel,
          status: firstStepStatus !== 'success' ? TransactionStatus.PENDING : firstStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: swapUSDCLabel,
          status: middleStepStatus,
          link: axelarUrl,
          subTitle: 'View on Axelarscan'
        },
        {
          label: receiveLabel,
          status: lastStepStatus,
          link: destinationExplorerUrl,
          subTitle: 'View on explorer'
        }
      ]
    default:
      return []
  }
}

const TX_STATUS_REFETCH_INTERVAL = {
  DEFAULT: 10_000,
  CORAL: 3_000
}

/**
 * Returns the status refetch interval of a Swap transaction
 * Some routes have a faster refetch interval (i.e Coral RFQ routes)
 *
 * @returns Refetch interval in milliseconds
 */
export const getSwapTxStatusRefetchInterval = transaction => {
  if ((transaction?.actions?.length ?? 0) < 1) {
    return TX_STATUS_REFETCH_INTERVAL.DEFAULT
  }
  const isCoralRoute = transaction?.actions?.some(isCoralBridgeAction)

  if (isCoralRoute) {
    return TX_STATUS_REFETCH_INTERVAL.CORAL
  }

  return TX_STATUS_REFETCH_INTERVAL.DEFAULT
}

const chainTypeToRefetchInterval = {
  [ChainType.EVM]: 1_000,
  [ChainType.COSMOS]: 1_000,
  [ChainType.SOLANA]: 2_000,
  // BTC is slow, no need to refetch too often
  [ChainType.BTC]: 30_000,
  [ChainType.SUI]: 1_000,
  [ChainType.XRPL]: 1_000
}

/**
 * Returns the status refetch interval of a Send transaction
 *
 * @returns Refetch interval in milliseconds
 */
export const getSendTxStatusRefetchInterval = chainType => {
  return chainTypeToRefetchInterval[chainType]
}

// TODO: update types and use BridgeType instead
export const chainflipMultihopBridgeType = 'chainflipMultihop'

// List taken from Squid API repo
// Only certain bridges are supported, passing non-supported bridges to the API will throw an error
// TODO: Important to keep this list updated
const supportedBridgeTypes = [
  BridgeType.CCTP,
  BridgeType.NOBLE_CCTP,
  BridgeType.CHAINFLIP,
  chainflipMultihopBridgeType,
  BridgeType.RFQ
]

/**
 * Some routes have special bridges, like CCTP or Chainflip
 * Squid API is using a different status endpoint to track status of these bridges
 * Only certain bridges are supported
 * @param transaction
 * @returns
 */
export const getBridgeType = actions => {
  const bridgeActions = actions?.filter(action => action.type === ActionType.BRIDGE)
  if (bridgeActions?.length === 2) {
    const chainflipBridgeAction = bridgeActions.some(action => action.data?.type === BridgeType.CHAINFLIP)
    const axelarGmpBridgeAction = bridgeActions.some(action => action.data?.type === BridgeType.AXELAR_GMP)
    if (chainflipBridgeAction && axelarGmpBridgeAction) {
      return chainflipMultihopBridgeType
    }
  }
  const firstBridgeAction = actions?.find(action => action.type === ActionType.BRIDGE || action.type === ActionType.RFQ)
  const actionBridgeType = firstBridgeAction?.data?.type
  if (!actionBridgeType) return

  return supportedBridgeTypes.find(supportedBridgeType => supportedBridgeType === actionBridgeType)
}

export const getTransactionStatus = statusResponse => {
  if (statusResponse.status) return statusResponse.status
  if (statusResponse.squidTransactionStatus) return statusResponse.squidTransactionStatus

  return undefined
}

/**
 * Checks statusResponse of a transaction and returns the end status (if any)
 * If transaction status is not an end status, means the transaction is still pending
 *
 * End statuses are success, refunded, or error
 */
export const getTransactionEndStatus = ({ statusResponse }) => {
  const transactionStatus = getTransactionStatus(statusResponse)
  if (!transactionStatus) return
  const isSuccessStatus = transactionSuccessStatuses.includes(transactionStatus)
  const isRefundedStatus = transactionRefundedStatuses.includes(transactionStatus)
  const isErrorStatus = transactionErrorStatuses.includes(transactionStatus)
  const isEndStatus = isSuccessStatus || isRefundedStatus || isErrorStatus
  const newStatus = (() => {
    if (isSuccessStatus) {
      return TransactionStatus.SUCCESS
    } else if (isRefundedStatus) {
      return TransactionStatus.REFUNDED
    } else if (isErrorStatus) {
      return TransactionStatus.ERROR
    }
  })()

  return isEndStatus && newStatus != null ? newStatus : undefined
}

export function isHistoryTransactionPending({ txType, data }) {
  switch (txType) {
    case HistoryTxType.SWAP:
      const swapTxPendingStatuses = [
        TransactionStatus.INITIAL_LOADING,
        TransactionStatus.ONGOING,
        TransactionStatus.PENDING
      ]
      return swapTxPendingStatuses.includes(data.status)
    case HistoryTxType.BUY:
      const fiatTxPendingStatuses = ['awaiting_payment', 'processing']
      return fiatTxPendingStatuses.includes(data.status)
    case HistoryTxType.SEND:
      const sendTxPendingStatuses = [SendTransactionStatus.ONGOING]
      return sendTxPendingStatuses.includes(data.status)
  }
}

export function isHistoryTransactionFailed({ txType, data }) {
  switch (txType) {
    case HistoryTxType.SWAP:
      return data.status === TransactionStatus.ERROR
    case HistoryTxType.BUY:
      return data.status === 'failed'
    case HistoryTxType.SEND:
      return data.status === SendTransactionStatus.ERROR
  }
}

export function isHistoryTransactionWarning({ txType, data }) {
  switch (txType) {
    case HistoryTxType.SWAP:
      return data.status === TransactionStatus.WARNING
    case HistoryTxType.BUY:
    case HistoryTxType.SEND:
      // there's no warning status for buy or send transactions
      return false
  }
}

export function isHistoryTransactionEnded({ txType, data }) {
  switch (txType) {
    case HistoryTxType.SWAP:
      return transactionEndStatuses.includes(data.status)
    case HistoryTxType.BUY:
      return FINAL_TRANSACTION_STATUSES.includes(data.status)
    case HistoryTxType.SEND:
      const sendTxEndedStatuses = [SendTransactionStatus.SUCCESS, SendTransactionStatus.ERROR]
      return sendTxEndedStatuses.includes(data.status)
  }
}
