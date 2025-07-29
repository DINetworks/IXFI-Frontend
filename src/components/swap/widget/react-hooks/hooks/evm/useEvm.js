import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWalletStore } from '../store/useWalletStore'
import { useEvmWallets } from './useEvmWallets'

export function useEvm() {
  const disconnectWallet = useWalletStore(store => store.disconnectWallet)
  const setConnectedWallet = useWalletStore(store => store.setConnectedWallet)
  const { connectAsync, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, connector } = useAccount()
  const { wallets } = useEvmWallets()
  const connectedEvmWallet = useWalletStore(store => store.connectedWalletsByChainType[ChainType.EVM])
  const recentEvmWalletId = useWalletStore(store => store.recentConnectorIds[ChainType.EVM])

  const connectEvm = useMutation({
    mutationFn: async ({ wallet }) => {
      const result = await connectAsync({
        connector: wallet.connector
      })

      const [firstAddress] = result.accounts

      return {
        wallet,
        address: firstAddress
      }
    }
  })

  const disconnectEvm = useCallback(async () => {
    disconnect({ connector: connectedEvmWallet.wallet?.connector })
  }, [connectedEvmWallet.wallet?.connector, disconnect])

  const autoConnectEvm = useCallback(async () => {
    const recentEvmWallet = wallets.find(w => w.connectorId === recentEvmWalletId)
    if (!recentEvmWallet) {
      return
    }

    const isAuthorized = await recentEvmWallet.connector.isAuthorized()
    if (!isAuthorized) return

    connect({
      connector: recentEvmWallet.connector
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    wallets.map(w => w.connectorId),
    recentEvmWalletId
  ])

  useEffect(() => {
    if (!connector?.id || !address) {
      disconnectWallet(ChainType.EVM)
      return
    }
    const connectedWallet = wallets.find(w => w.rdns === connector.id)
    if (!connectedWallet) return

    setConnectedWallet(ChainType.EVM, {
      wallet: connectedWallet,
      address
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, connector?.id, disconnectWallet, setConnectedWallet])

  return {
    connectEvm,
    disconnectEvm,
    autoConnectEvm,
    signer: connectedEvmWallet.wallet?.connector,
    wallets
  }
}
