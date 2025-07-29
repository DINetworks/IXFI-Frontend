import { useMemo } from 'react'
import { isFallbackAddressNeeded } from '../../services/internal/cosmosService'
import { useSwapRoutePersistStore } from '../store/useSwapStore'
import { useSwap } from '../swap/useSwap'

export const useRouteWarnings = () => {
  const { toChain, destinationAddress } = useSwap()
  const { swapRoute } = useSwapRoutePersistStore()

  const needsFallbackAddress = useMemo(() => {
    return isFallbackAddressNeeded({
      address: destinationAddress?.address,
      currentFallbackAddress: swapRoute?.fallbackAddress,
      chain: toChain
    })
  }, [destinationAddress?.address, swapRoute?.fallbackAddress, toChain])
  return {
    needsFallbackAddress
  }
}
