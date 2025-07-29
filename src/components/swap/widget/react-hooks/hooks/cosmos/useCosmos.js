import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CHAIN_IDS } from '../../core/constants'
import { getCosmosChainInfosObject, getCosmosKey, suggestChainOrThrow } from '../../services/internal/cosmosService'
import { getConnectorForChainType } from '../../services/internal/walletService'
import { useSquidChains } from '../chains/useSquidChains'
import { useClient } from '../client/useClient'
import { useSwapRoutePersistStore } from '../store/useSwapStore'
import { useWalletStore } from '../store/useWalletStore'
import { useSwap } from '../swap/useSwap'

export const useCosmos = () => {
  const cosmosWalletState = useWalletStore(state => state.connectedWalletsByChainType[ChainType.COSMOS])
  const cosmosAddress = cosmosWalletState?.address
  const isConnected = !!cosmosAddress
  const cosmosConnectedWallet = cosmosWalletState.wallet
  const [cosmosChainId, setCosmosChainId] = useState()
  const { fromChain } = useSwap()
  const { cosmosChains } = useSquidChains()
  const { clientWindow } = useClient()
  const { setConnectedWallet, disconnectWallet } = useWalletStore()

  const { keplrTypeWallet, signer: cosmosSigner } = useCosmosSigner({
    chain: fromChain
  })

  const getCosmosAddressForChain = useCallback(
    async chainId => {
      return getCosmosKey(chainId, keplrTypeWallet)
    },
    [keplrTypeWallet]
  )

  const getAddress = useCallback(async ({ cosmosWalletObject, chainId }) => {
    const address = await getCosmosKey(chainId, cosmosWalletObject)
    return address ?? ''
  }, [])

  /**
   * Update wallet store with the new connected wallet
   * and update swap route store with the new derived fallback address
   */
  const updateWalletStore = useCallback(
    async (wallet, cosmosWalletObject, address) => {
      const osmosisAddress = await getCosmosKey(CHAIN_IDS.OSMOSIS, cosmosWalletObject)
      if (wallet) {
        setConnectedWallet(ChainType.COSMOS, {
          wallet: wallet,
          address
        })
      }

      useSwapRoutePersistStore.setState(state => ({
        ...state,
        swapRoute: {
          ...state.swapRoute,
          fallbackAddress: osmosisAddress
        }
      }))
    },
    [setConnectedWallet]
  )

  const handleKeplrAccountChanged = useCallback(async () => {
    if (cosmosChainId) {
      const address = await getCosmosKey(cosmosChainId, keplrTypeWallet)
      if (address) {
        await updateWalletStore(cosmosConnectedWallet, keplrTypeWallet, address)
      }
    }
  }, [cosmosChainId, keplrTypeWallet, updateWalletStore, cosmosConnectedWallet])

  useEffect(() => {
    clientWindow?.addEventListener('keplr_keystorechange', () => handleKeplrAccountChanged())

    return () => {
      clientWindow?.removeEventListener('keplr_keystorechange', () => handleKeplrAccountChanged())
    }
  }, [handleKeplrAccountChanged, clientWindow])

  const connectCosmos = useMutation({
    mutationFn: async ({ chain, wallet, approveAllChains = true }) => {
      const chainInfos = getCosmosChainInfosObject(chain)
      const cosmosWalletObject = wallet.connector().provider
      if (cosmosWalletObject) {
        setCosmosChainId(chainInfos.chainId.toString())

        try {
          if (approveAllChains && typeof cosmosWalletObject.getChainInfosWithoutEndpoints === 'function') {
            try {
              const addedChains = await cosmosWalletObject.getChainInfosWithoutEndpoints()
              const addedChainIds = addedChains?.map(addedChain => addedChain.chainId)
              const chainsToEnable = cosmosChains
                .filter(c => addedChainIds?.includes(c.chainId.toString()))
                .map(c => c.chainId.toString())
              await cosmosWalletObject.enable(chainsToEnable)
            } catch (error) {
              console.warn('Failed to get chain infos, falling back to single chain enable', error)
              await cosmosWalletObject.enable(chainInfos.chainId)
            }
          } else {
            await cosmosWalletObject.enable(chainInfos.chainId)
          }

          const address = await getAddress({
            chainId: chain.chainId.toString(),
            cosmosWalletObject,
            wallet
          })

          if (address) {
            updateWalletStore(wallet, cosmosWalletObject, address)
            return address
          }
        } catch (error) {
          await suggestChainOrThrow({
            chain,
            error,
            keplrTypeWallet: cosmosWalletObject
          })

          return connectCosmos.mutateAsync({ chain, wallet })
        }
      }

      return undefined
    }
  })

  const clearData = () => {
    disconnectWallet(ChainType.COSMOS)
  }

  const onCosmosChainChange = newChainId => {
    if (newChainId !== cosmosChainId) {
      clearData()
    }
  }

  return {
    connectCosmos,
    cosmosChainId,
    isConnected,
    onCosmosChainChange,
    cosmosConnectedWallet,
    cosmosSigner,
    keplrTypeWallet,
    getCosmosAddressForChain,
    cosmosAddress
  }
}

export function useCosmosSigner({ chain }) {
  const cosmosWalletState = useWalletStore(state => state.connectedWalletsByChainType[ChainType.COSMOS])

  /**
   * Get the appropriate Cosmos signer based on the chain
   * Noble chain requires full signer for CCTP messages
   * Other chains use Amino signer for Ledger compatibility
   */
  const getCosmosSignerForChain = useCallback((chainId, wallet) => {
    return chainId === CHAIN_IDS.NOBLE ? wallet.getOfflineSigner(chainId) : wallet.getOfflineSignerOnlyAmino(chainId)
  }, [])

  const connector = useMemo(() => {
    if (!cosmosWalletState?.wallet) {
      return undefined
    }
    const cosmosConnector = getConnectorForChainType(cosmosWalletState.wallet, ChainType.COSMOS)
    if (!cosmosConnector) return undefined
    return cosmosConnector()?.provider
  }, [cosmosWalletState?.wallet])

  const signer = useMemo(() => {
    if (!connector || chain?.chainType !== ChainType.COSMOS) return
    // use Amino signer for Ledger compatibility
    const newCosmosSigner = getCosmosSignerForChain(chain.chainId, connector)
    return newCosmosSigner
  }, [chain?.chainId, chain?.chainType, connector])

  return { signer, keplrTypeWallet: connector }
}
