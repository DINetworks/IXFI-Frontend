import {
  formatUsdAmount,
  useAllConnectedWalletBalances,
  useConfigStore,
  useEstimate,
  useEstimatePriceImpact,
  useMultiChainBalance,
  useMultiChainWallet,
  useNativeTokenForChain,
  useSingleTokenPrice,
  useSquid,
  useSwap,
  useTransactionStore,
  useWallet,
  useXrplTrustLine
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { DetailsToolbar } from '@0xsquid/ui'
import { useMemo } from 'react'
import { SubmitSwapBtn } from '../components/swap/SubmitSwapBtn'
import { SwapConfiguration } from '../components/swap/SwapConfiguration'
import { getSwapError } from '../components/swap/SwapWarning'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../core/constants'
import { routes } from '../core/routes'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { getActionProviderImage } from '../services/internal/assetsService'

import { Points } from '../components/swap/Points'
import { formatUnits } from 'viem'

export const SwapView = () => {
  const {
    fromPrice,
    fromPriceChanged,
    invertSwaps,
    fromChain,
    toChain,
    fromToken,
    toToken,
    destinationAddress,
    isDestAddressConnected
  } = useSwap()

  const { switchRoute } = useSwapRouter()
  const { squidRoute, isFetching: isFetchingEstimate } = useSwapRoute()
  const { priceImpactStatus } = useEstimatePriceImpact({
    squidRoute: squidRoute.data
  })

  // Initiate getting balances in the background
  // Source is always defined on load, so try to get balances there first
  useAllConnectedWalletBalances({
    direction: 'from'
  })

  const squidRouteError = squidRoute.error
  const {
    toAmount,
    toAmountUSD,
    swapAmountExceedsLimit,
    minAmountValueWarnMsg,
    totalWithRefundEstimate,
    isFromTokenNative,
    fromAmount,
    sourceChainNativeToken,
    estimatedRouteDuration,
    fromBalanceEnoughToSwap: isNativeBalanceEnoughToPayFees,
    totalFeesInNativeTokenPlusRatio
  } = useEstimate(squidRoute.data)

  const isInitialized = useConfigStore(store => store.isInitialized)
  const degenMode = useConfigStore(({ config }) => config.degenMode)

  const toAmountBn = useMemo(() => {
    return BigInt(squidRoute.data?.estimate.toAmount ?? 0)
  }, [squidRoute.data?.estimate.toAmount])

  const { isTrustLineApproved, accountActivatedInfo } = useXrplTrustLine({
    address: destinationAddress?.address,
    chain: toChain,
    token: toToken,
    amount: toAmountBn
  })

  const { nativeToken: destChainNativeToken } = useNativeTokenForChain(toChain)
  const { isChainTypeConnected } = useWallet()
  const {
    connectedAddress: { address: connectedAddress }
  } = useMultiChainWallet(fromChain)

  const { balance: fromBalance } = useMultiChainBalance({
    chain: fromChain,
    token: fromToken,
    userAddress: connectedAddress
  })

  const fromBalanceEnoughToSwap = useMemo(() => {
    const fromBalanceFormatted = Number(fromBalance ?? 0)
    const fromPriceFormatted = Number(fromPrice ?? 0)
    return fromBalanceFormatted >= fromPriceFormatted
  }, [fromBalance, fromPrice])

  const isConnectedOnSource = fromChain?.chainType ? isChainTypeConnected(fromChain.chainType) : false

  const { toolbarError, swapConfigError, showFitGasButton } = getSwapError({
    priceImpactStatus,
    fromAmount,
    minAmountValueWarnMsg,
    isNativeBalanceEnoughToPayFees,
    isFromTokenNative,
    squidRouteError,
    sourceChainNativeToken,
    destChainNativeToken,
    swapAmountExceedsLimit,
    fromBalanceEnoughToSwap,
    fromToken,
    isFetchingEstimate,
    isConnectedOnSource,
    totalFeesInNativeTokenPlusRatio,
    isDestinationAddressSet: !!destinationAddress,
    isDestinationAddressConnected: isDestAddressConnected,
    destinationAddress: destinationAddress?.address,
    accountActivatedInfoQuery: accountActivatedInfo,
    isTrustLineApprovedQuery: isTrustLineApproved,
    toChain,
    toToken,
    degenMode
  })

  const fitGasButton = useMemo(() => {
    return {
      label: 'Fit gas',
      onClick: () => {
        useTransactionStore.setState({
          fromPrice: minAmountValueWarnMsg
        })
      }
    }
  }, [minAmountValueWarnMsg])

  const isFlipButtonDisabled = !fromToken || !toToken
  const { tokenPrice: fromBasePrice } = useSingleTokenPrice(fromToken)
  const { tokenPrice: toBasePrice } = useSingleTokenPrice(toToken)
  const { maintenanceMode } = useSquid()

  const fromAmountUsd = Number(formatUnits(fromAmount ?? '0', fromToken?.decimals)) * Number(fromBasePrice ?? 0)

  return (
    <>
      <SwapConfiguration
        direction='from'
        onPriceChange={d => fromPriceChanged(d)}
        price={fromPrice}
        selectedToken={fromToken}
        selectedChain={fromChain}
        tokenBasePrice={fromBasePrice ?? fromToken?.usdPrice}
        error={swapConfigError ? { message: swapConfigError } : undefined}
        isConnectedOnSource={isConnectedOnSource}
      />

      <DetailsToolbar
        errorMessage={toolbarError}
        isLoading={isFetchingEstimate || !isInitialized}
        stopsButton={{
          providers:
            squidRoute.data?.estimate.actions.map(action => ({
              logoUrl: getActionProviderImage(action),
              key: action.description + action.priceImpact + action.exchangeRate
            })) ?? [],
          onClick: () => {
            switchRoute(routes.stops)
          },
          estimatedTime: estimatedRouteDuration.format(),
          stopsCount: squidRoute.data?.estimate.actions.length ?? 0,
          tooltip: {
            tooltipContent: 'View route preview',
            displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
          }
        }}
        isEmpty={!squidRoute.data || maintenanceMode?.active}
        flipButton={{
          tooltip: {
            tooltipContent: isFlipButtonDisabled ? 'Select tokens to flip the swap' : 'Flip tokens',
            displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
          },
          isDisabled: isFlipButtonDisabled,
          onClick: invertSwaps
        }}
        feeButton={{
          onClick: () => {
            switchRoute(routes.swapDetails)
          },
          feeInUsd: formatUsdAmount(totalWithRefundEstimate.totalAmountUSD, {
            includeSign: false
          }),
          tooltip: {
            tooltipContent: 'View fee breakdown',
            displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
          }
        }}
        helpButton={showFitGasButton ? fitGasButton : undefined}
      />

      <Points wallet={connectedAddress} amountUsd={fromAmountUsd} />

      <SwapConfiguration
        direction='to'
        price={toAmount}
        amountUsd={toAmountUSD}
        tokenBasePrice={toBasePrice ?? toToken?.usdPrice}
        selectedToken={toToken}
        selectedChain={toChain}
        isLoadingPrice={isFetchingEstimate}
        isConnectedOnSource={isConnectedOnSource}
      />

      <div className='tw-px-squid-m tw-pb-squid-m tw-h-full tw-max-h-[80px]'>
        <SubmitSwapBtn />
      </div>
    </>
  )
}
