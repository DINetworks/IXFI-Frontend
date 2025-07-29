import { useClient } from 'src/components/swap/widget/react-hooks'
import { NavigationBar, SettingsGearIcon } from '@0xsquid/ui'
import { useMemo } from 'react'
import { TabNavigation } from '../components/TabNavigation'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../core/constants'
import { routes } from '../core/routes'
import { WidgetTransactionType } from '../core/types/config'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { useFiatOnRampStore } from '../store/useFiatOnRampStore'
import { useTabStore } from '../store/useTabStore'
import { CountryFlag } from './FiatOnRamp/CountryFlag'
import { FiatOnRampView } from './FiatOnRamp/FiatOnRampView'
import { HistoryButton } from './HistoryView'
import { SendView } from './Send/SendView/SendView'
import { SwapView } from './SwapView'

const CountrySelectorButton = () => {
  const { switchRoute } = useSwapRouter()
  const selectedCountry = useFiatOnRampStore(state => state.selectedCountry)
  const { userCountry } = useClient()
  const currentCountry = selectedCountry || userCountry
  const action = {
    labelOrIcon: <CountryFlag countryCode={currentCountry} size='md' />,
    onClick: () => {
      switchRoute(routes.fiatOnRampCountry)
    },
    id: 'country-selector',
    tooltip: {
      tooltipContent: 'Select your country',
      displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
    }
  }

  return action
}

export const tabs = [
  { label: 'Swap', value: WidgetTransactionType.Swap },
  { label: 'Buy', value: WidgetTransactionType.Buy },
  { label: 'Send', value: WidgetTransactionType.Send }
]

export const MainView = () => {
  const currentTab = useTabStore(state => state.currentTab)
  const { switchRoute } = useSwapRouter()
  const countrySelectorAction = CountrySelectorButton()
  const navigationContent = useMemo(() => {
    const tabSpecifics = {
      [WidgetTransactionType.Swap]: {
        source: WidgetTransactionType.Swap,
        tooltip: 'Swap history'
      },
      [WidgetTransactionType.Buy]: {
        source: WidgetTransactionType.Buy,
        tooltip: 'Buy history'
      },
      [WidgetTransactionType.Send]: {
        source: WidgetTransactionType.Send,
        tooltip: 'Send history'
      }
    }

    const currentSpecifics = tabSpecifics[currentTab] || tabSpecifics[WidgetTransactionType.Swap]
    const historyButtonAction = {
      labelOrIcon: <HistoryButton source={currentSpecifics.source} />,
      onClick: () => switchRoute(routes.history, { source: currentSpecifics.source }),
      id: 'history',
      tooltip: {
        tooltipContent: currentSpecifics.tooltip,
        displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
      }
    }

    const tabNavigationMap = {
      [WidgetTransactionType.Swap]: {
        content: <SwapView />,
        navActions: [
          historyButtonAction,
          {
            labelOrIcon: <SettingsGearIcon />,
            onClick: () => {
              switchRoute(routes.settings)
            },
            id: 'settings',
            tooltip: {
              tooltipContent: 'Swap preferences',
              displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
            }
          }
        ]
      },
      [WidgetTransactionType.Buy]: {
        content: <FiatOnRampView />,
        navActions: [historyButtonAction, countrySelectorAction]
      },
      [WidgetTransactionType.Send]: {
        content: <SendView />,
        navActions: [historyButtonAction]
      }
    }

    return tabNavigationMap[currentTab]
  }, [currentTab, countrySelectorAction])

  return (
    <>
      <NavigationBar actions={navigationContent.navActions} />
      <TabNavigation />
      {navigationContent.content}
    </>
  )
}
