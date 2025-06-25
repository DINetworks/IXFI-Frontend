'use client'

import { Squid } from 'src/components/swap/widget/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mainnet } from 'viem/chains'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { squidApiBaseUrl } from '../core/externalLinks'
import { BitcoinProvider } from '../core/providers/BitcoinProvider'
import { CosmosProvider } from '../core/providers/CosmosProvider'
import { EvmProvider } from '../core/providers/EvmProvider'
import { SolanaProvider } from '../core/providers/SolanaProvider'
import { SuiProvider } from '../core/providers/SuiProvider'
import { XrplProvider } from '../core/providers/XrplProvider'
import { defaultOptions } from '../core/queries/react-query-config'
import { createWagmiConfig } from '../core/wagmiConfig'
import { useAssetsColorsStore } from '../hooks/store/useAssetsColorsStore'
import { useConfigStore, useSwapStore, useSwapRoutePersistStore } from '../hooks/store/useSwapStore'
import { fetchAssetsColors, initializeSquidWithAssetsColors, isEmptyObject } from '../services'
import { getConfigWithDefaults } from '../services/internal/configService'

const queryClient = new QueryClient({ defaultOptions })

const verifyIntegratorIdValidity = integratorId => {
  if (!integratorId) {
    throw new Error('Integrator ID is required')
  }
}

export const SwapProvider = ({ children, config, placeholder }) => {
  verifyIntegratorIdValidity(config.integratorId)
  const [wagmiConfig, setWagmiConfig] = useState()
  const sdkInitializedRef = useRef(false)

  const initializeSdk = useCallback(async () => {
    if (sdkInitializedRef.current) {
      return
    }
    sdkInitializedRef.current = true
    try {
      const squid = new Squid({
        integratorId: config.integratorId,
        baseUrl: config.apiUrl ?? squidApiBaseUrl
      })

      const [sdkInfoResponse, assetsColorsResponse] = await Promise.allSettled([squid.init(), fetchAssetsColors()])
      if (sdkInfoResponse.status === 'rejected') {
        throw sdkInfoResponse.reason
      }

      if (assetsColorsResponse.status === 'fulfilled') {
        useAssetsColorsStore.setState(assetsColorsResponse.value)
        initializeSquidWithAssetsColors(squid, assetsColorsResponse.value)
      }

      // reset swap route if specified in config
      // or if initial assets are provided
      const shouldResetSwapRouteStore =
        !config?.loadPreviousStateFromLocalStorage ||
        !isEmptyObject(config.initialAssets?.from) ||
        !isEmptyObject(config.initialAssets?.to)
      if (shouldResetSwapRouteStore) {
        useSwapRoutePersistStore.setState({
          swapRoute: undefined
        })
      }
      useSwapStore.setState(_ => ({
        squid,
        maintenanceMode: { active: false, message: undefined }
      }))
      const newWagmiConfig = createWagmiConfig(squid.chains)
      setWagmiConfig(newWagmiConfig)
      useConfigStore.setState({
        isInitialized: true,
        config: getConfigWithDefaults(config)
      })
    } catch (error) {
      const isAxios503Error = error.isAxiosError && error.response?.status === 503
      if (isAxios503Error) {
        const maintenanceMessage = error.response?.data?.message ?? undefined

        // Even with an error, we want wagmi to be defined so that we can display the maintenance mode layout
        // Create wagmi config with mainnet as fallback in maintenance mode
        const newWagmiConfig = createConfig({
          chains: [mainnet],
          connectors: [injected()],
          transports: {
            [mainnet.id]: http()
          }
        })
        setWagmiConfig(newWagmiConfig)
        useConfigStore.setState({
          isInitialized: false,
          config: getConfigWithDefaults(config)
        })
        useSwapStore.setState({
          squid: undefined,
          maintenanceMode: {
            active: true,
            message: maintenanceMessage
          }
        })
      } else {
        console.error('Error initializing SDK:', error)
      }
    }
  }, [config])

  useEffect(() => {
    initializeSdk()
  }, [initializeSdk])

  return wagmiConfig ? (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <EvmProvider>
          <XrplProvider>
            <SuiProvider>
              <SolanaProvider>
                <BitcoinProvider>
                  <CosmosProvider>{children}</CosmosProvider>
                </BitcoinProvider>
              </SolanaProvider>
            </SuiProvider>
          </XrplProvider>
        </EvmProvider>
      </QueryClientProvider>
    </WagmiProvider>
  ) : (
    placeholder
  )
}
