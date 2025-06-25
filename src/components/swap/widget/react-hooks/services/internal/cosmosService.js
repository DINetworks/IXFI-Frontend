import { ChainType } from '@0xsquid/squid-types'
import { fromBech32 } from '@cosmjs/encoding'
import { CHAIN_IDS } from '../../core/constants'
import { isUserRejectionError, normalizeError } from './errorService'
import { isXionSmartContractAddress } from 'src/components/swap/widget/react-hooks'

/**
 * Get the cosmos address for a given chain
 * This might pop up a keplr modal to approve the chain
 * @param chainId
 * @param keplrTypeWallet
 * @returns Cosmos address
 */
export const getCosmosKey = async (chainId, keplrTypeWallet) => {
  if (!chainId || !keplrTypeWallet) return undefined
  const key = await keplrTypeWallet?.getKey(chainId)
  return key.bech32Address
}

export const getKeysSettled = async (chainIds, keplrTypeWallet) => {
  if (!keplrTypeWallet) return []
  const paramArray = chainIds.map(chainId => getCosmosKey(chainId, keplrTypeWallet))
  return Promise.allSettled(paramArray)
}

/**
 * Get the cosmos address for a given chain
 * This might pop up a keplr modal to approve the chain
 * @param chainId
 * @param keplrTypeWallet
 * @returns Cosmos address
 */
export const getAllKeysForSupportedCosmosChains = async (chainIds, keplrTypeWallet) => {
  if (!keplrTypeWallet) return []
  const addresses = []
  for (const chainId of chainIds) {
    try {
      const keys = await getKeysSettled([chainId], keplrTypeWallet)
      keys.forEach(key => {
        if (key.status === 'fulfilled' && key.value) {
          const bech32Address = key.value
          addresses.push({
            address: bech32Address,
            chainId
          })
        }
      })
    } catch (error) {
      console.debug(`Failed to get keys for chain ${chainId}:`, error)
    }
  }
  return addresses
}

export const isCosmosAddressValid = (chainPrefix, address) => {
  try {
    if (!address.toLowerCase().startsWith(chainPrefix)) {
      throw new Error('Invalid address for this chain')
    }
    fromBech32(address)
    return true
  } catch (error) {
    return false
  }
}

export const getCosmosSigningClient = async ({ chainRpc, cosmosSigner, defaultSigningClient }) => {
  if (!cosmosSigner) return null
  // const cosmosClient = (await isNomos())
  // ? SigningNomosClient.connectWithSigner(chainRpc, cosmosSigner) // use Nomos provider
  return defaultSigningClient.connectWithSigner(chainRpc, cosmosSigner) // use default cosmos provider
}

export const getCosmosChainInfosObject = chain => {
  // Clone the chain to avoid mutating the original object
  const cosmosChain = structuredClone(chain)
  //
  // TODO: In the future, it will be better to do this parsing on backend side.
  //
  // The `gasPriceStep` field of the `ChainInfo` has been moved under `feeCurrencies`.
  // This is automatically handled as of right now, but the upcoming update would potentially cause errors.
  delete cosmosChain.gasPriceStep
  // The `coinType` field of the `ChainInfo` is removed. This is automatically handled as of right now,
  // but the upcoming update would potentially cause errors.
  delete cosmosChain.coinType
  return {
    ...cosmosChain,
    feeCurrencies: cosmosChain.feeCurrencies.map(feeCurrency => ({
      ...feeCurrency,
      // Gas price step is now under feeCurrencies
      gasPriceStep: cosmosChain.gasPriceStep
    })),
    chainName: cosmosChain.networkName,
    chainId: cosmosChain.chainId.toString(),
    rpc: cosmosChain.rpc.split('?chain')[0]
  }
}

export const connectCosmosWallet = async (wallet, defaultChain, { connectCosmos, cosmosConnectedWallet }) => {
  if (wallet.connectorId === cosmosConnectedWallet?.connectorId || defaultChain === undefined) {
    return null
  }

  const address = await connectCosmos?.mutateAsync({
    chain: defaultChain,
    wallet: wallet
  })
  if (address) {
    return { wallet, address }
  }
  return null
}

export const isFallbackAddressNeeded = ({ currentFallbackAddress, address, chain }) => {
  // If fallback address is already set or chain is not Cosmos
  // fallback address is not needed
  if (currentFallbackAddress || chain?.chainType !== ChainType.COSMOS) {
    return false
  }
  // For Xion, check if address is 63 chars (smart contract account abstraction)
  if (chain.chainId === CHAIN_IDS.XION) {
    return isXionSmartContractAddress(address)
  }
  // For other Cosmos chains, check coinType
  return chain.coinType !== 118
}

/**
 * Cosmos wallets may throw an error if the chain the user is trying to use is not added to the wallet.
 * For those cases, some wallets expose a method for adding new chains to the user wallet.
 *
 * This method will try to add the provided chain, throwing an error if the request fails
 * or if the original error indicates that the user rejected the request.
 */
export async function suggestChainOrThrow({ keplrTypeWallet, chain, error }) {
  if (isUserRejectionError(normalizeError(error))) {
    throw error
  }
  if (typeof keplrTypeWallet.experimentalSuggestChain !== 'function') {
    throw error
  }
  await keplrTypeWallet.experimentalSuggestChain(getCosmosChainInfosObject(chain))
}
