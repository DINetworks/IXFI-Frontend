import { filterSolanaWallets } from '../../services/internal/solanaService'
import { useStandardWallets } from '../wallet/useStandardWallets'

export function useSolanaWallets() {
  return useStandardWallets({
    filterWallets: filterSolanaWallets
  })
}
