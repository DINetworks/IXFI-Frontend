import { ChainType } from '@0xsquid/squid-types'
import { Connection } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { SOLANA_RPC_URL } from '../../core/constants'
import { useWalletStore } from '../store/useWalletStore'
import { useSolanaWallets } from './useSolanaWallets'

export function useSolana() {
  const disconnectWallet = useWalletStore(store => store.disconnectWallet)
  const setConnectedWallet = useWalletStore(store => store.setConnectedWallet)
  const { wallets } = useSolanaWallets()
  const connectedSolanaWallet = useWalletStore(store => store.connectedWalletsByChainType[ChainType.SOLANA])
  const recentSolanaWalletId = useWalletStore(store => store.recentConnectorIds[ChainType.SOLANA])

  const connectSolana = useMutation({
    mutationFn: async ({ wallet }) => {
      try {
        // try to connect silently first
        await wallet.connector.autoConnect()
      } catch {
        // if auto-connect fails (e.g. not authorized yet)
        // fallback to connect via popup
        await wallet.connector.connect()
      }
      const address = wallet.connector.wallet.accounts[0].address

      return {
        wallet,
        address
      }
    }
  })

  const disconnectSolana = useCallback(async () => {
    await connectedSolanaWallet.wallet?.connector.disconnect()
  }, [connectedSolanaWallet.wallet?.connector])

  const autoConnectSolana = useCallback(async () => {
    const recentSolanaWallet = wallets.find(w => w.connectorId === recentSolanaWalletId)
    if (!recentSolanaWallet) {
      return
    }

    await recentSolanaWallet.connector.autoConnect()
    const [account] = recentSolanaWallet.connector.wallet.accounts
    setConnectedWallet(ChainType.SOLANA, {
      wallet: recentSolanaWallet,
      address: account.address
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets.map(w => w.connectorId), recentSolanaWalletId])

  useEffect(() => {
    const wallet = connectedSolanaWallet.wallet
    if (!wallet) {
      return
    }

    function onConnect(newAddress) {
      if (wallet) {
        setConnectedWallet(ChainType.SOLANA, {
          wallet,
          address: newAddress.toString()
        })
      }
    }

    function onDisconnect() {
      disconnectWallet(ChainType.SOLANA)
    }

    wallet.connector.on('connect', onConnect)
    wallet.connector.on('disconnect', onDisconnect)

    return () => {
      wallet.connector.off('connect', onConnect)
      wallet.connector.off('disconnect', onDisconnect)
    }
  }, [disconnectWallet, setConnectedWallet, connectedSolanaWallet.wallet])

  return {
    connectSolana,
    disconnectSolana,
    autoConnectSolana,
    signer: connectedSolanaWallet.wallet?.connector,
    wallets
  }
}

export const useSolanaConnection = () => {
  const connectionRef = useRef(new Connection(SOLANA_RPC_URL))

  return connectionRef.current
}
