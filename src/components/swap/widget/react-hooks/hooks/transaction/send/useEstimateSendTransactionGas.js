import { useMemo } from 'react'
import { chainTypeToNativeTokenAddressMap } from '../../../core/constants'
import { useNativeBalance } from '../../../hooks/tokens/useNativeBalance'
import { parseToBigInt } from '../../../services'
import { calculateMinAmountValueWarnMsg } from '../../../services/internal/estimateService'
import { useSendTransactionGas } from './useSendTransactionGas'

export function useEstimateSendTransaction({ chain, token, amount, balance, from }) {
  const { data: estimatedGas = BigInt(0), isLoading } = useSendTransactionGas({
    chain,
    token,
    from
  })

  const { nativeBalance } = useNativeBalance(chain)
  const isNativeBalanceEnoughToPayGasFees = useMemo(() => {
    if (!nativeBalance?.value || !amount || !token?.decimals) {
      return false
    }
    const isTokenNative = token.address.toLowerCase() === chainTypeToNativeTokenAddressMap[token.type].toLowerCase()
    if (isTokenNative) {
      return parseToBigInt(amount, token.decimals) + estimatedGas <= nativeBalance.value
    }

    return estimatedGas <= nativeBalance.value
  }, [amount, estimatedGas, nativeBalance?.value, token])

  const isBalanceEnough = useMemo(() => {
    if (token?.decimals == null || !balance || !amount) return false

    return parseToBigInt(balance, token.decimals) >= parseToBigInt(amount, token.decimals)
  }, [amount, balance, token?.decimals])

  const minAmountValueWarnMsg = useMemo(() => {
    if (!token?.address || !nativeBalance?.value || !estimatedGas) return undefined
    const isFromTokenNative = token.address.toLowerCase() === chainTypeToNativeTokenAddressMap[token.type].toLowerCase()

    return calculateMinAmountValueWarnMsg({
      isFromTokenNative,
      nativeTokenBalanceFromChainWei: nativeBalance.value,
      sourceChainNativeTokenDecimals: nativeBalance.decimals,
      totalFeesInNativeTokenPlusRatio: estimatedGas
    })
  }, [estimatedGas, nativeBalance?.decimals, nativeBalance?.value, token?.address, token?.type])

  return {
    estimatedGas,
    isBalanceEnough,
    isLoading,
    isNativeBalanceEnoughToPayGasFees,
    minAmountValueWarnMsg
  }
}
