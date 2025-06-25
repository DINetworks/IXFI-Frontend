import { SquidDataType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { CHAIN_IDS } from '../../core'
import { useDepositAddressStore } from '../store/useDepositAddressStore'
import { useSwapStore } from '../store/useSwapStore'
import { useSwap } from './useSwap'

export function useDepositAddress(squidRoute) {
  const { isEnabled, depositAddress } = useDepositAddressStore()

  const { setDeposit, toggleDepositFlow, deposit } = useDepositAddressStore()
  const { squid } = useSwapStore()
  const { fromChain } = useSwap()

  const isAvailableAsPaymentMethod = useMemo(() => {
    if (!fromChain?.chainId) return false

    const chainsSupportingDepositAddress = [CHAIN_IDS.BITCOIN, CHAIN_IDS.SOLANA]
    return chainsSupportingDepositAddress.includes(fromChain.chainId)
  }, [fromChain?.chainId])

  const swapWillGenerateDepositAddress = useMemo(() => {
    return squidRoute?.transactionRequest?.type === SquidDataType.ChainflipDepositAddress
  }, [squidRoute?.transactionRequest?.type])

  const enable = useCallback(() => {
    toggleDepositFlow(true)
  }, [toggleDepositFlow])

  const disable = useCallback(() => {
    toggleDepositFlow(false)
  }, [toggleDepositFlow])

  const closeDepositChannel = useCallback(() => {
    toggleDepositFlow(false)
    setDeposit(null)
  }, [toggleDepositFlow, setDeposit])

  const getRouteWithDeposit = useMutation({
    mutationFn: async ({ route }) => {
      if (!squid) throw new Error('Squid SDK not initialized')

      const depositAddressResponse = await squid.executeRoute({
        signer: {},
        route
      })
      setDeposit(depositAddressResponse)
      return {
        depositAddress: depositAddressResponse
      }
    }
  })

  return {
    isEnabled,
    isAvailableAsPaymentMethod,
    swapWillGenerateDepositAddress,
    enable,
    disable,
    getRouteWithDeposit,
    depositAddress,
    closeDepositChannel,
    depositData: deposit
  }
}
