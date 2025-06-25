import { SwapProvider } from 'src/components/swap/widget/react-hooks'
import React, { useEffect, useMemo } from 'react'

import '@0xsquid/ui/dist/index.css'
import { App, AppContainer, AppSkeleton } from './components/App'
import { useSwapLabelsStore, useSwapThemeStore } from './store/useSwapStore'

const SwapWidget = ({ config, className, useExternalSquidProvider = false, advancedUi }) => {
  useEffect(() => {
    // Temporary, in the future, the mobile view will have the bottom tab and won't need extra custom padding
    useSwapThemeStore.setState({
      headerPaddingRight: advancedUi?.headerPaddingRight
    })

    // Gives control over the labels
    if (advancedUi?.labels) {
      useSwapLabelsStore.setState({
        labels: advancedUi.labels
      })
    }
  }, [advancedUi?.headerPaddingRight, advancedUi?.labels])

  // memoize hooks-specific config to avoid re-initializing hooks provider
  // when config.theme changes
  // TODO: there might be a cleaner way to do this
  const hooksConfig = useMemo(() => {
    return {
      integratorId: config.integratorId,
      apiUrl: config.apiUrl,
      availableChains: config.availableChains,
      initialAssets: config.initialAssets,
      degenMode: config.degenMode,
      collectFees: config.collectFees,
      loadPreviousStateFromLocalStorage: config.loadPreviousStateFromLocalStorage,
      defaultTokensPerChain: config.defaultTokensPerChain,
      disabledChains: config.disabledChains,
      enableGetGasOnDestination: config.enableGetGasOnDestination,
      preferDex: config.preferDex,
      priceImpactWarnings: config.priceImpactWarnings,
      slippage: config.slippage,
      tabs: config.tabs,
      preHook: config.preHook,
      postHook: config.postHook
    }
  }, [
    config.integratorId,
    config.apiUrl,
    config.availableChains,
    config.initialAssets,
    config.degenMode,
    config.collectFees,
    config.loadPreviousStateFromLocalStorage,
    config.defaultTokensPerChain,
    config.disabledChains,
    config.enableGetGasOnDestination,
    config.preferDex,
    config.priceImpactWarnings,
    config.slippage,
    config.tabs,
    config.preHook,
    config.postHook
  ])

  const content = (
    <AppContainer config={config} className={className}>
      <App config={config} />
    </AppContainer>
  )

  if (useExternalSquidProvider) {
    return content
  }

  return (
    <SwapProvider
      placeholder={
        <AppContainer config={config} className={className}>
          <AppSkeleton config={config} />
        </AppContainer>
      }
      config={hooksConfig}
    >
      {content}
    </SwapProvider>
  )
}

export default SwapWidget
