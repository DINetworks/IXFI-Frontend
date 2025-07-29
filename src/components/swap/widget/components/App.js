import { useEffect, useRef } from 'react'
import { useAutoConnect } from 'src/components/swap/widget/react-hooks'
import {
  Button,
  DetailsToolbar,
  NavigationBar,
  ProductCard,
  SettingsGearIcon,
  SwapConfiguration,
  ThemeProvider
} from '@0xsquid/ui'
import { WidgetTransactionType } from '../core/types/config'
import { useTabStore } from '../store/useTabStore'
import { HistoryButton } from '../views/HistoryView'
import { AppRoutes } from './AppRoutes'
import { MaintenanceLayout } from './MaintenanceLayout'
import { TabNavigation } from './TabNavigation'

/**
 * Hook to handle all initialization logic when the app starts
 */
const useAppInitialization = config => {
  const hasInitializedRef = useRef(false)
  // Instead of having wagmi auto connect, we will do it manually
  // We want to have Gnosis Safe app connect in priority if it is available
  useAutoConnect()
  const initializeTabs = useTabStore(state => state.initializeTabs)

  useEffect(() => {
    if (!hasInitializedRef.current && config.tabs) {
      initializeTabs(config.tabs)
      hasInitializedRef.current = true
    }
  }, [config.tabs, initializeTabs])
}

export const App = ({ config }) => {
  useAppInitialization(config)

  return (
    <>
      <MaintenanceLayout />
      <AppRoutes />
    </>
  )
}

export const AppContainer = ({ children, config, className }) => {
  return (
    <ThemeProvider
      theme={config.theme}
      themeType={config.themeType}
      className={className}
      settings={{
        showProgressAnimation: !config.hideAnimations
      }}
    >
      <div
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <ProductCard>{children}</ProductCard>
      </div>
    </ThemeProvider>
  )
}

export const AppSkeleton = ({ config }) => {
  const initializeTabs = useTabStore(state => state.initializeTabs)

  useEffect(() => {
    if (config.tabs) {
      initializeTabs(config.tabs)
    }
  }, [config.tabs, initializeTabs])

  return (
    <>
      <NavigationBar
        isLoading={true}
        actions={[
          {
            labelOrIcon: <HistoryButton source={WidgetTransactionType.Swap} />,
            id: 'history'
          },
          {
            labelOrIcon: <SettingsGearIcon />,
            id: 'settings'
          }
        ]}
      />
      <TabNavigation isDisabled />
      <SwapConfiguration direction='from' isLoading />
      <DetailsToolbar isLoading isEmpty />
      <SwapConfiguration
        direction='to'
        isLoading={true}
        balanceButton={{
          hideMaxChip: true
        }}
      />
      <div className='tw-px-squid-m tw-pb-squid-m tw-h-full tw-max-h-[80px]'>
        <Button variant='tertiary' size='lg' disabled isLoading />
      </div>
    </>
  )
}
