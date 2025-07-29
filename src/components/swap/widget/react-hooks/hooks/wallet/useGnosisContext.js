import SafeAppsSDK, { TransactionStatus as GnosisTransactionStatus } from '@safe-global/safe-apps-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useSwapRoutePersistStore } from '../store/useSwapStore'
import { useSwap } from '../swap/useSwap'
import { useMultiChainWallet } from './useMultiChainWallet'

export const useGnosisContext = () => {
  const { connector, isConnected, address } = useAccount()
  const [isGnosisContext, setIsGnosisContext] = useState(false)
  const [gnosisSafeInfo, setGnosisSafeInfo] = useState()

  /**
   * Method that will be used to send transaction
   * TODO: could have loaded the sdk when app load and stored globally
   */
  const getGnosisSafeContext = useCallback(async () => {
    const appsSdk = new SafeAppsSDK()
    const safe = await appsSdk.safe.getInfo()

    const isSafeContext = safe.chainId !== undefined && safe.safeAddress !== undefined && connector?.id === 'safe'
    setGnosisSafeInfo(safe)
    setIsGnosisContext(isSafeContext)
    if (isSafeContext) return appsSdk
    return undefined
  }, [connector])
  useEffect(() => {
    getGnosisSafeContext()
  }, [getGnosisSafeContext])

  /**
   * There's a specific way to get the transaction hash for the safe connector
   * Using then initial hash received by the transaction, we can get the real hash
   * @param hashReceived
   * @returns
   */
  const getGnosisTransactionHash = async initialHash => {
    const safeSdk = await getGnosisSafeContext()
    const tx = await safeSdk?.txs.getBySafeTxHash(initialHash)
    const status = tx?.txStatus
    if (
      status !== GnosisTransactionStatus.FAILED &&
      status !== GnosisTransactionStatus.SUCCESS &&
      status !== GnosisTransactionStatus.CANCELLED
    ) {
      // Workaround, Wait 2 seconds before checking the gnosis status again
      // TODO: There might be a better way to do this
      // eslint-disable-next-line no-promise-executor-return
      await new Promise(res => setTimeout(res, 2000))
      return getGnosisTransactionHash(initialHash)
    }
    return tx?.txHash ?? initialHash
  }
  const isGnosisConnected = connector?.id === 'safe' && isConnected
  return {
    gnosisSafeInfo,
    isGnosisContext,
    getGnosisTransactionHash,
    isGnosisConnected,
    gnosisAddress: isGnosisConnected ? address : undefined
  }
}

export const useIsSameAddressAndGnosisContext = () => {
  const { isGnosisContext } = useGnosisContext()
  const { fromChain } = useSwap()
  const { connectedAddress: sourceAddress } = useMultiChainWallet(fromChain)
  const destinationAddress = useSwapRoutePersistStore(store => store.swapRoute?.destinationAddress?.address)

  /**
   * Check if we are in a Gnosis Safe Context
   * And if source wallet address = destination address
   * If destinationAddress is not defined, it means that it's the same from the source
   */
  const isSameAddressAndGnosisContext = useMemo(() => {
    const destAddressSameAsSource = sourceAddress === destinationAddress || destinationAddress === undefined
    return isGnosisContext && destAddressSameAsSource
  }, [sourceAddress, destinationAddress, isGnosisContext])
  return {
    isSameAddressAndGnosisContext
  }
}
