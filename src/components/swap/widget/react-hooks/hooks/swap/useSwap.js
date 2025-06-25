import { ChainType } from '@0xsquid/squid-types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { areSameAddress, formatHash } from '../../services'
import { useSquidChains } from '../chains/useSquidChains'
import { useConfigStore, useSwapRoutePersistStore, useTransactionStore } from '../store/useSwapStore'
import { useSquidTokens } from '../tokens/useSquidTokens'
import { getNewSwapParamsFromInput } from '../../services'
import {
  filterTokensForDestination,
  getFirstAvailableChainId,
  getInitialChainIdFromConfig,
  getInitialOrDefaultTokenAddressForChain,
  getTokensForChain
} from '../../services/internal/configService'
import { WidgetEvents } from '../../services/internal/eventService'
import { useEnsDataForAddress } from '../wallet/useEns'
import { useMultiChainWallet } from '../wallet/useMultiChainWallet'

export const useSwap = () => {
  const { initialAssets, defaultTokensPerChain, disabledChains } = useConfigStore(state => state.config)
  const fromPrice = useTransactionStore(state => state.fromPrice)
  const { swapRoute } = useSwapRoutePersistStore()
  const { tokens } = useSquidTokens()
  const queryClient = useQueryClient()
  const { chains, supportedDestinationChains, supportedSourceChains } = useSquidChains()
  const sourceChainId = useMemo(
    () =>
      swapRoute?.fromChainId ||
      (chains.find(c => c.chainId === initialAssets?.from?.chainId) && initialAssets?.from?.chainId),
    [swapRoute?.fromChainId, chains, initialAssets?.from?.chainId]
  )

  const destChainId = useMemo(
    () =>
      swapRoute?.toChainId ||
      (chains.find(c => c.chainId === initialAssets?.to?.chainId) && initialAssets?.to?.chainId),
    [swapRoute?.toChainId, chains, initialAssets?.to?.chainId]
  )

  const fromChain = useMemo(
    () => chains.find(c => c.chainId === swapRoute?.fromChainId),
    [swapRoute?.fromChainId, chains]
  )

  const toChain = useMemo(() => chains.find(c => c.chainId === swapRoute?.toChainId), [swapRoute?.toChainId, chains])

  const fromTokens = useMemo(() => getTokensForChain(tokens, sourceChainId), [tokens, sourceChainId])

  const fromToken = useMemo(
    () => fromTokens.find(t => t.address.toLowerCase() === swapRoute?.fromTokenAddress?.toLowerCase()),
    [fromTokens, swapRoute?.fromTokenAddress]
  )

  const toTokens = useMemo(
    () =>
      filterTokensForDestination({
        tokens: getTokensForChain(tokens, destChainId),
        selectedDestinationChain: toChain,
        selectedSourceToken: fromToken
      }),
    [destChainId, toChain, fromToken, tokens]
  )

  const toToken = useMemo(
    () => toTokens.find(t => t.address.toLowerCase() === swapRoute?.toTokenAddress?.toLowerCase()),
    [toTokens, swapRoute?.toTokenAddress]
  )
  const isSameChain = sourceChainId === destChainId
  const tokenItems = useMemo(() => ({ from: fromTokens, to: toTokens }), [fromTokens, toTokens])
  const { connectedAddress: connectedDestinationAddress } = useMultiChainWallet(toChain)
  const { connectedAddress: connectedSourceAddress } = useMultiChainWallet(fromChain)

  const destAddressData = swapRoute?.destinationAddress?.address
    ? swapRoute?.destinationAddress
    : connectedDestinationAddress

  const destAddressEnsData = useEnsDataForAddress({
    address: destAddressData.address,
    options: {
      // enabled only for EVM chains
      // and when there's no ENS data yet
      enabled: !destAddressData.ens?.name && toChain?.chainType === ChainType.EVM
    }
  })

  const destinationAddress = useMemo(() => {
    if (!toChain?.chainType) return {}
    return {
      ...destAddressData,
      ens: destAddressData.ens?.name ? destAddressData.ens : destAddressEnsData.data,
      formatted: formatHash({
        hash: destAddressData.address,
        chainType: toChain.chainType
      })
    }
  }, [destAddressData, destAddressEnsData.data, toChain?.chainType])

  const fromPriceChanged = useCallback(price => {
    useTransactionStore.setState({ fromPrice: price || undefined })
  }, [])

  /**
   * When user changes something from the SwapView
   */
  const onSwapChange = useCallback(
    inputSwapParams => {
      const newSwapParams = getNewSwapParamsFromInput({
        inputParams: inputSwapParams,
        initialSwapRoute: swapRoute,
        tokens,
        chains,
        config: {
          initialAssets,
          defaultTokensPerChain,
          disabledChains
        },
        queryClient,
        connectedSourceAddress: connectedSourceAddress.address
      })

      WidgetEvents.getInstance().dispatchSwapParamsChanged({
        fromChainId: String(newSwapParams.fromChainId),
        toChainId: String(newSwapParams.toChainId),
        fromTokenAddress: newSwapParams.fromTokenAddress,
        toTokenAddress: newSwapParams.toTokenAddress
      })

      useSwapRoutePersistStore.setState({
        swapRoute: newSwapParams
      })

      return newSwapParams
    },
    [
      chains,
      connectedSourceAddress.address,
      defaultTokensPerChain,
      disabledChains,
      initialAssets,
      queryClient,
      swapRoute,
      tokens
    ]
  )

  const invertSwaps = useCallback(() => {
    // Check if inversion is allowed based on chain configurations
    const isToChainDisabledOnSource = disabledChains?.source?.includes(String(destChainId))
    const isFromChainDisabledOnDestination = disabledChains?.destination?.includes(String(sourceChainId))

    if (isToChainDisabledOnSource || isFromChainDisabledOnDestination) return

    onSwapChange({
      fromChainId: destChainId,
      toChainId: sourceChainId,
      fromTokenAddress: swapRoute?.toTokenAddress,
      toTokenAddress: swapRoute?.fromTokenAddress
    })
  }, [destChainId, sourceChainId, onSwapChange, swapRoute?.toTokenAddress, swapRoute?.fromTokenAddress, disabledChains])

  /**
   * Init default chain ids and default token addresses
   * Based on config & available tokens
   */
  useEffect(() => {
    if (tokens.length > 0 && !useSwapRoutePersistStore.getState().swapRoute) {
      const defaultFromChainId = getFirstAvailableChainId(
        {
          disabledChains,
          initialAssets
        },
        'from',
        supportedSourceChains
      )

      const defaultToChainId = getInitialChainIdFromConfig({
        chains: supportedDestinationChains,
        config: {
          initialAssets,
          disabledChains
        },
        direction: 'to'
      })

      const fromTokenAddress = getInitialOrDefaultTokenAddressForChain({
        tokens,
        config: {
          initialAssets,
          defaultTokensPerChain,
          disabledChains
        },
        chainId: defaultFromChainId,
        direction: 'from'
      })

      const toTokenAddress = getInitialOrDefaultTokenAddressForChain({
        tokens,
        config: {
          initialAssets,
          defaultTokensPerChain,
          disabledChains
        },
        chainId: defaultToChainId,
        direction: 'to',
        excludeToken: {
          address: fromTokenAddress,
          chainId: defaultFromChainId
        }
      })

      useSwapRoutePersistStore.setState({
        swapRoute: {
          fromChainId: defaultFromChainId,
          toChainId: defaultToChainId,
          fromTokenAddress,
          toTokenAddress,
          destinationAddress: undefined
        }
      })
    }
  }, [supportedDestinationChains, supportedSourceChains, initialAssets, disabledChains, defaultTokensPerChain, tokens])

  const isDestAddressConnected = areSameAddress(connectedDestinationAddress.address, destinationAddress.address)

  return {
    tokenItems,
    onSwapChange,
    invertSwaps,
    fromPrice,
    fromPriceChanged,
    toToken,
    fromToken,
    fromChain,
    toChain,
    destinationAddress,
    isDestAddressConnected,
    isSameChain,
    fromTokens,
    toTokens
  }
}
