import {
  isCoralBridgeAction,
  useDepositAddress,
  useGetRouteWrapper,
  useMultiChainWallet,
  useSwap
} from 'src/components/swap/widget/react-hooks'
import { useMemo } from 'react'
import { DEFAULT_ROUTE_REFETCH_INTERVAL } from '../core/constants'
import { routes } from '../core/routes'
import { getRouteExpiry } from '../services/internal/transactionService'
import { useSwapRouterStore } from '../store/useSwapStore'
import { useSwapRouter } from './useSwapRouter'

export const useSwapRoute = () => {
  const {
    fromToken,
    toToken,
    fromPrice,
    fromChain,
    toChain,
    destinationAddress: { address: destinationAddress } = {}
  } = useSwap()
  const modalRoute = useSwapRouterStore(state => state.modalRoute)
  const { currentRoute } = useSwapRouter()
  const { isEnabled: isDepositAddressEnabled } = useDepositAddress()
  const {
    connectedAddress: { address: sourceUserAddress }
  } = useMultiChainWallet(fromChain)
  const isMissingSourceOrDestAddress = !sourceUserAddress || !destinationAddress

  const quoteOnly = useMemo(() => {
    if (modalRoute?.route.id === 'transaction') {
      return false
    }
    if (isDepositAddressEnabled && !!destinationAddress) {
      return false
    }
    return isMissingSourceOrDestAddress
  }, [isDepositAddressEnabled, destinationAddress, modalRoute?.route.id, isMissingSourceOrDestAddress])

  const isQueryEnabled =
    !!fromToken &&
    !!toToken &&
    !!fromChain &&
    !!toChain &&
    !!fromPrice &&
    Number(fromPrice) !== 0 &&
    currentRoute?.id === routes.swap.id &&
    modalRoute === undefined

  const { squidRoute, routeData } = useGetRouteWrapper({
    refetchInterval: route => {
      if (!route) return DEFAULT_ROUTE_REFETCH_INTERVAL
      const quoteExpiryMs = getRouteExpiry(route) ?? 0
      const isCoralRoute = route.estimate?.actions.some(isCoralBridgeAction)
      const buffer = isCoralRoute ? 15000 : 0
      const expiryMinusBuffer = quoteExpiryMs - buffer
      const refetchInterval = Math.max(expiryMinusBuffer, 1)
      return refetchInterval
    },
    enabled: isQueryEnabled,
    quoteOnly,
    refetchIntervalInBackground: false
  })

  const quoteExpiryMs = useMemo(() => {
    return getRouteExpiry(squidRoute.data)
  }, [squidRoute.data])

  const isFetching = useMemo(
    () => squidRoute.isFetching || squidRoute.isRefetching,
    [squidRoute.isFetching, squidRoute.isRefetching]
  )

  return {
    squidRoute,
    isFetching,
    routeData,
    quoteExpiryMs
  }
}
