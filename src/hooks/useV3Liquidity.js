import { useMemo, useCallback } from 'react'
import { useEarnPoolsStore } from 'src/store/useEarnPoolsStore'
import { formatNumber } from 'src/components/utils/format'
import { tickToPrice } from 'src/components/utils/uniswap'
import { useDebounce } from './useDebounce'
import { useLiquidityPool } from './useLiquidityPool'

export const useV3Liquidity = () => {
  const { revertPrice, tickLower, tickUpper } = useEarnPoolsStore(state => state.liquidityZap)
  const { pool, isLoadingInfo } = useLiquidityPool()

  const setLiquidityZapParam = (key, value) => {
    useEarnPoolsStore.setState(state => ({
      liquidityZap: {
        ...state.liquidityZap,
        [key]: value
      }
    }))
  }

  const toggleRevertPrice = useCallback(() => {
    setLiquidityZapParam('revertPrice', !revertPrice)
  }, [revertPrice])

  const setTickLower = lower => {
    setLiquidityZapParam('tickLower', lower)
  }

  const setTickUpper = upper => {
    setLiquidityZapParam('tickUpper', upper)
  }

  const debounceTickLower = useDebounce(tickLower, 300)
  const debounceTickUpper = useDebounce(tickUpper, 300)

  const priceLower = useMemo(() => {
    if (!pool || !tickLower) return null
    return formatNumber(+tickToPrice(tickLower, pool?.token0?.decimals, pool?.token1?.decimals, false))
  }, [pool, tickLower])

  const priceUpper = useMemo(() => {
    if (!pool || !tickUpper) return null
    return formatNumber(+tickToPrice(tickUpper, pool?.token0?.decimals, pool?.token1?.decimals, false))
  }, [pool, tickUpper])

  const minPrice = useMemo(() => {
    if (!isLoadingInfo) {
      if ((!revertPrice && pool?.minTick === tickLower) || (revertPrice && pool?.maxTick === tickUpper)) return '0'
      return !revertPrice ? priceLower : priceUpper
    }
  }, [revertPrice, tickLower, tickUpper, priceLower, priceUpper, pool, isLoadingInfo])

  const maxPrice = useMemo(() => {
    if (!isLoadingInfo) {
      if ((!revertPrice && pool?.maxTick === tickUpper) || (revertPrice && pool?.minTick === tickLower)) return '\u221E'
      return !revertPrice ? priceUpper : priceLower
    }
  }, [revertPrice, tickUpper, tickLower, priceUpper, priceLower, pool, isLoadingInfo])

  return {
    revertPrice,
    toggleRevertPrice,
    tickLower,
    tickUpper,
    debounceTickLower,
    debounceTickUpper,
    priceLower,
    priceUpper,
    minPrice,
    maxPrice,
    setTickLower,
    setTickUpper
  }
}
