import {
  isWalletAddressValid,
  nativeEvmTokenAddress,
  useApproval,
  useConfigStore,
  useDepositAddress,
  useEstimate,
  useEstimatePriceImpact,
  useExecuteTransaction,
  useGnosisContext,
  useMultiChainBalance,
  useMultiChainWallet,
  useRouteWarnings,
  useSquid,
  useSwap,
  useSwapRoutePersistStore
} from 'src/components/swap/widget/react-hooks'
import React, { useCallback, useMemo } from 'react'
import { ChainType } from '@0xsquid/squid-types'
import { Button } from '@0xsquid/ui'
import { maxPriceImpact } from '../../core/constants'
import { routes } from '../../core/routes'
import { useLabels } from '../../hooks/useLabels'
import { useSwapRoute } from '../../hooks/useSwapRoute'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { useXrplConditions } from '../../hooks/useXrplConditions'
import { AnalyticsService } from '../../services/external/analyticsService'

export const SubmitSwapBtn = () => {
  const { squidRoute } = useSwapRoute()
  const isInitialized = useConfigStore(store => store.isInitialized)
  const isLoading = !isInitialized
  const { fromChain, fromToken, destinationAddress, fromPrice, toToken, toChain, isDestAddressConnected } = useSwap()
  const { routeData } = useSwapRoute()
  const { executeSwap } = useExecuteTransaction(routeData)
  const { maintenanceMode } = useSquid()
  const degenMode = useConfigStore(({ config }) => config.degenMode)
  const { labels } = useLabels()
  const { needsFallbackAddress } = useRouteWarnings()
  const { routeApproved, approveRoute } = useApproval({
    squidRoute: squidRoute.data
  })

  const { switchRoute } = useSwapRouter()

  const {
    connectedAddress: { address: connectedAddress },
    checkNetworkAndSwitch,
    networkConnected: isConnectedOnSource,
    wallet
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

  const isFetchingEstimate = squidRoute.isFetching

  const {
    isAvailableAsPaymentMethod: isDepositAddressAvailableAsPaymentMethod,
    isEnabled: isDepositAddressEnabled,
    swapWillGenerateDepositAddress,
    getRouteWithDeposit
  } = useDepositAddress(squidRoute.data)

  const depositRefundAddress = useSwapRoutePersistStore(store => store.swapRoute?.depositRefundAddress)

  const {
    swapAmountExceedsLimit,
    fromAmount,
    fromBalanceEnoughToSwap: isNativeBalanceEnoughToPayFees,
    sourceChainNativeToken,
    toAmountMin
  } = useEstimate(squidRoute.data)

  const { priceImpact, priceImpactStatus } = useEstimatePriceImpact({
    squidRoute: squidRoute.data
  })

  const buttonId = 'squid-submit-swap-btn'
  const { isGnosisContext, gnosisSafeInfo } = useGnosisContext()
  const isFromChainEVM = fromChain?.chainType === ChainType.EVM
  const isFromTokenNativeEVM = fromToken?.address.toLowerCase() === nativeEvmTokenAddress
  const depositParamsDefined = !!squidRoute.data && !!fromPrice

  const { buttonState: xrplButtonState } = useXrplConditions({
    destinationAddress: destinationAddress?.address,
    chain: toChain,
    token: toToken,
    amount: toAmountMin,
    isDestAddressConnected
  })

  const handleSubmitSwap = useCallback(async () => {
    AnalyticsService.submitButtonPushed()
    const swapAndNavigate = () => {
      executeSwap()
      switchRoute(wallet?.isQrWallet ? routes.signSwapTransactionQr : routes.transaction)
    }

    if ((swapWillGenerateDepositAddress || isDepositAddressEnabled) && depositParamsDefined) {
      await getRouteWithDeposit.mutateAsync({
        route: squidRoute.data
      })
      if (isDepositAddressEnabled) {
        switchRoute(routes.depositAddress)
      } else {
        swapAndNavigate()
      }
    } else {
      const rightChain = await checkNetworkAndSwitch()
      if (rightChain) {
        swapAndNavigate()
      }
    }
  }, [
    checkNetworkAndSwitch,
    switchRoute,
    swapWillGenerateDepositAddress,
    isDepositAddressEnabled,
    depositParamsDefined,
    getRouteWithDeposit.mutateAsync,
    squidRoute.data,
    wallet?.isQrWallet,
    executeSwap
  ])

  const handleApproval = useCallback(async () => {
    const rightChain = await checkNetworkAndSwitch()
    if (rightChain) {
      approveRoute.mutate()
      AnalyticsService.givePermissionToUseTokenButton()
    }
  }, [checkNetworkAndSwitch, approveRoute.mutate])

  const { label, onClick, disabled, showLoader } = useMemo(() => {
    if (maintenanceMode?.active) {
      return {
        label: 'Squid offline',
        disabled: true
      }
    }
    if (isDepositAddressEnabled && getRouteWithDeposit.isLoading) {
      return {
        label: 'Opening deposit...',
        disabled: true,
        showLoader: true
      }
    }
    if (isFetchingEstimate) {
      return {
        label: 'Getting quotes...',
        disabled: true
      }
    }
    const axiosError = squidRoute.error
    const squidError = axiosError?.response?.data
    if (squidError) {
      return {
        label: 'Swap unavailable',
        disabled: true
      }
    }
    const atLeastOnePaymentMethodIsSelected = isDepositAddressEnabled || isConnectedOnSource
    if (isDepositAddressAvailableAsPaymentMethod && !atLeastOnePaymentMethodIsSelected) {
      return {
        label: 'Connect',
        onClick: () => {
          switchRoute(routes.paymentMethod)
        },
        disabled: false
      }
    }
    const isMissingSwapParams = !fromToken || !toToken || !fromChain || !toChain || !sourceChainNativeToken
    const isValidFromAmount = fromAmount != null && +fromAmount >= 0
    const isMissingDestinationAddress = !destinationAddress.address
    if (isDepositAddressEnabled && isDepositAddressAvailableAsPaymentMethod) {
      if (isMissingSwapParams) {
        return {
          disabled: true,
          label: 'Select tokens'
        }
      }
      if (!isValidFromAmount) {
        return {
          disabled: true,
          label: 'Enter amount'
        }
      }
      if (isMissingDestinationAddress) {
        return {
          disabled: false,
          label: 'Add recipient',
          onClick: () => {
            switchRoute(routes.destination)
          }
        }
      }
      const isValidDepositRefundAddress = isWalletAddressValid(fromChain, depositRefundAddress)
      if (!isValidDepositRefundAddress) {
        return {
          label: `Add ${fromChain.networkName} refund address`,
          disabled: false,
          onClick: () => {
            switchRoute(routes.paymentMethod)
          }
        }
      }
      return {
        label: `Deposit ${fromToken.symbol}`,
        disabled: false,
        onClick: () => {
          handleSubmitSwap()
        }
      }
    }
    if (!connectedAddress) {
      return {
        label: 'Connect',
        onClick: () => {
          switchRoute(routes.wallets, {
            chainId: fromChain?.chainId
          })
        },
        disabled: false
      }
    }
    if (isMissingSwapParams) {
      return {
        label: 'Select tokens',
        disabled: true
      }
    }
    if (isMissingDestinationAddress) {
      return {
        label: 'Add recipient',
        onClick: () => {
          switchRoute(routes.destination)
        },
        disabled: false
      }
    }
    if (!fromBalanceEnoughToSwap) {
      return {
        label: 'Insufficient balance',
        disabled: true
      }
    }
    if (!isNativeBalanceEnoughToPayFees) {
      return {
        label: `Not enough ${sourceChainNativeToken.symbol} for gas`,
        disabled: true
      }
    }
    if (!isValidFromAmount) {
      return {
        label: 'Enter amount',
        disabled: true
      }
    }
    if (routeApproved.isLoading) {
      return {
        label: 'Checking approval...',
        disabled: true
      }
    }
    if (approveRoute.isLoading) {
      return {
        label: 'Approving...',
        disabled: true
      }
    }
    if (getRouteWithDeposit.isLoading) {
      return {
        label: 'Preparing swap...',
        disabled: true,
        showLoader: true
      }
    }
    if (xrplButtonState.shouldBlock) {
      return {
        ...xrplButtonState,
        label: xrplButtonState.label ?? 'Account not activated'
      }
    }
    if (isGnosisContext && Number(fromChain.chainId) !== gnosisSafeInfo?.chainId) {
      return {
        disabled: true,
        label: 'Not on the right Safe chain'
      }
    }
    if (isFromChainEVM && routeApproved.data === false && !isFromTokenNativeEVM) {
      return {
        label: 'Give permission to use tokens',
        onClick: handleApproval,
        disabled: false
      }
    }
    if (swapAmountExceedsLimit) {
      return {
        label: 'Swap amount exceeds limit',
        disabled: true
      }
    }
    if (+(priceImpact ?? '0') > maxPriceImpact) {
      return {
        label: 'Price impact too high',
        disabled: true
      }
    }
    if (priceImpactStatus === 'critical') {
      if (degenMode) {
        return {
          label: labels.submitSwapButton.swap,
          onClick: handleSubmitSwap,
          disabled: false
        }
      }
      return {
        label: 'Price impact too high',
        disabled: true
      }
    }
    if (priceImpactStatus === 'warning') {
      return {
        label: degenMode ? labels.submitSwapButton.swap : labels.submitSwapButton.swapAnyway,
        onClick: handleSubmitSwap,
        disabled: false
      }
    }
    if (needsFallbackAddress) {
      return {
        label: 'Add fallback address',
        onClick: () => {
          switchRoute(routes.destination)
        },
        disabled: false
      }
    }

    return {
      label: labels.submitSwapButton.swap,
      onClick: handleSubmitSwap,
      disabled: false
    }
  }, [
    connectedAddress,
    destinationAddress,
    fromToken,
    toToken,
    fromChain,
    toChain,
    priceImpactStatus,
    isNativeBalanceEnoughToPayFees,
    sourceChainNativeToken,
    fromBalanceEnoughToSwap,
    isFetchingEstimate,
    fromAmount,
    approveRoute,
    isFromChainEVM,
    routeApproved,
    isFromTokenNativeEVM,
    swapAmountExceedsLimit,
    priceImpact,
    squidRoute,
    switchRoute,
    handleSubmitSwap,
    handleApproval,
    maintenanceMode?.active,
    degenMode,
    isGnosisContext,
    gnosisSafeInfo?.chainId,
    labels.submitSwapButton.swap,
    labels.submitSwapButton.swapAnyway,
    isDepositAddressAvailableAsPaymentMethod,
    isDepositAddressEnabled,
    isConnectedOnSource,
    depositRefundAddress,
    getRouteWithDeposit.isLoading,
    needsFallbackAddress,
    xrplButtonState
  ])

  return (
    <Button
      variant={isLoading ? 'tertiary' : 'primary'}
      size='lg'
      label={label}
      id={buttonId}
      disabled={disabled}
      onClick={onClick}
      isLoading={isLoading}
      showLoader={showLoader}
    />
  )
}
