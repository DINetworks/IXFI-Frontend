import { useMemo } from 'react'
import { merge } from 'lodash'
import { routes } from '../core/routes'
import { useSwapLabelsStore } from '../store/useSwapStore'
import { useSwapRouter } from './useSwapRouter'

const defaultLabels = {
  titles: Object.fromEntries(Object.entries(routes).map(([key, value]) => [key, value.title])),
  submitSwapButton: {
    swap: 'Swap',
    swapAnyway: 'Swap anyway'
  },
  tabs: {
    swap: 'Swap',
    buy: 'Buy',
    send: 'Send'
  }
}

export const useLabels = () => {
  const { currentRoute } = useSwapRouter()
  const customLabels = useSwapLabelsStore(state => state.labels)
  const labels = useMemo(() => merge(defaultLabels, customLabels), [customLabels])
  const currentRouteTitle = useMemo(() => {
    var _a
    if (!currentRoute?.id) return undefined
    return (_a = labels.titles[currentRoute.id]) ?? currentRoute.title
  }, [currentRoute?.id, currentRoute?.title, labels.titles])
  return {
    currentRouteTitle,
    labels
  }
}
