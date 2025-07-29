import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useWalletStore } from '../store/useWalletStore'

export function useBitcoin() {
  const connectedBitcoinWallet = useWalletStore(store => store.connectedWalletsByChainType[ChainType.BTC])

  const connectBitcoin = useMutation({
    mutationFn: async ({ wallet }) => {
      const { address } = await wallet.connector.requestAccount()

      return {
        wallet,
        address
      }
    }
  })

  return {
    connectBitcoin,
    signer: connectedBitcoinWallet.wallet?.connector
  }
}
