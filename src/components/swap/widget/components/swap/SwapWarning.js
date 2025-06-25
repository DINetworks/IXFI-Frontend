import {
  formatBNToReadable,
  formatHash,
  formatTokenAmount,
  formatUsdAmount
} from 'src/components/swap/widget/react-hooks'
import { getSquidRouteErrorMessage } from 'src/components/swap/widget/services/internal/errorService'

export const getSwapError = ({
  priceImpactStatus,
  fromAmount,
  minAmountValueWarnMsg,
  isNativeBalanceEnoughToPayFees,
  isFromTokenNative,
  squidRouteError,
  sourceChainNativeToken,
  destChainNativeToken,
  swapAmountExceedsLimit,
  fromToken,
  toToken,
  toChain,
  fromBalanceEnoughToSwap,
  isFetchingEstimate,
  isConnectedOnSource,
  isDestinationAddressSet,
  degenMode,
  totalFeesInNativeTokenPlusRatio,
  destinationAddress,
  isDestinationAddressConnected,
  accountActivatedInfoQuery,
  isTrustLineApprovedQuery
}) => {
  // do not display errors while fetching quotes
  if (isFetchingEstimate) {
    return {}
  }

  const axiosError = squidRouteError
  const squidError = axiosError?.response?.data
  if (squidError) {
    const squidRouteErrorMessage = getSquidRouteErrorMessage(squidError)
    return {
      toolbarError: squidRouteErrorMessage
    }
  }

  // TODO: Delete this when liquidity is good enough
  if (swapAmountExceedsLimit) {
    return {
      toolbarError: `Transaction exceeds trade limit of ${formatUsdAmount(limitTradeSizeUsd)}`
    }
  }

  if (priceImpactStatus === 'critical' && !degenMode) {
    return {
      toolbarError: 'Price impact too high, try reducing the swap amount'
    }
  }

  if (priceImpactStatus === 'warning' && !degenMode) {
    return {
      toolbarError: 'Price impact high, try reducing the swap amount'
    }
  }
  // do not display errors related to balance when not connected on source
  if (!isConnectedOnSource || !isDestinationAddressSet) {
    return {}
  }

  if (!fromBalanceEnoughToSwap) {
    return {
      swapConfigError: `Not enough ${fromToken?.symbol}`
    }
  }

  if (!fromAmount || parseFloat(fromAmount) <= 0) {
    return {}
  }

  // There's not enough native balance to pay for the gas + the amount
  if (!isNativeBalanceEnoughToPayFees && isConnectedOnSource && sourceChainNativeToken) {
    // native fees + fromAmount (if native)
    const totalNativeBalanceNeeded =
      (totalFeesInNativeTokenPlusRatio ?? BigInt(0)) + BigInt(isFromTokenNative ? fromAmount : 0)
    const nativeBalanceNeededFormatted = formatTokenAmount(
      formatBNToReadable(totalNativeBalanceNeeded, sourceChainNativeToken.decimals),
      { simplified: true }
    )

    const shortMessage = `Not enough ${sourceChainNativeToken.symbol} left to pay gas`
    const fullMessage = `${shortMessage}. Need ${nativeBalanceNeededFormatted} ${sourceChainNativeToken.symbol}`
    // If source token is native and nativeFees < balance
    // user can adjust fromAmount to pay for native fees
    const canAdjustNativeAmount =
      isFromTokenNative && minAmountValueWarnMsg !== '0' && minAmountValueWarnMsg !== undefined

    return canAdjustNativeAmount
      ? {
          toolbarError: shortMessage,
          showFitGasButton: true
        }
      : {
          toolbarError: fullMessage
        }
  }
  // XRPL dest account not activated
  if (accountActivatedInfoQuery?.data?.isActivated === false) {
    // if the token is native XRP, user can activate the account by sending the base reserve amount
    if (toToken?.address.toLowerCase() === nativeXrplTokenAddress.toLowerCase()) {
      const isFromAmountLessThanReserveBase =
        BigInt(fromAmount ?? 0) < (accountActivatedInfoQuery.data.reserveBaseBn ?? BigInt(0))
      if (isFromAmountLessThanReserveBase) {
        return {
          toolbarError: `Send at least ${formatBNToReadable(
            accountActivatedInfoQuery.data.reserveBaseBn ?? 0,
            destChainNativeToken?.decimals
          )} XRP to activate your account`
        }
      }
    } else {
      return {
        toolbarError: `Top up your wallet with ${formatBNToReadable(
          accountActivatedInfoQuery.data.reserveBaseBn ?? 0,
          destChainNativeToken?.decimals
        )} XRP to activate your account`
      }
    }
  }

  if (
    // only show the error if dest address is not connected
    // if destination address is connected, the user can sign the approval transaction
    !isDestinationAddressConnected &&
    toChain?.chainType === ChainType.XRPL &&
    isTrustLineApprovedQuery.data !== true &&
    !!toToken &&
    !!destinationAddress
  ) {
    const destinationAddressFormatted = formatHash({
      hash: destinationAddress,
      chainType: toChain.chainType
    })

    return {
      toolbarError: `Approve ${toToken.symbol} on ${destinationAddressFormatted} to allow swaps`
    }
  }

  return {}
}
