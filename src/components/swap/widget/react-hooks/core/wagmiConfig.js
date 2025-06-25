import { ChainType } from '@0xsquid/squid-types'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'
import { coinbaseWallet, injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { WC_METADATA, WALLETCONNECT_PROJECT_ID } from './constants'

export const createWagmiConfig = squidChains => {
  const filteredEvmChains = squidChains.filter(chain => chain.chainType === ChainType.EVM)

  if (filteredEvmChains.length === 0) {
    throw new Error('At least one chain is required')
  }

  const wagmiChains = filteredEvmChains.map(chain => {
    return defineChain({
      id: Number(chain.chainId),
      name: chain.networkName,
      nativeCurrency: {
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals
      },
      rpcUrls: {
        public: {
          http: [chain.rpc]
        },
        default: {
          http: [chain.rpc]
        }
      }
    })
  })
  return createConfig({
    chains: wagmiChains,
    transports: Object.fromEntries(wagmiChains.map(chain => [chain.id, http(chain.rpcUrls.public.http[0] ?? '')])),
    connectors: [
      injected(),
      safe({
        allowedDomains: [/app.safe.global$/]
      }),
      metaMask({
        dappMetadata: {
          name: WC_METADATA.name,
          url: WC_METADATA.url,
          iconUrl: WC_METADATA.icon
        }
      }),
      coinbaseWallet({
        appName: WC_METADATA.name,
        appLogoUrl: WC_METADATA.icon
      }),
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
        metadata: {
          url: WC_METADATA.url,
          name: WC_METADATA.name,
          icons: [WC_METADATA.icon],
          description: WC_METADATA.description
        }
      })
    ]
  })
}
// Taken from wagmi docs
// https://wagmi.sh/react/guides/ethers
export function clientToSigner(client) {
  const { account, chain, transport } = client
  if (!account || !chain || !transport) {
    return undefined
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}
