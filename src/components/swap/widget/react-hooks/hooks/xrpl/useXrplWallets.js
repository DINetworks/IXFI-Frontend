import { ChainType } from '@0xsquid/squid-types'
import { useMemo } from 'react'
import { XamanConnector } from '../../core/connectors/xrpl/Xaman'
import { XamanQrConnector } from '../../core/connectors/xrpl/XamanQr'
import { WindowWalletFlag } from '../../core/types/wallet'
import { walletIconBaseUrl, xrplWallets } from '../../core/wallets'
import { isXamanXAppContext } from '../../services/external/xaman'
import { populateWallets } from '../../services/internal/walletService'
import { useClient } from '../client/useClient'

export function useXrplWallets() {
  const { clientWindow } = useClient()

  const wallets = useMemo(() => {
    const isXAppContext = isXamanXAppContext()
    const xamanWalletIcon = `${walletIconBaseUrl}/xaman.webp`

    const xamanXAppWallet = {
      type: ChainType.XRPL,
      name: 'Xaman',
      windowFlag: WindowWalletFlag.XamanXApp,
      connector: new XamanConnector(),
      isInstalled() {
        return true
      },
      isMobile: true,
      connectorId: 'xaman-xapp',
      connectorName: 'Xaman',
      icon: xamanWalletIcon
    }

    const xamanQrWallet = {
      type: ChainType.XRPL,
      name: 'Xaman',
      windowFlag: WindowWalletFlag.XamanQr,
      connector: new XamanQrConnector(),
      skipInstallCheck: true,
      isMobile: true,
      connectorId: 'xaman-qr',
      connectorName: 'Xaman',
      icon: xamanWalletIcon,
      isQrWallet: true
    }

    return [
      // when running in Xaman XApp context, use the native connector
      // otherwise use the QR code connector
      isXAppContext ? xamanXAppWallet : xamanQrWallet,
      ...populateWallets(clientWindow, xrplWallets)
    ]
  }, [clientWindow])

  return {
    wallets
  }
}
