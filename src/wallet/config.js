import { createConfig } from 'wagmi'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { http } from 'viem'
import { mainnet, bsc, arbitrum, avalanche, optimism, base, polygon } from 'viem/chains'

const projectId = '170f854b82b100289c65898d1e8a7cb6'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

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
      http: [`https://crossfi-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`]
    },
    public: {
      http: [process.env.NEXT_PUBLIC_JSON_RPC]
    }
  },
  blockExplorers: {
    default: { name: 'Crossfi Explorer', url: `https://crossfi-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` }
  },
  testnet: true
}

export const config = createConfig({
  // chains: [mainnet, sepolia],
  chains: [crossfiTestnet, mainnet, bsc, optimism, base],
  connectors: [metaMask(), walletConnect({ projectId })],
  transports: {
    [crossfiTestnet.id]: http(`https://crossfi-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [mainnet.id]: http(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`),
    [bsc.id]: http(),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [avalanche.id]: http(`https://avalanche-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`)
  }
})
