import { ActionType, BridgeProvider, ChainType } from '@0xsquid/squid-types'
import { convertTokenAmountToUSD, findNativeToken, findToken, formatSeconds, simplifyRouteAction } from '..'
import { gasRefundMultiplier } from '../../core/constants'
import { formatBNToReadable, formatUnitsRounded } from './numberService'

export const formatAmount = (amountInWei, decimals) => (amountInWei ? formatBNToReadable(amountInWei, decimals) : '')

export const parseToAmountUSD = toAmountUSD => (toAmountUSD ? parseFloat(toAmountUSD.replace(/,/g, '')) : 0)

const CHAIN_TYPES_SUPPORTING_GAS_REFUND = [ChainType.EVM, ChainType.SUI]

/**
 * Calculates the expected gas refund
 *
 * Currently we only refund when source chain supports gas refunds
 * and Axelar is one of the bridge actions
 */
export const calculateExpectedGasRefundCost = (firstFeeCost, fromChainType, actions) => {
  if (!fromChainType || !CHAIN_TYPES_SUPPORTING_GAS_REFUND.includes(fromChainType)) {
    return BigInt(0)
  }
  const containsAxelarBridgeAction = actions?.some(
    action => action.type === ActionType.BRIDGE && action.provider === BridgeProvider.AXELAR
  )
  if (!containsAxelarBridgeAction) {
    return BigInt(0)
  }
  const amount = BigInt(firstFeeCost?.amount ?? '0')
  const refundMultiplier = BigInt(gasRefundMultiplier)
  return (amount * refundMultiplier) / BigInt(100)
}

export const calculateTotalNativeFees = ({ expressFeeCost, firstFeeCost, firstGasCost, sameTokenBetweenFees }) =>
  BigInt(expressFeeCost?.amount ?? '0') +
  (sameTokenBetweenFees
    ? BigInt(firstFeeCost?.amount ?? '0') + BigInt(firstGasCost?.amount ?? '0')
    : BigInt(firstGasCost?.amount ?? '0'))

export const isFromBalanceEnoughToSwap = ({
  isFromTokenNative,
  fromAmount,
  totalFeesInNativeTokenPlusRatio,
  nativeTokenBalanceFromChainWei
}) => {
  const fromAmountBigInt = BigInt(fromAmount ?? '0')
  const totalFeesInNativeTokenPlusRatioBigInt = totalFeesInNativeTokenPlusRatio
  const nativeTokenBalanceFromChainWeiBigInt = nativeTokenBalanceFromChainWei
  return isFromTokenNative
    ? fromAmountBigInt + totalFeesInNativeTokenPlusRatioBigInt <= nativeTokenBalanceFromChainWeiBigInt
    : totalFeesInNativeTokenPlusRatioBigInt <= nativeTokenBalanceFromChainWeiBigInt
}

export const calculateMinAmountValueWarnMsg = ({
  isFromTokenNative,
  nativeTokenBalanceFromChainWei,
  sourceChainNativeTokenDecimals,
  totalFeesInNativeTokenPlusRatio
}) =>
  isFromTokenNative
    ? (() => {
        const minAmount = nativeTokenBalanceFromChainWei - totalFeesInNativeTokenPlusRatio
        return minAmount > BigInt(0) ? formatBNToReadable(minAmount, sourceChainNativeTokenDecimals) : '0'
      })()
    : undefined

/**
 * Calculates the estimated duration of a route
 *
 * @param {number} estimatedRouteDuration - The estimated route duration in seconds
 * @param {boolean} isSingleChainRoute - Flag indicating whether the route is single chain
 *
 * @returns {Object} An object containing the estimated duration and a formatter function
 */
export const formatEstimatedRouteDuration = ({ estimatedRouteDuration, isSingleChainRoute }) => {
  const fallbackDuration = 20
  let durationInSeconds = fallbackDuration
  if (estimatedRouteDuration) {
    durationInSeconds = Math.round(estimatedRouteDuration)
  } else if (isSingleChainRoute) {
    durationInSeconds = 1
  } else {
    durationInSeconds = fallbackDuration
  }
  return {
    seconds: durationInSeconds,
    format: (sTemplate = 's', mTemplate = 'm', hTemplate = 'h') =>
      formatSeconds(durationInSeconds, sTemplate, mTemplate, hTemplate)
  }
}

/**
 * Calculates and formats various estimate results based on the provided Squid route and additional parameters.
 *
 * @param {RouteResponse["route"]} squidRoute - The Squid route containing estimate information.
 * @param {Token[]} tokens - An array of token objects.
 * @param {ChainData} fromChain - The source chain object.
 * @param {ChainData} toChain - The destination chain object.
 * @param {boolean} collectFees - Flag indicating whether to collect fees.
 * @param {string} nativeTokenBalanceFromChain - The native token balance on the source chain.
 * @param {boolean} expressActivatedUI - Flag indicating whether express mode is activated in the UI.
 * @returns {Object} An object containing various estimate results and calculations, including token information,
 *                   amounts, fees, gas costs, and other relevant data for the transaction.
 */
export const calculateEstimateResults = ({
  squidRoute,
  tokens,
  fromChain,
  toChain,
  collectFees,
  nativeTokenBalanceFromChainWei
}) => {
  const fromToken = findToken(tokens, squidRoute?.params.fromChain, squidRoute?.params.fromToken)
  const fromAmount = squidRoute?.estimate?.fromAmount
  const fromAmountFormatted = formatAmount(fromAmount, fromToken?.decimals)
  const sourceChainNativeToken = findNativeToken(tokens, fromChain)
  const destChainNativeToken = findNativeToken(tokens, toChain)
  const toAmountUSD = squidRoute?.estimate?.toAmountUSD
  const toAmountUSDFloat = parseToAmountUSD(toAmountUSD)
  const exchangeRate = squidRoute?.estimate.exchangeRate ?? '0'
  const toAmountMinUSD = squidRoute?.estimate.toAmountMinUSD ?? '0'
  const toAmountMin = formatBNToReadable(squidRoute?.estimate.toAmountMin ?? '0', squidRoute?.estimate.toToken.decimals)
  const toAmount = formatUnitsRounded(
    (squidRoute?.estimate.toAmount ?? '0').toString(),
    squidRoute?.estimate.toToken.decimals,
    14
  )
  const estimate = squidRoute?.estimate
  const allFeeCosts = estimate?.feeCosts ?? []
  const allGasCosts = estimate?.gasCosts ?? []
  const firstFeeCost = allFeeCosts.length > 0 ? allFeeCosts[0] : undefined
  const firstGasCost = allGasCosts.length > 0 ? allGasCosts[0] : undefined
  const expressFeeCost = allFeeCosts.find(f => f.name === 'Boost fee')

  const integratorFeeCost =
    allFeeCosts.length > 0 && collectFees ? allFeeCosts.find(f => f.name === 'Integrator fee') : undefined

  const expectedGasRefundCost = calculateExpectedGasRefundCost(
    firstFeeCost,
    fromChain?.chainType,
    estimate?.actions.map(simplifyRouteAction)
  )

  const expectedGasRefundCostUSD = convertTokenAmountToUSD(
    formatBNToReadable(expectedGasRefundCost, firstFeeCost?.token.decimals ?? 18),
    firstFeeCost?.token.usdPrice ?? '0'
  )

  const sameTokenBetweenFees =
    firstFeeCost?.token.address === firstGasCost?.token.address &&
    firstFeeCost?.token.chainId === firstGasCost?.token.chainId

  const isFromTokenNative =
    // TODO: temporary fix, currently nativeCurrency.symbol is not always in uppercase
    fromToken?.symbol.toUpperCase() === fromChain?.nativeCurrency.symbol.toUpperCase()

  const totalNativeFees = calculateTotalNativeFees({
    expressFeeCost,
    firstFeeCost,
    firstGasCost,
    sameTokenBetweenFees
  })
  const totalFeesInNativeTokenPlusRatio = (totalNativeFees * BigInt(110)) / BigInt(100)

  const fromBalanceEnoughToSwap = isFromBalanceEnoughToSwap({
    isFromTokenNative,
    fromAmount,
    fromTokenDecimals: fromToken?.decimals,
    totalFeesInNativeTokenPlusRatio,
    nativeTokenBalanceFromChainWei
  })

  const minAmountValueWarnMsg = calculateMinAmountValueWarnMsg({
    isFromTokenNative,
    nativeTokenBalanceFromChainWei,
    sourceChainNativeTokenDecimals: sourceChainNativeToken?.decimals,
    totalFeesInNativeTokenPlusRatio
  })
  const isSingleChainRoute = fromChain?.chainId === toChain?.chainId

  const estimatedRouteDuration = formatEstimatedRouteDuration({
    estimatedRouteDuration: squidRoute?.estimate?.estimatedRouteDuration,
    isSingleChainRoute
  })
  return {
    fromToken,
    fromAmount,
    fromAmountFormatted,
    sourceChainNativeToken,
    destChainNativeToken,
    toAmountUSD,
    toAmountUSDFloat,
    exchangeRate,
    toAmountMinUSD,
    toAmountMin,
    toAmount,
    allFeeCosts,
    allGasCosts,
    firstFeeCost,
    firstGasCost,
    expressFeeCost,
    integratorFeeCost,
    expectedGasRefundCost,
    expectedGasRefundCostUSD,
    sameTokenBetweenFees,
    isFromTokenNative,
    totalNativeFees,
    totalFeesInNativeTokenPlusRatio,
    fromBalanceEnoughToSwap,
    minAmountValueWarnMsg,
    estimatedRouteDuration
  }
}

/**
 * Calculates the total estimate with refund for a transaction.
 *
 * @param allFeeCosts - Total fee costs of the transaction
 * @param expectedGasRefundCost - The expected gas refund cost as a bigint.
 * @param getUSDValue - A function to convert an amount to its USD value.
 * @returns An object containing the total amount, total amount in USD, and the fee token.
 */
export const calculateTotalWithRefundEstimate = (allFeeCosts, expectedGasRefundCost, getUSDValue) => {
  const initialTotalFees = {
    totalFeeAmount: BigInt(0),
    totalFeeUsd: 0
  }

  const { totalFeeAmount, totalFeeUsd } =
    allFeeCosts?.reduce((totalFees, currentFee) => {
      return {
        totalFeeAmount: BigInt(totalFees.totalFeeAmount) + BigInt(currentFee.amount),
        totalFeeUsd: Number(totalFees.totalFeeUsd) + Number(currentFee.amountUsd)
      }
    }, initialTotalFees) ?? initialTotalFees
  const totalFeeAmountMinusRefund = totalFeeAmount - expectedGasRefundCost
  const firstFeeCost = allFeeCosts?.[0]
  const totalFeeAmountMinusRefundBn = formatBNToReadable(totalFeeAmountMinusRefund, firstFeeCost?.token?.decimals ?? 18)
  const formattedRefundCost = formatBNToReadable(expectedGasRefundCost, firstFeeCost?.token.decimals ?? 18)
  const formattedRefundCostUsd = getUSDValue(formattedRefundCost)
  const totalFeeUsdMinusRefund = totalFeeUsd - Number(formattedRefundCostUsd ?? 0)
  return {
    totalAmount: totalFeeAmountMinusRefundBn,
    totalAmountUSD: totalFeeUsdMinusRefund,
    feeToken: firstFeeCost?.token
  }
}

/**
 * Calculates the proposed gas amount for the destination chain.
 *
 * @param destChainNativeToken - The symbol of the native token for the destination chain.
 * @returns An object containing the proposed gas amount value and the currency symbol.
 */
export const getProposedGasDestinationAmount = destChainNativeToken => {
  const gasAmounts = {
    GLMR: 5.289,
    ETH: 0.0009,
    AVAX: 0.115,
    BNB: 0.00425,
    FTM: 4.45,
    CELO: 3.052,
    KAVA: 2.339,
    MATIC: 1.795
  }
  return {
    value: gasAmounts[destChainNativeToken ?? ''] ?? 0,
    currency: destChainNativeToken
  }
}
