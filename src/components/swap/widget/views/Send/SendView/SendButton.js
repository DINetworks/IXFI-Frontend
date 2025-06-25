import {
  useConfigStore,
  useEstimateSendTransaction,
  useMultiChainBalance,
  useMultiChainWallet,
  useNativeTokenForChain,
  useSendTransaction,
  useSquidChains
} from 'src/components/swap/widget/react-hooks'
import { Button } from '@0xsquid/ui'
import { useMemo } from 'react'
import { routes } from '../../../core/routes'
import { useSwapRouter } from '../../../hooks/useSwapRouter'
import { useXrplConditions } from '../../../hooks/useXrplConditions'
import { useSendStore } from '../../../store/useSendStore'

export function SendButton() {
  const { findChain } = useSquidChains('from')
  const token = useSendStore(store => store.token)
  const chain = findChain(token?.chainId)
  const destinationAddress = useSendStore(store => store.toAddress)
  const amount = useSendStore(store => store.amount)
  const isInitialized = useConfigStore(store => store.isInitialized)
  const isLoading = !isInitialized

  const { connectedAddress, wallet, networkConnected, checkNetworkAndSwitch } = useMultiChainWallet(chain)

  const { balance } = useMultiChainBalance({
    chain,
    token,
    userAddress: connectedAddress.address
  })

  const { nativeToken } = useNativeTokenForChain(chain)

  const { sendTransaction } = useSendTransaction({
    amount,
    chain,
    to: destinationAddress?.address,
    token
  })

  const { isBalanceEnough, isNativeBalanceEnoughToPayGasFees } = useEstimateSendTransaction({
    amount,
    balance,
    chain,
    token,
    from: connectedAddress.address
  })

  const { switchRoute } = useSwapRouter()

  const isMissingSendParams = !token || !chain || !nativeToken

  const { buttonState: xrplButtonState } = useXrplConditions({
    destinationAddress: destinationAddress?.address,
    chain,
    token,
    amount,
    // this will always be false when sending tokens
    // since the only connected wallet is the one sending tokens
    isDestAddressConnected: false
  })

  const { label, onClick, disabled } = useMemo(() => {
    if (!networkConnected) {
      return {
        label: 'Connect wallet',
        onClick: () => {
          switchRoute(routes.wallets, {
            chainId: chain?.chainId
          })
        }
      }
    }

    if (isMissingSendParams) {
      return {
        label: 'Select token',
        disabled: true
      }
    }

    if (!destinationAddress) {
      return {
        label: 'Add recipient',
        onClick: () => {
          switchRoute(routes.destination, {
            isSendView: true,
            chainId: chain?.chainId
          })
        }
      }
    }

    if (Number(amount || 0) <= 0) {
      return {
        label: 'Enter amount',
        disabled: true
      }
    }

    if (!isBalanceEnough) {
      return {
        label: 'Insufficient balance',
        disabled: true
      }
    }

    if (!isNativeBalanceEnoughToPayGasFees) {
      return {
        label: `Not enough ${nativeToken.symbol} for gas`,
        disabled: true
      }
    }

    if (xrplButtonState.shouldBlock) {
      return {
        label: xrplButtonState.label ?? 'Account not activated',
        ...xrplButtonState
      }
    }

    return {
      label: 'Send',
      onClick: async () => {
        const rightChain = await checkNetworkAndSwitch()
        if (rightChain) {
          sendTransaction()
          switchRoute(wallet?.isQrWallet ? routes.signSendTransactionQr : routes.sendInProgress)
        }
      }
    }
  }, [
    amount,
    chain?.chainId,
    checkNetworkAndSwitch,
    switchRoute,
    destinationAddress,
    isBalanceEnough,
    isMissingSendParams,
    isNativeBalanceEnoughToPayGasFees,
    nativeToken?.symbol,
    networkConnected,
    wallet?.isQrWallet,
    sendTransaction,
    xrplButtonState
  ])

  return (
    <div className='tw-flex tw-p-squid-m tw-flex-col tw-items-start tw-gap-squid-xs tw-self-stretch'>
      <Button
        variant={isLoading ? 'tertiary' : 'primary'}
        size='lg'
        label={label}
        disabled={disabled}
        onClick={onClick}
        isLoading={isLoading}
      />
    </div>
  )
}
