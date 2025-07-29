import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useWalletStore } from '../store/useWalletStore'
import { useSuiWallets } from './useSuiWallets'

export function useSui() {
  const { wallets } = useSuiWallets()
  const connectedSuiWallet = useWalletStore(store => store.connectedWalletsByChainType[ChainType.SUI])
  const recentSuiWalletId = useWalletStore(store => store.recentConnectorIds[ChainType.SUI])
  const setConnectedWallet = useWalletStore(store => store.setConnectedWallet)
  const disconnectWallet = useWalletStore(store => store.disconnectWallet)

  const connectSui = useMutation({
    mutationFn: async ({ wallet }) => {
      let account
      try {
        // try to connect silently first
        account = await wallet.connector.connect({ silent: true })
      } catch {
        // if auto-connect fails (e.g. not authorized yet)
        // fallback to connect via popup
        account = await wallet.connector.connect()
      }

      return {
        wallet,
        address: account.account.address,
        account: account.account
      }
    }
  })

  const disconnectSui = useCallback(async () => {
    await connectedSuiWallet.wallet?.connector.disconnect()
  }, [connectedSuiWallet.wallet])

  const autoConnectSui = useCallback(async () => {
    const recentSuiWallet = wallets.find(w => w.connectorId === recentSuiWalletId)
    if (!recentSuiWallet) {
      return
    }

    const { account } = await recentSuiWallet.connector.connect({
      silent: true
    })

    setConnectedWallet(ChainType.SUI, {
      wallet: recentSuiWallet,
      address: account.address,
      account
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets.map(w => w.connectorId), recentSuiWalletId])

  useEffect(() => {
    const wallet = connectedSuiWallet.wallet
    if (!wallet) {
      return
    }

    function onAccountsChanged({ accounts = [] }) {
      if (!wallet) {
        return
      }

      const [account] = accounts

      if (account) {
        setConnectedWallet(ChainType.SUI, {
          wallet: wallet,
          address: account.address,
          account: account
        })
      } else {
        disconnectWallet(ChainType.SUI)
      }
    }
    const removeListener = wallet.connector.on('change', onAccountsChanged)

    return () => {
      removeListener()
    }
  }, [disconnectWallet, setConnectedWallet, connectedSuiWallet.wallet])

  return {
    connectSui,
    disconnectSui,
    autoConnectSui,
    signer: connectedSuiWallet.wallet?.connector,
    wallets
  }
}
