import { useCallback, useEffect, useRef } from 'react'
import { useConnect } from 'wagmi'
import { EvmPriorityConnectors } from '../../core/constants'
import { useEvmContext } from '../../core/providers/EvmProvider'
import { useSolanaContext } from '../../core/providers/SolanaProvider'
import { useSuiContext } from '../../core/providers/SuiProvider'
import { useXrplContext } from '../../core/providers/XrplProvider'
import { isXamanXAppContext } from '../../services/external/xaman'
import { useSquidChains } from '../chains/useSquidChains'
import { useConfigStore } from '../store/useSwapStore'
import { useWallet } from './useWallet'

const EVM_PRIORITY_CONNECTOR_IDS = [EvmPriorityConnectors.Safe]

/**
 * Auto connect to Safe provider if it's present
 * Safe will always be the priority connector
 * Because if it's present, this means the user is on a Safe app iframe
 */
export const useAutoConnect = () => {
  const { connect: evmConnect, connectors: evmConnectors } = useConnect()
  const { chains } = useSquidChains()
  const { isInitialized } = useConfigStore()
  const hasAttemptedReconnect = useRef(false)
  const { autoConnectEvm } = useEvmContext()
  const { autoConnectSolana } = useSolanaContext()
  const { autoConnectSui } = useSuiContext()
  const { autoConnectXrpl, wallets: xrplWallets } = useXrplContext()
  const { connectWallet } = useWallet()

  const autoConnect = useCallback(async () => {
    const queryParameters = new URLSearchParams(window.location.search)
    // TODO: At the moment gnosis was published without the embed parameter in the manifest,
    // but we should ask gnosis to change our app url to https://app.squidrouter.com/?embed="safe"
    // So we could remove the priority connector array and just use the embed parameter
    const embedType = queryParameters.get('embed')
    let evmPriorityConnector

    if (embedType) {
      evmPriorityConnector = evmConnectors.find(c => c.id === embedType)
    } else {
      for await (const c of evmConnectors) {
        if (EVM_PRIORITY_CONNECTOR_IDS.includes(c.id)) {
          if (await c.isAuthorized()) {
            evmPriorityConnector = c
            break
          }
        }
      }
    }

    if (evmPriorityConnector) {
      evmConnect({ connector: evmPriorityConnector })
    } else if (isXamanXAppContext()) {
      const xamanXAppWallet = xrplWallets.find(w => w.connectorId === 'xaman-xapp')
      if (xamanXAppWallet) {
        connectWallet({ wallet: xamanXAppWallet })
      }
    } else {
      if (chains.length > 0 && isInitialized && !hasAttemptedReconnect.current) {
        try {
          autoConnectEvm()
          autoConnectSolana()
          autoConnectSui()
          autoConnectXrpl()
        } catch (error) {
          console.error('Error auto connecting wallet:', error)
        } finally {
          hasAttemptedReconnect.current = true
        }
      }
    }
  }, [
    evmConnectors,
    evmConnect,
    chains.length,
    isInitialized,
    autoConnectEvm,
    autoConnectSolana,
    autoConnectSui,
    autoConnectXrpl,
    connectWallet,
    xrplWallets
  ])

  useEffect(() => {
    autoConnect()
  }, [autoConnect])

  return { autoConnect }
}
