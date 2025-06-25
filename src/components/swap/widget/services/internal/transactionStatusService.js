import { ActionType, BridgeProvider, ChainType, RouteActionStatus } from '@0xsquid/squid-types'
import {
  AxelarStatusResponseType,
  CHAIN_IDS,
  getSourceExplorerTxUrl,
  getTokenImage,
  SquidStatusErrorType,
  TransactionStatus
} from 'src/components/swap/widget/react-hooks'
import { isStatusError } from './errorService'
import { getConfirmInWalletStep, getDescriptionBlocks, getSwapStateItemStatus } from './transactionService'

/**
 * Get the steps for a transaction
 * First step and second step are always the same
 * @param transaction
 * @param statusResponse
 * @returns {TransactionStepStatus[]}
 */
export const getStepStatuses = ({ transaction, statusResponse, onlyFullStatusStep, txStatus }) => {
  if (txStatus === TransactionStatus.SUCCESS) {
    return [TransactionStatus.SUCCESS, TransactionStatus.SUCCESS, TransactionStatus.SUCCESS]
  }
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
  toChain,
  toToken,
  transaction,
  statusResponse,
  txStatus,
  actions,
  fromChain,
  fromToken,
  findChain
}) => {
  if (!actions) {
    return []
  }
  const confirmInWalletStep = getConfirmInWalletStep({
    txStatus
  })
  const statuses = getStepStatuses({
    transaction,
    statusResponse,
    txStatus
  })
  const firstStepStatus = getSwapStateItemStatus({
    stepStatus: statuses[0]
  })
  const lastStepStatus = getSwapStateItemStatus({
    stepStatus: statuses[2]
  })
  const txHashByChainIdMapping =
    statusResponse?.data?.routeStatus?.reduce(
      (acc, step) => ({
        ...acc,
        [step.chainId]: step.txHash
      }),
      {}
    ) ?? {}
  const sourceExplorerUrl =
    transaction?.sourceTxExplorerUrl ||
    (fromChain?.chainId && txHashByChainIdMapping[fromChain.chainId]
      ? getSourceExplorerTxUrl(fromChain, txHashByChainIdMapping[fromChain.chainId] ?? '')
      : undefined)
  const destinationExplorerUrl =
    toChain?.chainId && txHashByChainIdMapping[toChain.chainId]
      ? getSourceExplorerTxUrl(toChain, txHashByChainIdMapping[toChain.chainId] ?? '')
      : undefined
  const steps = actions.map(action => {
    const isSrcChainAction = isSourceChainAction({
      action,
      fromChainId: fromChain?.chainId ?? ''
    })
    const actionDestinationChain = findChain(action.toChain)
    const link = getActionExplorerLink({
      action,
      statusResponse,
      txHashByChainIdMapping,
      findChain,
      sourceTxExplorerUrl: transaction?.sourceTxExplorerUrl,
      fromChain
    })
    const routeStepStatus = statusResponse?.data?.routeStatus?.find(status => status.chainId === action.toChain)?.status
    // Status from backend can take some time,
    // if tx is on the source chain we can use the status we already have available
    const status = isSrcChainAction ? firstStepStatus : mapRouteStepStatusToUiStatus(routeStepStatus)
    return {
      descriptionBlocks: getDescriptionBlocks({
        action,
        toChain: actionDestinationChain
      }),
      status,
      link
    }
  })
  const receiveTokensStep = {
    descriptionBlocks: [
      {
        type: 'string',
        value: 'Receive'
      },
      {
        type: 'image',
        value: getTokenImage(toToken) ?? '',
        rounded: true
      },
      {
        type: 'string',
        value: `${toToken?.symbol} on`
      },
      {
        type: 'image',
        value: toChain?.chainIconURI ?? ''
      },
      {
        type: 'string',
        value: toChain?.networkName ?? ''
      }
    ],
    status: lastStepStatus === 'success' || lastStepStatus === 'executed' ? 'success' : 'pending',
    link: destinationExplorerUrl
  }
  const payOnSourceStep = {
    descriptionBlocks: [
      {
        type: 'string',
        value: 'Pay'
      },
      {
        type: 'image',
        value: getTokenImage(fromToken) ?? '',
        rounded: true
      },
      {
        type: 'string',
        value: `${fromToken?.symbol} on`
      },
      {
        type: 'image',
        value: fromChain?.chainIconURI ?? ''
      },
      {
        type: 'string',
        value: fromChain?.networkName ?? ''
      }
    ],
    status: firstStepStatus === 'success' || firstStepStatus === 'executed' ? 'executed' : firstStepStatus,
    link: sourceExplorerUrl
  }
  return [
    confirmInWalletStep,
    payOnSourceStep,
    ...steps.map((step, index, self) => {
      const isThereAPreviousOngoingStep = self.some((s, i) => i < index && s.status === 'ongoing')
      if (isThereAPreviousOngoingStep) {
        return { ...step, status: 'pending' }
      }
      return step
    }),
    receiveTokensStep
  ]
}

/**
 * Returns the correct explorer link for the provided action
 * Most actions will use the tx hash from backend's routeStatus
 * There are some special cases:
 * - Chainflip bridge action: uses the transaction url from status response
 * - Axelar bridge action: uses the axelar transaction url from status response
 * - Source chain action: uses the sourceTxExplorerUrl from transaction params, this is faster than waiting for status response
 */
function getActionExplorerLink({
  action,
  statusResponse,
  txHashByChainIdMapping,
  findChain,
  sourceTxExplorerUrl,
  fromChain
}) {
  const isChainflipBridgeAction = action.type === ActionType.BRIDGE && action.provider === BridgeProvider.CHAINFLIP
  if (isChainflipBridgeAction) {
    const chainflipScanUrl =
      action.fromChain === fromChain?.chainId
        ? statusResponse?.data?.fromChain?.transactionUrl
        : statusResponse?.data?.toChain?.transactionUrl
    return chainflipScanUrl
  }
  const isSrcChainAction = isSourceChainAction({
    action,
    fromChainId: fromChain?.chainId ?? ''
  })
  if (isSrcChainAction) {
    return sourceTxExplorerUrl
  }
  const isAxelarBridgeAction = action.type === ActionType.BRIDGE && action.provider === BridgeProvider.AXELAR
  if (isAxelarBridgeAction) {
    return statusResponse?.data?.axelarTransactionUrl || undefined
  }
  const txHash = txHashByChainIdMapping[action.fromChain]
  if (!txHash) return undefined
  return getSourceExplorerTxUrl(findChain(action.fromChain), txHash)
}

/**
 * Map status from backend to UI status keys
 */
function mapRouteStepStatusToUiStatus(routeActionStatus) {
  switch (routeActionStatus) {
    case RouteActionStatus.SUCCESS:
      return 'executed'
    case RouteActionStatus.AWAITING:
    case RouteActionStatus.UNKNOWN:
    case RouteActionStatus.NOT_FOUND:
      return 'ongoing'
    case RouteActionStatus.FAILURE:
      return 'error'
    case RouteActionStatus.REFUNDED:
      return 'warning'
    default:
      return 'ongoing'
  }
}

function isSourceChainAction({ action, fromChainId }) {
  return action.fromChain === fromChainId && action.toChain === fromChainId
}

/**
 * Default confirmation time for each chain type
 */
const chainTypeToConfirmationTimeMapping = {
  [ChainType.EVM]: 3,
  [ChainType.COSMOS]: 3,
  [ChainType.SOLANA]: 10,
  [ChainType.BTC]: 1 * 60 * 10, // 10 minutes
  [ChainType.SUI]: 2,
  [ChainType.XRPL]: 5
}

/**
 * Some chains can have longer confirmation times than others in the same ecosystem
 * e.g. Polygon is slower than most EVMs
 */
const chainIdToConfirmationTimeMapping = {
  [CHAIN_IDS.POLYGON]: 5
}

/**
 * Returns the estimated confirmation time for a given chain
 */
export function getEstimatedConfirmationTimeForChain(chain) {
  return chainIdToConfirmationTimeMapping[chain.chainId] ?? chainTypeToConfirmationTimeMapping[chain.chainType]
}
