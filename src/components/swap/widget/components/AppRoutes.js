import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSquid } from 'src/components/swap/widget/react-hooks'
import { routes } from '../core/routes'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { useSwapParamsListener } from '../hooks/useSwapParamsListener'
import { useSwapRouterStore } from '../store/useSwapStore'

import { AllTokensView } from '../views/AllTokensView'
import { ConnectWalletQr } from '../views/ConnectWalletQr'
import { DepositAddressView } from '../views/DepositAddressView'
import { DestinationAddressView } from '../views/DestinationAddressView'
import { FiatOnRampCountryView } from '../views/FiatOnRamp/FiatOnRampCountryView'
import { FiatOnRampCurrencyView } from '../views/FiatOnRamp/FiatOnRampCurrencyView'
import { FiatOnRampPaymentMethodView } from '../views/FiatOnRamp/FiatOnRampPaymentMethodView'
import { FiatOnRampProgressView } from '../views/FiatOnRamp/FiatOnRampProgressView'
import { FiatOnRampProvidersView } from '../views/FiatOnRamp/FiatOnRampProvidersView'
import { FiatOnRampView } from '../views/FiatOnRamp/FiatOnRampView'
import { HistoryView } from '../views/HistoryView'
import { MainView } from '../views/MainView'
import { PaymentMethodView } from '../views/PaymentMethodView'
import { SendProgressView } from '../views/Send/SendProgressView'
import { SettingsView } from '../views/SettingsView'
import { SignSendTransactionQrView } from '../views/SignSendTransactionQrView'
import { SignSwapTransactionQrView } from '../views/SignSwapTransactionQrView'
import { SignTrustLineTransactionQrView } from '../views/SignTrustlineTransactionQrView'
import { StopsView } from '../views/StopsView'
import { SwapDetailsView } from '../views/SwapDetailsView'
import { TransactionView } from '../views/TransactionView'
import { WalletsView } from '../views/WalletsView'

export const AppRoutes = () => {
  const { currentRoute } = useSwapRouter()
  const { modalRoute: _modalRoute, history, transition } = useSwapRouterStore()
  const { forceSquidInfoRefetch } = useSquid()

  const allRoutes = [
    { id: 'swap', path: routes.swap.path, element: <MainView />, isModal: routes.swap.isModal },
    { id: 'settings', path: routes.settings.path, element: <SettingsView />, isModal: routes.settings.isModal },
    {
      id: 'destination',
      path: routes.destination.path,
      element: <DestinationAddressView />,
      isModal: routes.destination.isModal
    },
    {
      id: 'wallets',
      path: `${routes.wallets.path}/:direction`,
      element: <WalletsView />,
      isModal: routes.wallets.isModal
    },
    {
      id: 'connectWalletQr',
      path: routes.connectWalletQr.path,
      element: <ConnectWalletQr />,
      isModal: routes.connectWalletQr.isModal
    },
    {
      id: 'transaction',
      path: routes.transaction.path,
      element: <TransactionView />,
      isModal: routes.transaction.isModal
    },
    {
      id: 'signSwapTransactionQr',
      path: routes.signSwapTransactionQr.path,
      element: <SignSwapTransactionQrView />,
      isModal: routes.signSwapTransactionQr.isModal
    },
    {
      id: 'signSendTransactionQr',
      path: routes.signSendTransactionQr.path,
      element: <SignSendTransactionQrView />,
      isModal: routes.signSendTransactionQr.isModal
    },
    {
      id: 'signTrustLineTransactionQr',
      path: routes.signTrustLineTransactionQr.path,
      element: <SignTrustLineTransactionQrView />,
      isModal: routes.signTrustLineTransactionQr.isModal
    },
    { id: 'history', path: routes.history.path, element: <HistoryView />, isModal: routes.history.isModal },
    {
      id: 'allTokens',
      path: `${routes.allTokens.path}/:direction`,
      element: <AllTokensView />,
      isModal: routes.allTokens.isModal
    },
    {
      id: 'swapDetails',
      path: routes.swapDetails.path,
      element: <SwapDetailsView />,
      isModal: routes.swapDetails.isModal
    },
    { id: 'stops', path: routes.stops.path, element: <StopsView />, isModal: routes.stops.isModal },
    {
      id: 'paymentMethod',
      path: routes.paymentMethod.path,
      element: <PaymentMethodView />,
      isModal: routes.paymentMethod.isModal
    },
    {
      id: 'depositAddress',
      path: routes.depositAddress.path,
      element: <DepositAddressView />,
      isModal: routes.depositAddress.isModal
    },
    { id: 'fiatOnRamp', path: routes.fiatOnRamp.path, element: <FiatOnRampView />, isModal: routes.fiatOnRamp.isModal },
    {
      id: 'fiatOnRampProgress',
      path: routes.fiatOnRampProgress.path,
      element: <FiatOnRampProgressView />,
      isModal: routes.fiatOnRampProgress.isModal
    },
    {
      id: 'fiatOnRampProviders',
      path: routes.fiatOnRampProviders.path,
      element: <FiatOnRampProvidersView />,
      isModal: routes.fiatOnRampProviders.isModal
    },
    {
      id: 'fiatOnRampCountry',
      path: routes.fiatOnRampCountry.path,
      element: <FiatOnRampCountryView />,
      isModal: routes.fiatOnRampCountry.isModal
    },
    {
      id: 'fiatOnRampCurrency',
      path: routes.fiatOnRampCurrency.path,
      element: <FiatOnRampCurrencyView />,
      isModal: routes.fiatOnRampCurrency.isModal
    },
    {
      id: 'sendInProgress',
      path: routes.sendInProgress.path,
      element: <SendProgressView />,
      isModal: routes.sendInProgress.isModal
    },
    {
      id: 'fiatOnRampPaymentMethod',
      path: routes.fiatOnRampPaymentMethod.path,
      element: <FiatOnRampPaymentMethodView />,
      isModal: routes.fiatOnRampPaymentMethod.isModal
    }
  ]

  const newRoute = allRoutes.find(r => r.id === currentRoute?.id)
  const modalRoute = allRoutes.find(el => el.id === _modalRoute?.route.id)

  const [transitionStage, setTransitionStage] = useState('')
  const canStartAnimatingRef = useRef(false)

  const updateViewDisplay = useCallback(method => {
    setTransitionStage(method)
  }, [])

  useEffect(() => {
    if (!canStartAnimatingRef.current) {
      canStartAnimatingRef.current = true
      return
    }

    if (transition?.inProgress) {
      updateViewDisplay(transition.isNewRoute ? 'hide-bottom' : 'hide-top')
    } else {
      updateViewDisplay(transition?.isNewRoute ? 'hide-top' : 'hide-bottom')
      setTimeout(() => {
        updateViewDisplay('active')
      }, 50)
    }
  }, [transition, updateViewDisplay])

  const getTransitionClass = index => {
    const isCurrent = index === history.length - 1
    return isCurrent ? transitionStage : 'active'
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      forceSquidInfoRefetch()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [forceSquidInfoRefetch])

  useSwapParamsListener()

  return (
    <>
      {history.map((route, index) => {
        const current = allRoutes.find(r => r.id === route?.route.id)
        const visible = current?.id === newRoute?.id

        return (
          <div
            key={index}
            style={{
              display: visible ? 'flex' : 'none',
              flexDirection: 'column',
              height: '100%'
            }}
            className={`squid-router-transition-layer-${getTransitionClass(index)}`}
          >
            {current?.element || null}
          </div>
        )
      })}

      {modalRoute?.isModal && <div className='modal'>{modalRoute.element}</div>}
    </>
  )
}
