import { SlushWallet } from '@mysten/slush-wallet'
import { filterSuiWallets, slushWebWalletData } from '../../services/internal/suiService'
import { useStandardWallets } from '../wallet/useStandardWallets'

function getExtraWallets() {
  const slushWebWallet = new SlushWallet({
    name: 'Squid',
    chain: 'sui:mainnet',
    metadata: {
      enabled: true,
      icon: slushWebWalletData.icon,
      id: slushWebWalletData.id,
      walletName: slushWebWalletData.name
    }
  })

  return [slushWebWallet]
}

export function useSuiWallets() {
  return useStandardWallets({
    filterWallets: filterSuiWallets,
    getExtraWallets
  })
}
