import { createConfig } from 'wagmi'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { http } from 'viem'
import { mainnet, bsc, arbitrum, avalanche, optimism, base, polygon } from 'viem/chains'

const projectId = '170f854b82b100289c65898d1e8a7cb6'

const crossfiTestnet = {
  id: 4157,
  name: 'CrossFi Testnet',
  network: 'crossfi',
  nativeCurrency: {
    name: 'XFI',
    symbol: 'XFI',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_JSON_RPC]
    },
    public: {
      http: [process.env.NEXT_PUBLIC_JSON_RPC]
    }
  },
  blockExplorers: {
    default: { name: 'Crossfi Explorer', url: 'https://test.xfiscan.com/' }
  },
  testnet: true
}

export const config = createConfig({
  // chains: [mainnet, sepolia],
  chains: [crossfiTestnet, mainnet, bsc, optimism, base],
  connectors: [metaMask(), walletConnect({ projectId })],
  transports: {
    [crossfiTestnet.id]: http(),
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http()
  }
})
