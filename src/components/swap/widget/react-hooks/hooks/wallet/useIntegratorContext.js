import { useMemo } from 'react'
import { EvmPriorityConnectors } from '../../core/constants'
import { useGnosisContext } from './useGnosisContext'

export const useIntegratorContext = () => {
  const { isGnosisContext } = useGnosisContext()

  /**
   * Check if the wallet is handled externally
   * Example: Ledger or Gnosis Safe
   * Either by the embed parameter or by Gnosis context
   */
  const walletHandledExternally = useMemo(() => {
    const embedTypesHavingExternalWallet = [EvmPriorityConnectors.LedgerLive, EvmPriorityConnectors.Safe]

    const queryParameters = new URLSearchParams(window.location.search)
    const embedType = queryParameters.get('embed')

    return isGnosisContext || embedTypesHavingExternalWallet.includes(embedType)
  }, [isGnosisContext])

  const isEmbed = useMemo(() => {
    const queryParameters = new URLSearchParams(window.location.search)
    const embedType = queryParameters.get('embed')

    return !!embedType
  }, [])

  /**
   * It's important to know if we can use certain features such as
   * the clipboard reading
   */
  const widgetInIframe = useMemo(() => {
    try {
      return window.self !== window.top
    } catch (e) {
      return false
    }
  }, [])

  return { walletHandledExternally, isEmbed, widgetInIframe }
}
