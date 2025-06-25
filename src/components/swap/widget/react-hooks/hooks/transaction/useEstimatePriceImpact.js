import { useMemo } from 'react'
import { useConfigStore } from '../store/useSwapStore'

export const useEstimatePriceImpact = ({ squidRoute }) => {
  const config = useConfigStore(state => state.config)

  const priceImpact = useMemo(() => {
    const priceImpact = squidRoute?.estimate?.aggregatePriceImpact
    if (priceImpact == null) return
    return Number(priceImpact).toFixed(2)
  }, [squidRoute?.estimate.aggregatePriceImpact])

  const priceImpactStatus = useMemo(() => {
    if (config.priceImpactWarnings !== undefined && priceImpact !== undefined) {
      if (+priceImpact >= config.priceImpactWarnings.warning && +priceImpact < config.priceImpactWarnings.critical) {
        return 'warning'
      }
      if (+priceImpact >= config.priceImpactWarnings.critical) {
        return 'critical'
      }
      if (+priceImpact < config.priceImpactWarnings.warning) {
        return 'normal'
      }
    }
    return undefined
  }, [config.priceImpactWarnings, priceImpact])
  return {
    priceImpact,
    priceImpactStatus
  }
}
