import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import axios from 'axios'
import { useMemo } from 'react'
import { chainIdToChain, parseUnits } from 'src/components/utils/uniswap'
import { ZERO_ADDRESS } from 'src/configs/constant'
import { useAddLiquidity } from './useAddLiquidity'

export const useZapInfo = (
  pool,
  protocol,
  debounceTickUpper,
  debounceTickLower,
  positionId,
  tokensForZap,
  isLoadingInfo,
  errorNoneForFetch,
  setZapApiError
) => {
  const { address: account } = useAccount()
  const { chainId } = useAddLiquidity()

  const formattedTokensIn = useMemo(() => {
    return tokensForZap
      .filter(token => Number.parseFloat(token.amount) != 0)
      .map(token => token.address)
      .join(',')
  }, [tokensForZap])

  const formattedAmountsInWeis = useMemo(() => {
    return tokensForZap
      .filter(token => Number.parseFloat(token.amount) != 0)
      .map(token => parseUnits(token?.amount || '0', token?.decimals).toString())
      .join(',')
  }, [tokensForZap])

  const { data: zapInfo } = useQuery({
    queryKey: ['zapInfo', pool?.address, protocol, pool?.token0.address, pool?.token1.address, pool?.swapFee],
    queryFn: async () => {
      const params = {
        dex: protocol,
        'pool.id': pool.address,
        'pool.token0': pool.token0.address,
        'pool.token1': pool.token1.address,
        'pool.fee': pool.swapFee * 1e4,
        ...(pool.type == 'v3' && !!debounceTickUpper && !!debounceTickLower && !positionId
          ? {
              'position.tickUpper': debounceTickUpper,
              'position.tickLower': debounceTickLower
            }
          : { 'position.id': account || ZERO_ADDRESS }),
        tokensIn: formattedTokensIn,
        amountsIn: formattedAmountsInWeis,
        slippage: 50,
        ...(!!positionId && positionId.split('-').length === 2 ? { 'position.id': positionId.split('-')[1] } : {})
      }
      let tmp = ''
      Object.keys(params).forEach(key => {
        tmp = `${tmp}&${key}=${params[key]}`
      })
      try {
        const { data: res } = await axios.get(
          `${process.env.NEXT_PUBLIC_ZAP_API}/${chainIdToChain[chainId]}/api/v1/in/route?${tmp.slice(1)}`,
          {
            headers: {
              'X-Client-Id': 'KyberSwap-Earn'
            }
          }
        )

        if (res.data) {
          setZapApiError('')
          return res.data
        } else {
          setZapApiError(res.message || 'Something went wrong')
          return {}
        }
      } catch (e) {
        setZapApiError(e.message || 'Something went wrong')

        return {}
      }
    },
    refetchInterval: 15000,
    enabled:
      (pool?.type !== 'v3' || !!positionId || (!!debounceTickLower && !!debounceTickUpper)) &&
      !isLoadingInfo &&
      errorNoneForFetch &&
      !!formattedTokensIn &&
      !!formattedAmountsInWeis &&
      formattedAmountsInWeis !== '0' &&
      formattedAmountsInWeis !== '00'
  })

  return zapInfo
}
