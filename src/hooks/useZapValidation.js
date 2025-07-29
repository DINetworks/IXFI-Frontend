import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { ERROR_MESSAGE, countDecimals, formatUnits } from 'src/components/utils/uniswap'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { useAddLiquidity } from './useAddLiquidity'
import useTokenBalances from './useTokenBalances'
import { useZapTokenList } from './useZapTokenList'

export const useZapValidation = () => {
  const { address: account, chainId: networkChainId } = useAccount()
  const { isLoadingInfo, chainId, pool, tickLower, tickUpper, tokensForZap, zapApiError } = useAddLiquidity()
  const { allTokens } = useZapTokenList()

  const { balances } = useTokenBalances(chainId, allTokens?.map(item => item.address) || [], account)

  const error = useMemo(() => {
    if (!isLoadingInfo) return ''
    if (!account) return ERROR_MESSAGE.CONNECT_WALLET
    if (chainId !== networkChainId) return ERROR_MESSAGE.WRONG_NETWORK
    if (!tokensForZap.length) return ERROR_MESSAGE.SELECT_TOKEN_IN
    if (pool?.type == 'v3') {
      if (tickLower === null) return ERROR_MESSAGE.ENTER_MIN_PRICE
      if (tickUpper === null) return ERROR_MESSAGE.ENTER_MAX_PRICE
      if (tickLower >= tickUpper) return ERROR_MESSAGE.INVALID_PRICE_RANGE
    }

    try {
      for (let i = 0; i < tokensForZap.length; i++) {
        const token = tokensForZap[i]

        const tokenAddress =
          token?.address?.toString() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()
            ? NATIVE_EVM_TOKEN_ADDRESS
            : token?.address.toLowerCase()

        const balance = formatUnits(balances[tokenAddress]?.toString() || '0', token?.decimals)
        if (countDecimals(tokensForZap[i]?.amount) > token?.decimals) return ERROR_MESSAGE.INVALID_INPUT_AMOUNT
        if (parseFloat(tokensForZap[i]?.amount) > parseFloat(balance)) return ERROR_MESSAGE.INSUFFICIENT_BALANCE
      }
    } catch (e) {
      return ERROR_MESSAGE.INVALID_INPUT_AMOUNT
    }

    if (zapApiError) return zapApiError

    return ''
  }, [account, chainId, networkChainId, tokensForZap, tickLower, tickUpper, zapApiError, balances, pool, isLoadingInfo])

  const errorNoneForFetch =
    !error ||
    error === zapApiError ||
    error === ERROR_MESSAGE.INSUFFICIENT_BALANCE ||
    error === ERROR_MESSAGE.CONNECT_WALLET ||
    error === ERROR_MESSAGE.WRONG_NETWORK

  return { error, errorNoneForFetch, balances }
}
