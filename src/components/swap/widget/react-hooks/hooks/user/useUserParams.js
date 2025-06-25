import { ChainType } from '@0xsquid/squid-types'
import { useMemo } from 'react'
import { useConfigStore } from '../store/useSwapStore'
import { useSwap } from '../swap/useSwap'

export const useUserParams = () => {
  const enableGetGasOnDestination = useConfigStore(state => state.config.enableGetGasOnDestination)
  const { fromToken, toToken, toChain, fromChain } = useSwap()

  //   =============
  //       GAS
  //   =============
  const getGasOnDestSupportedForThisRoute = useMemo(
    () =>
      // Not supporting get gas on dest for same chains
      fromChain?.chainId !== toChain?.chainId &&
      // If the destination chain is cosmos, we don't support getting gas there
      toChain?.chainType !== ChainType.COSMOS &&
      // Not supporting get gas on dest for same tokens (bridge)
      ((fromToken?.subGraphIds?.some(sgi => !!toToken?.subGraphIds?.includes(sgi)) &&
        toToken?.subGraphIds?.some(sgi => !!fromToken?.subGraphIds?.includes(sgi))) ||
        // Except for uusdc -> uusdc
        (fromToken?.subGraphIds?.includes('uusdc') && toToken?.subGraphIds?.includes('uusdc'))),
    [fromChain?.chainId, fromToken?.subGraphIds, toChain?.chainId, toToken?.subGraphIds, toChain?.chainType]
  )
  return {
    gasEnabled: enableGetGasOnDestination && getGasOnDestSupportedForThisRoute,
    getGasOnDestSupportedForThisRoute
  }
}
