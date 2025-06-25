import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useBitcoinContext } from '../../core/providers/BitcoinProvider'
import { useCosmosContext } from '../../core/providers/CosmosProvider'
import { useEvmContext } from '../../core/providers/EvmProvider'
import { useSolanaContext } from '../../core/providers/SolanaProvider'
import { useSuiContext } from '../../core/providers/SuiProvider'
import { useXrplContext } from '../../core/providers/XrplProvider'
import { QrCodeGenerationError } from '../../core/types/error'
import { WidgetEvents } from '../../services/internal/eventService'
import {
  cancelConnectWallet as cancelConnectWalletServiceMethod,
  connectWallet as connectWalletServiceMethod,
  getWalletSupportedChainTypes,
  redirectToExtensionsStore
} from '../../services/internal/walletService'
import { useSquidChains } from '../chains/useSquidChains'
import { ConnectingWalletStatus, useWalletStore } from '../store/useWalletStore'
import { useGnosisContext } from './useGnosisContext'
import { useWallets } from './useWallets'

export const useWallet = () => {
  const { wallets } = useWallets()
  const { connectEvm, disconnectEvm } = useEvmContext()
  const { connectCosmos, cosmosConnectedWallet } = useCosmosContext()
  const { connectSolana, disconnectSolana } = useSolanaContext()
  const { connectBitcoin } = useBitcoinContext()
  const { connectSui, disconnectSui } = useSuiContext()
  const { connectXrpl, disconnectXrpl } = useXrplContext()
  const { findChain } = useSquidChains()
  const { isGnosisConnected, gnosisAddress } = useGnosisContext()
  const {
    connectedWalletsByChainType,
    connectingWalletState,
    setConnectedWallet,
    setConnectingWallet,
    disconnectWallet: storeDisconnectWallet
  } = useWalletStore()

  const walletConnectionError = (wallet, error) => {
    const isQrError = error instanceof QrCodeGenerationError
    setConnectingWallet({
      status: isQrError ? ConnectingWalletStatus.QR_GENERATION_FAILED : ConnectingWalletStatus.REJECTED,
      wallet
    })
  }

  const connectWalletMutation = useMutation({
    mutationFn: async ({ wallet, chain, selectedChainTypes }) => {
      if (!wallet.skipInstallCheck && !wallet.isInstalled?.()) {
        redirectToExtensionsStore(wallet)
        return false
      }

      setConnectingWallet({
        wallet,
        status: ConnectingWalletStatus.CONNECTING
      })

      try {
        const result = await connectWalletServiceMethod({
          wallet,
          selectedChain: chain,
          connectEvm,
          connectCosmos,
          cosmosConnectedWallet,
          connectSolana,
          connectBitcoin,
          connectSui,
          connectXrpl,
          selectedChainTypes,
          findChain
        })

        if (result) {
          result.addresses.forEach(({ chainType, data }) => {
            setConnectedWallet(chainType, data)
          })
          setConnectingWallet({
            status: ConnectingWalletStatus.IDLE,
            wallet
          })
          return true
        } else {
          walletConnectionError(wallet)
          return false
        }
      } catch (error) {
        console.error('Failed to connect wallet', error)
        walletConnectionError(wallet, error)
        return false
      }
    }
  })

  const disconnectWallet = async chainType => {
    try {
      switch (chainType) {
        case ChainType.EVM:
          await disconnectEvm()
          break
        case ChainType.SOLANA:
          await disconnectSolana()
          break
        case ChainType.SUI:
          await disconnectSui()
          break
        case ChainType.XRPL:
          await disconnectXrpl()
          break
        default:
          // TODO: Implement disconnect for other chains
          break
      }
    } catch (error) {
      console.debug(`Failed to disconnect ${chainType} wallet:`, error)
    } finally {
      storeDisconnectWallet(chainType)
    }
  }

  const cancelConnectWallet = useCallback(() => {
    if (connectingWalletState.wallet) {
      cancelConnectWalletServiceMethod(connectingWalletState.wallet)
    }
    setConnectingWallet({
      status: ConnectingWalletStatus.IDLE,
      wallet: undefined
    })
  }, [connectingWalletState.wallet, setConnectingWallet])

  const connectedAddresses = useMemo(() => {
    const chainTypeToAddressMap = Object.fromEntries(
      Object.entries(connectedWalletsByChainType).map(([key, value]) => [key, value.address])
    )
    if (isGnosisConnected) {
      return {
        ...chainTypeToAddressMap,
        [ChainType.EVM]: gnosisAddress
      }
    }

    return chainTypeToAddressMap
  }, [connectedWalletsByChainType, isGnosisConnected, gnosisAddress])

  const isWalletConnected = useCallback(
    wallet => {
      // Multi ecosystem wallets (e.g. Phantom, Keplr)
      if (wallet.isMultiChain) {
        return getWalletSupportedChainTypes(wallet).some(
          chainType => connectedWalletsByChainType[chainType]?.wallet?.connectorId === wallet.connectorId
        )
      }

      // Single ecosystem wallets (e.g. MetaMask)
      return connectedWalletsByChainType[wallet.type]?.wallet?.connectorId === wallet.connectorId
    },
    [connectedWalletsByChainType]
  )

  const connectedWallets = useMemo(() => {
    return Object.values(connectedWalletsByChainType)
      .map(c => c.wallet)
      .filter(w => w !== null && w !== undefined)
  }, [connectedWalletsByChainType])

  const isChainTypeConnected = useCallback(
    chainType => {
      if (!chainType) return false
      if (isGnosisConnected && chainType === ChainType.EVM) {
        return true
      }
      const connectedWallet = connectedWalletsByChainType[chainType]

      return !!connectedWallet?.wallet && !!connectedWallet?.address
    },
    [connectedWalletsByChainType, isGnosisConnected]
  )

  /**
   * Event listener for QR-based wallets connection
   *
   * QR-based wallets will fire an event when QR data for connection is available
   * Then this data is attached to the current connecting wallet state
   */
  useEffect(() => {
    const onQrWalletConnectData = event => {
      const currentState = useWalletStore.getState().connectingWalletState
      setConnectingWallet({
        ...currentState,
        qrData: {
          matrix: event.detail.matrix,
          deepLinkUrl: event.detail.deepLinkUrl
        }
      })
    }

    WidgetEvents.getInstance().listenToWidget('qrCodeGeneratedForConnect', onQrWalletConnectData)

    return () => {
      WidgetEvents.getInstance().removeWidgetListener('qrCodeGeneratedForConnect', onQrWalletConnectData)
    }
  }, [setConnectingWallet])

  return {
    wallets,
    connectedWallets,
    connectedWalletsByChainType,
    connectedAddresses,
    connectingWalletState,
    disconnectWallet,
    connectWallet: connectWalletMutation.mutateAsync,
    cancelConnectWallet,
    isWalletConnected,
    isChainTypeConnected
  }
}
