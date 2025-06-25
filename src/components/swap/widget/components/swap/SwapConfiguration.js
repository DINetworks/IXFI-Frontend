import {
  getTokenImage,
  useAvatar,
  useConfigStore,
  useDepositAddress,
  useEstimatePriceImpact,
  useIntegratorContext,
  useMultiChainBalance,
  useMultiChainWallet,
  useSquid,
  useSwap
} from 'src/components/swap/widget/react-hooks'
import React, { useMemo } from 'react'
import { SwapConfiguration as UISwapConfiguration } from '@0xsquid/ui'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../../core/constants'
import { routes } from '../../core/routes'
import { useSwapRoute } from '../../hooks/useSwapRoute'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { defaultAssetsColors, getEnsAvatar } from '../../services/internal/assetsService'
import { formatDisplayNumber } from 'src/components/utils/uniswap'

export const SwapConfiguration = ({
  direction,
  selectedToken,
  selectedChain,
  price,
  tokenBasePrice,
  isLoadingPrice = false,
  onPriceChange,
  error,
  amountUsd,
  isConnectedOnSource
}) => {
  const config = useConfigStore(state => state.config)
  const isInitialized = useConfigStore(state => state.isInitialized)
  const { squidRoute } = useSwapRoute()
  const { switchRoute } = useSwapRouter()
  const { walletHandledExternally } = useIntegratorContext()
  const { destinationAddress, toChain, fromChain, isDestAddressConnected } = useSwap()
  const { isAvailableAsPaymentMethod: isDepositAddressAvailableAsPaymentMethod, isEnabled: isDepositAddressEnabled } =
    useDepositAddress()
  const { networkConnected, connectedAddress, wallet: connectedWallet } = useMultiChainWallet(selectedChain)
  const { balance } = useMultiChainBalance({
    chain: selectedChain,
    token: selectedToken,
    userAddress: direction === 'from' ? connectedAddress.address : destinationAddress.address
  })
  const { priceImpact, priceImpactStatus } = useEstimatePriceImpact({
    squidRoute: squidRoute.data
  })

  const onAmountChange = value => {
    if (onPriceChange) onPriceChange(value)
  }

  const onWalletButtonClick = () => {
    if (direction === 'from') {
      if (isDepositAddressAvailableAsPaymentMethod) {
        switchRoute(routes.paymentMethod)
        return
      }
      if (walletHandledExternally) return
      switchRoute(routes.wallets, {
        chainId: fromChain?.chainId
      })
    } else if (direction === 'to' && !!toChain) {
      switchRoute(routes.destination)
    }
  }

  const onAssetsButtonClick = () => {
    switchRoute(routes.allTokens, { direction })
  }

  const { maintenanceMode } = useSquid()

  function getAddressLabel() {
    if (direction === 'from') {
      if (isDepositAddressEnabled && isDepositAddressAvailableAsPaymentMethod) {
        return 'Deposit'
      }
      if (!networkConnected) {
        return undefined
      }
      return connectedAddress.ens?.name ?? connectedAddress.formatted
    }
    if (networkConnected || !!destinationAddress.address || !!destinationAddress.ens?.name) {
      return destinationAddress.ens?.name || destinationAddress.formatted
    }
    return undefined
  }

  const chain =
    selectedChain && !maintenanceMode?.active
      ? {
          bgColor: selectedChain.bgColor || defaultAssetsColors.chainBg,
          iconUrl: selectedChain?.chainIconURI ?? ''
        }
      : undefined

  const token =
    selectedToken && !maintenanceMode?.active
      ? {
          bgColor: selectedToken.bgColor || defaultAssetsColors.tokenBg,
          iconUrl: getTokenImage(selectedToken) ?? '',
          symbol: selectedToken?.symbol,
          textColor: selectedToken.textColor || defaultAssetsColors.tokenText,
          decimals: selectedToken?.decimals
        }
      : undefined

  const priceImpactPercentage = priceImpactStatus === undefined ? undefined : priceImpact

  const amountFormatted = useMemo(() => {
    if (!price || Number(price) === 0) return ''
    if (direction === 'from') return String(price)

    return formatDisplayNumber(price, { significantDigits: 8 })
  }, [price])

  const getWalletButtonClickHandler = () => {
    if (direction === 'from' && !!fromChain) return onWalletButtonClick
    if (direction === 'to' && !!toChain) return onWalletButtonClick
    return undefined
  }

  const getWalletIconUrl = () => {
    if (direction === 'from') {
      return connectedWallet?.icon
    }
    if (!destinationAddress.address) {
      return null
    }
    return isDestAddressConnected
      ? connectedWallet?.icon
      : getEnsAvatar(destinationAddress) || destAddressFallbackAvatar
  }

  const destAddressFallbackAvatar = useAvatar(destinationAddress.address)
  const walletIconUrl = getWalletIconUrl()
  const addressLabel = getAddressLabel()

  const sourceOnlyTooltips = useMemo(() => {
    if (direction !== 'from') return {}
    return {
      tokenModeTooltip: {
        tooltipContent: 'Enter in USD',
        displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
      },
      usdModeTooltip: {
        tooltipContent: 'Enter token amount',
        displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
      }
    }
  }, [direction])

  const balanceButton = useMemo(() => {
    if (direction === 'from' && Number(balance) > 0) {
      return {
        tooltip: {
          tooltipContent: 'Max swap',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }
      }
    }
    return {
      hideMaxChip: true
    }
  }, [direction, balance])

  const walletButtonTooltip = useMemo(() => {
    if (direction === 'from' && walletHandledExternally) return undefined
    return {
      tooltipContent: direction === 'from' ? 'Select payment method' : 'Select recipient',
      displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
    }
  }, [direction, walletHandledExternally])

  return (
    <UISwapConfiguration
      direction={direction}
      tokenPrice={tokenBasePrice}
      chain={chain}
      token={token}
      walletButton={{
        address: addressLabel,
        emptyAddressLabel: isDepositAddressAvailableAsPaymentMethod && direction === 'from' ? undefined : undefined,
        onClick: direction === 'from' && walletHandledExternally ? undefined : getWalletButtonClickHandler(),
        disabled: !isInitialized || !selectedChain,
        tooltip: walletButtonTooltip,
        walletIconUrl,
        showIcon: true
      }}
      amount={amountFormatted}
      balance={balance}
      error={error}
      isFetching={isLoadingPrice}
      isLoading={!isInitialized}
      onAmountChange={newAmount => onAmountChange(newAmount)}
      showWalletButtonHeader={isInitialized && !!selectedChain}
      assetsButton={{
        onClick: onAssetsButtonClick,
        variant: getAssetsButtonVariant(
          isInitialized,
          isConnectedOnSource || networkConnected,
          maintenanceMode?.active
        ),
        tooltip: {
          tooltipContent: 'Select chain and token',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }
      }}
      priceImpactPercentage={priceImpactPercentage}
      inputModeButton={{
        amountUsd,
        tokenModeTooltip: sourceOnlyTooltips.tokenModeTooltip,
        usdModeTooltip: sourceOnlyTooltips.usdModeTooltip
      }}
      balanceButton={balanceButton}
      criticalPriceImpactPercentage={config.priceImpactWarnings?.critical}
      maxUsdDecimals={2}
      isInputInteractive={direction === 'from' && isInitialized}
    />
  )
}

const getAssetsButtonVariant = (isInitialized = false, networkConnected = false, isMaintenanceModeActive = false) => {
  if (!isInitialized || !networkConnected || isMaintenanceModeActive) {
    return 'primary'
  }
  return 'accent'
}
