import { useConfigStore } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { NavigationBar as UINavigationBar } from '@0xsquid/ui'
import { useLabels } from '../hooks/useLabels'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { useSwapThemeStore } from '../store/useSwapStore'

export function NavigationBar({
  transparent = false,
  displayButtonShadows = false,
  subtitle,
  hideTitle = false,
  actions
}) {
  const { previousRoute, isCurrentRouteFirstRoute } = useSwapRouter()
  const { currentRouteTitle } = useLabels()
  const { isInitialized } = useConfigStore(state => ({
    isInitialized: state.isInitialized
  }))
  const { headerPaddingRight } = useSwapThemeStore()

  return (
    <UINavigationBar
      paddingRight={headerPaddingRight}
      title={hideTitle ? undefined : currentRouteTitle}
      isLoading={!isInitialized}
      displayBackButton={!isCurrentRouteFirstRoute}
      onBackButtonClick={() => previousRoute()}
      displayButtonShadows={displayButtonShadows}
      transparent={transparent}
      subtitle={subtitle}
      actions={actions}
    />
  )
}
