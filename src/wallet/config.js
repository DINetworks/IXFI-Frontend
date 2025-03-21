import { http, createConfig } from 'wagmi'
import { injected, metaMask, coinbaseWallet , walletConnect } from 'wagmi/connectors'

const projectId = '170f854b82b100289c65898d1e8a7cb6'

const crossfiTestnet = {
  id: 4157,
  name: 'Crossfi Testnet',
  network: 'crossfi',
  nativeCurrency: {
    name: 'XFI',
    symbol: 'XFI',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_JSON_RPC],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_JSON_RPC],
    },
  },
  blockExplorers: {
    default: { name: 'Crossfi Explorer', url: 'https://test.xfiscan.com/' },
  },
  testnet: true,
}

export const config = createConfig({
  // chains: [mainnet, sepolia],
  chains: [crossfiTestnet],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'DI Lending' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [crossfiTestnet.id]: http(),
  },
})
