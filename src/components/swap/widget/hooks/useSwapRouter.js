import { ANIMATION_DURATIONS } from '@0xsquid/ui'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useKeyboardNavigation } from 'src/components/swap/widget/react-hooks'
import { useSwapRouterStore } from '../store/useSwapStore'

export const widgetRouteChangedEventKey = 'squid.widget.routeIdChanged'

export const useSwapRouter = () => {
  const history = useSwapRouterStore(state => state.history)
  const modalRoute = useSwapRouterStore(state => state.modalRoute)
  const isModalOpen = useSwapRouterStore(state => state.isModalOpen)

  const handleCloseModal = useCallback(() => {
    useSwapRouterStore.setState({ isModalOpen: false })
    setTimeout(() => {
      useSwapRouterStore.setState({ modalRoute: undefined })
    }, ANIMATION_DURATIONS.HIDE_MODAL)
  }, [])

  const triggerTransition = (callback, isNewRoute = false) => {
    useSwapRouterStore.setState({
      transition: {
        inProgress: true,
        isNewRoute
      }
    })
    setTimeout(() => {
      callback()
      useSwapRouterStore.setState({
        transition: {
          inProgress: false,
          isNewRoute
        }
      })
    }, 70)
  }

  const switchRoute = (route, params, addRouteToHistory = true) => {
    if (route.isModal) {
      useSwapRouterStore.setState({
        modalRoute: { route, params },
        isModalOpen: true
      })
      return
    }
    triggerTransition(() => {
      useSwapRouterStore.setState({ modalRoute: undefined })
      const newHistory = [...history]
      if (addRouteToHistory) {
        newHistory.push({ route, params })
      } else {
        newHistory.splice(newHistory.length - 1, 1, { route, params })
      }
      useSwapRouterStore.setState({ history: newHistory })
    }, true)
  }

  const previousRoute = () => {
    if (history.length <= 1) return // Nothing to pop if only one or no entries
    triggerTransition(() => {
      const newHistory = [...history]
      newHistory.pop() // Remove the last route
      useSwapRouterStore.setState({
        history: newHistory,
        modalRoute: undefined
      })
    }, false)
  }

  const currentRoute = useMemo(() => {
    return history[history.length - 1]?.route
  }, [history])

  const currentRouteParams = useMemo(() => {
    return history[history.length - 1]?.params
  }, [history])

  // Use useRef to keep track of the previous route
  const previousRouteRef = useRef(undefined)

  // Dispatch event to notify integrator website of route change
  useEffect(() => {
    if (currentRoute && currentRoute.id !== previousRouteRef.current) {
      const event = new CustomEvent(widgetRouteChangedEventKey, {
        detail: { route: currentRoute.id }
      })
      window.dispatchEvent(event)
      previousRouteRef.current = currentRoute.id
    }
  }, [currentRoute])

  useKeyboardNavigation({
    onEscape() {
      previousRoute()
    }
  })

  return {
    currentRoute,
    modalRoute,
    isModalOpen,
    handleCloseModal,
    switchRoute,
    previousRoute,
    currentRouteParams,
    isCurrentRouteFirstRoute: history.length === 1
  }
}
