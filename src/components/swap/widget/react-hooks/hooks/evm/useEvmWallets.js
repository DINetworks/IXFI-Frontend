import { useMemo } from 'react'
import { useConnectors } from 'wagmi'
import { filterWagmiConnector, formatEvmWallet } from '../../services/internal/evmService'

export function useEvmWallets() {
  const connectors = useConnectors()

  const wallets = useMemo(() => {
    return connectors.filter(filterWagmiConnector).map(formatEvmWallet)
  }, [connectors])

  return {
    wallets
  }
}
