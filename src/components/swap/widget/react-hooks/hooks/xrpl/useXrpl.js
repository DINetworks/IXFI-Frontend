import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useWalletStore } from '../store/useWalletStore'
import { useXrplWallets } from './useXrplWallets'

export function useXrpl() {
  const { wallets } = useXrplWallets()
  const connectedXrplWallet = useWalletStore(state => state.connectedWalletsByChainType[ChainType.XRPL])
  const recentXrplWalletId = useWalletStore(store => store.recentConnectorIds[ChainType.XRPL])
  const setConnectedWallet = useWalletStore(store => store.setConnectedWallet)
  const disconnectWallet = useWalletStore(store => store.disconnectWallet)

  const connectXrpl = useMutation({
    mutationFn: async ({ wallet }) => {
      const xrplConnectedAddress = await wallet.connector.connect()

      return {
        wallet,
        address: xrplConnectedAddress
      }
    }
  })

  const disconnectXrpl = useCallback(async () => {
    await connectedXrplWallet?.wallet?.connector.disconnect?.()
  }, [connectedXrplWallet?.wallet?.connector])

  const autoConnectXrpl = useCallback(async () => {
    const recentXrplWallet = wallets.find(w => w.connectorId === recentXrplWalletId)
    if (!recentXrplWallet?.connector.autoConnect) {
      return
    }
    const address = await recentXrplWallet.connector.autoConnect()

    if (address) {
      setConnectedWallet(ChainType.XRPL, {
        wallet: recentXrplWallet,
        address
      })
    }
  }, [recentXrplWalletId, setConnectedWallet, wallets])

  useEffect(() => {
    const wallet = connectedXrplWallet?.wallet
    if (!wallet?.connector.on) {
      return
    }
    const removeListener = wallet.connector.on('disconnect', () => {
      disconnectWallet(ChainType.XRPL)
    })

    return () => {
      removeListener()
    }
  }, [connectedXrplWallet?.wallet, disconnectWallet])

  return {
    wallets,
    connectXrpl,
    signer: connectedXrplWallet?.wallet?.connector,
    autoConnectXrpl,
    disconnectXrpl
  }
}
