import { ChainType } from '@0xsquid/squid-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { CHAIN_IDS, chainTypeToZeroAddressMap } from '../../core/constants'
import { useCosmosContext } from '../../core/providers/CosmosProvider'
import { keys } from '../../core/queries/queries-keys'
import { WidgetEvents, createQuoteRequestParamsHash } from '../../services/internal/eventService'
import { parseToBigInt } from '../../services/internal/numberService'
import { useConfigStore, useSwapStore, useSwapRoutePersistStore } from '../store/useSwapStore'
import { useDepositAddress } from '../swap/useDepositAddress'
import { useSwap } from '../swap/useSwap'
import { useMultiChainWallet } from '../wallet/useMultiChainWallet'

export const useGetRoute = () => {
  const { getCosmosAddressForChain, isConnected: isCosmosConnected } = useCosmosContext()
  const config = useConfigStore(state => state.config)
  const squid = useSwapStore(state => state.squid)
  const { swapRoute } = useSwapRoutePersistStore()
  const queryClient = useQueryClient()
  const previousParamsHashRef = useRef()

  /**
   * Dispatch event when requesting a quote for swap
   */
  const dispatchRequestQuoteEvent = useCallback(params => {
    const currentParamsHash = createQuoteRequestParamsHash(params)
    // Only dispatch if any parameter has changed
    if (previousParamsHashRef.current !== currentParamsHash) {
      previousParamsHashRef.current = currentParamsHash
      WidgetEvents.getInstance().dispatchRequestQuote(params)
    }
  }, [])

  /**
   * Get fallback addresses for cosmos chains.
   * First try to get the fallback address added manually by the user (if any).
   * If not set, try to get the derived osmo address.
   *
   * This is needed by backend when a cosmos swap occurs between non coin118 chains
   * The backend might need a coin118 address to send the funds to in case of failure for a swap happening between the two chains
   */
  const getCosmosFallbackAddresses = useCallback(async () => {
    if (swapRoute?.fallbackAddress) {
      return [
        {
          address: swapRoute?.fallbackAddress,
          coinType: 118
        }
      ]
    }

    // There's no fallback address manually added and the user is not connected
    if (!isCosmosConnected) {
      return undefined
    }
    // the user is connected to cosmos, we can get the fallback address from the wallet
    // We only need coin118, so taking osmosis hub address by default
    const osmosisAddress = await getCosmosAddressForChain(CHAIN_IDS.OSMOSIS)
    if (osmosisAddress) {
      return [
        {
          address: osmosisAddress,
          coinType: 118
        }
      ]
    }
  }, [getCosmosAddressForChain, isCosmosConnected, swapRoute?.fallbackAddress])

  /**
   * Fetching route data from the API
   * These data will be used to trigger the transaction
   * @returns {Route} Route data
   */
  return useMutation({
    mutationFn: async ({
      fromChain,
      toChain,
      fromToken,
      toToken,
      sourceUserAddress,
      destinationAddress,
      fromPrice,
      bypassGuardrails,
      quoteOnly,
      fromChainType,
      postHook,
      preHook
    }) => {
      if (!fromChain || !toChain || !fromToken || !toToken || !fromPrice) {
        return undefined
      }
      // Dispatch requestQuote event
      dispatchRequestQuoteEvent({
        fromChain,
        toChain,
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromAmount: fromPrice,
        fromAddress: sourceUserAddress,
        toAddress: destinationAddress
      })

      const isEvmSwap = Number(fromChain) > 0 && Number(toChain) > 0
      const cosmosFallbackAddresses = quoteOnly || isEvmSwap ? undefined : await getCosmosFallbackAddresses()
      const fromTokenAddress = fromToken.address
      const toTokenAddress = toToken.address
      const fromAmount = parseToBigInt(fromPrice?.toString() ?? '0', fromToken?.decimals).toString()
      const fromAddress = sourceUserAddress ?? chainTypeToZeroAddressMap[fromChainType ?? ChainType.EVM]
      const params = {
        fromChain,
        fromToken: fromTokenAddress,
        fromAddress,
        fromAmount,
        toChain,
        toToken: toTokenAddress,
        toAddress: destinationAddress ?? '',
        quoteOnly,
        slippage: config.slippage === 0 ? undefined : config.slippage,
        bypassGuardrails,
        preHook,
        postHook
      }

      // If the swap is involving cosmos chains, we need to add the fallback addresses (if any)
      if (cosmosFallbackAddresses && cosmosFallbackAddresses.length > 0 && cosmosFallbackAddresses[0].address) {
        params.fallbackAddresses = cosmosFallbackAddresses
      }

      const { route } = await squid.getRoute({
        ...params
      })

      // Cache the route data
      // Useful when the getRoute mutation is called from another hook
      queryClient.setQueryData(
        keys().transaction(
          fromChain,
          toChain,
          toToken.address,
          fromToken.address,
          fromPrice,
          config.slippage,
          config.enableGetGasOnDestination,
          sourceUserAddress,
          config.degenMode,
          destinationAddress,
          swapRoute?.fallbackAddress,
          quoteOnly,
          fromChainType,
          config.preHook,
          config.postHook
        ),
        route
      )
      return route
    }
  })
}

// TODO: this is a bit dangerous to base the type on the useQuery function indexing
//  as it could change in the future
// type UseQueryOptionsType = Parameters<typeof useQuery>[2];
export const useGetRouteWrapper = ({
  enabled,
  cacheTime = 5 * 60 * 1000, // 5 minutes
  staleTime = 60 * 1000, // 1 minute
  refetchOnWindowFocus = query => Date.now() - query.state.dataUpdatedAt > 30000, // Update if older than 30 seconds, when window is focused
  refetchIntervalInBackground = false,
  refetchInterval = 30000,
  quoteOnly = true
}) => {
  const config = useConfigStore(state => state.config)
  const squid = useSwapStore(state => state.squid)
  const fallbackAddress = useSwapRoutePersistStore(store => store.swapRoute?.fallbackAddress)
  const depositRefundAddress = useSwapRoutePersistStore(store => store.swapRoute?.depositRefundAddress)
  const { isAvailableAsPaymentMethod, isEnabled: isDepositAddressEnabled } = useDepositAddress()
  const getRouteMutation = useGetRoute()

  const {
    fromChain,
    toChain,
    fromPrice,
    destinationAddress: { address: destinationAddress } = {},
    fromToken,
    toToken
  } = useSwap()

  const {
    connectedAddress: { address: sourceConnectedAddress }
  } = useMultiChainWallet(fromChain)

  // When the payment method is deposit address, users can specify a refund address on the source chain
  // Tokens will be sent to this address in case of swap failure
  //
  // If deposit address is not selected, we use the connected address as the source address instead
  const sourceUserAddress =
    isDepositAddressEnabled && isAvailableAsPaymentMethod
      ? depositRefundAddress ?? sourceConnectedAddress
      : sourceConnectedAddress

  const squidRouteQueryKeys = useMemo(
    () =>
      keys().transaction(
        fromChain?.chainId,
        toChain?.chainId,
        toToken?.address,
        fromToken?.address,
        fromPrice,
        config.slippage,
        config.enableGetGasOnDestination,
        sourceUserAddress,
        config.degenMode,
        destinationAddress,
        fallbackAddress,
        quoteOnly,
        fromChain?.chainType,
        config.preHook,
        config.postHook
      ),
    [
      fromChain?.chainId,
      toChain?.chainId,
      toToken?.address,
      fromToken?.address,
      fromPrice,
      config.slippage,
      config.enableGetGasOnDestination,
      sourceUserAddress,
      config.degenMode,
      destinationAddress,
      fallbackAddress,
      quoteOnly,
      fromChain?.chainType,
      config.preHook,
      config.postHook
    ]
  )

  const queryEnabled =
    enabled != undefined
      ? enabled
      : squid !== undefined &&
        fromPrice !== undefined &&
        fromPrice !== '0' &&
        toChain?.chainId !== undefined &&
        toToken?.address !== undefined

  const queryClient = useQueryClient()
  const cachedRouteData = queryClient.getQueryData(squidRouteQueryKeys)

  /**
   * Fetching route data from the API
   * These data will be used to trigger the transaction
   * @returns {Route} Route data
   */
  const squidRoute = useQuery({
    queryKey: squidRouteQueryKeys,
    queryFn: async () => {
      const route = await getRouteMutation.mutateAsync({
        fromChain: fromChain?.chainId,
        toChain: toChain?.chainId,
        fromToken,
        toToken,
        sourceUserAddress,
        destinationAddress,
        fromPrice,
        bypassGuardrails: config.degenMode,
        quoteOnly,
        fromChainType: fromChain?.chainType,
        postHook: config.postHook,
        preHook: config.preHook
      })

      return route
    },
    enabled: queryEnabled,
    cacheTime,
    staleTime,
    refetchOnWindowFocus,
    refetchIntervalInBackground,
    refetchInterval
  })

  /**
   * If last updated data is older than X seconds and the query is currently loading, show loading indicator
   */
  const showLoading = useMemo(
    () => squidRoute.isFetching || squidRoute.isRefetching,
    [squidRoute.isFetching, squidRoute.isRefetching]
  )

  return {
    squidRoute,
    showLoading,
    squidRouteError: squidRoute.error,
    routeData: queryEnabled ? squidRoute.data : cachedRouteData
  }
}
