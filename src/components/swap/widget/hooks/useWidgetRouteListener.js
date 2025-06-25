import { useEffect, useState } from 'react'
import { widgetRouteChangedEventKey } from './useSwapRouter'

/**
 * Listens to the widget route change event and returns the current route id
 * @returns {string | undefined} the current route id
 */
export const useWidgetRouteListener = () => {
  const [currentRouteId, setCurrentRouteId] = useState(undefined)

  useEffect(() => {
    const handleRouteChange = event => {
      const customEvent = event
      setCurrentRouteId(customEvent.detail.route)
    }

    window.addEventListener(widgetRouteChangedEventKey, handleRouteChange)

    return () => {
      window.removeEventListener(widgetRouteChangedEventKey, handleRouteChange)
    }
  }, [])

  return { currentRouteId }
}
