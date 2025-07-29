import { useMemo } from 'react'
import { useEvmContext } from '../../core/providers/EvmProvider'
import { useSolanaContext } from '../../core/providers/SolanaProvider'
import { useSuiContext } from '../../core/providers/SuiProvider'
import { useXrplContext } from '../../core/providers/XrplProvider'
import {
  multiChainWallets as unformattedMultiChainWallets,
  singleChainWallets as unformattedSingleChainWallets
} from '../../core/wallets'
import { mergeWallets, populateWallets } from '../../services/internal/walletService'
import { useClient } from '../client/useClient'

export const useWallets = () => {
  const { clientWindow } = useClient()
  const { wallets: evmWallets } = useEvmContext()
  const { wallets: solanaWallets } = useSolanaContext()
  const { wallets: suiWallets } = useSuiContext()
  const { wallets: xrplWallets } = useXrplContext()

  const wallets = useMemo(() => {
    const singleChainWallets = populateWallets(clientWindow, unformattedSingleChainWallets)
    const multiChainWallets = populateWallets(clientWindow, unformattedMultiChainWallets)

    return mergeWallets({
      singleChainWallets: [...singleChainWallets, ...evmWallets, ...solanaWallets, ...suiWallets, ...xrplWallets],
      multiChainWallets
    })
  }, [clientWindow, evmWallets, solanaWallets, suiWallets, xrplWallets])

  return {
    wallets
  }
}
