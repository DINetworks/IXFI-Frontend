import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import {
  calculateGasMargin,
  chainIdToChain,
  estimateGas,
  formatUnits,
  getCurrentGasPrice,
  isTransactionSuccessful
} from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'
import { useAddLiquidity } from './useAddLiquidity'
import { useZapAction } from './useZapAction'
import { useTokenPrices } from './useTokenPrices'
import { onSubmitTx } from 'src/wallet/utils'

export const useZapTransaction = () => {
  const { address: account, chain } = useAccount()
  const { protocol, chainId, deadline } = useAddLiquidity()
  const { zapInfo } = useZapAction()
  const { fetchPrices } = useTokenPrices({ addresses: [], chainId })

  const [txHash, setTxHash] = useState('')
  const [attempTx, setAttempTx] = useState(false)
  const [txError, setTxError] = useState(null)
  const [txStatus, setTxStatus] = useState('')
  const [gasUsd, setGasUsd] = useState(null)

  useEffect(() => {
    if (txHash) {
      const i = setInterval(() => {
        isTransactionSuccessful(NETWORK_INFO[chainId].defaultRpc, txHash).then(res => {
          if (!res) return
          if (res.status) {
            setTxStatus('success')
          } else setTxStatus('failed')
        })
      }, 10000)

      return () => {
        clearInterval(i)
      }
    }
  }, [chainId, txHash])

  const rpcUrl = NETWORK_INFO[chainId]?.defaultRpc

  useEffect(() => {
    if (!!account && !!chainId && deadline > Date.now() + 60000 && rpcUrl && !!zapInfo?.route)
      fetch(`${process.env.NEXT_PUBLIC_ZAP_API}/${chainIdToChain[chainId]}/api/v1/in/route/build`, {
        method: 'POST',
        body: JSON.stringify({
          sender: account,
          recipient: account,
          route: zapInfo.route,
          deadline,
          source: 'KyberSwap-Earn'
        })
      })
        .then(res => res.json())
        .then(async res => {
          const { data } = res || {}
          if (data.callData && account) {
            const txData = {
              from: account,
              to: data.routerAddress,
              data: data.callData,
              value: `0x${BigInt(data.value).toString(16)}`
            }
            try {
              const wethAddress = NETWORK_INFO[chainId].wrappedToken.address.toLowerCase()

              const [gasEstimation, nativeTokenPrice, gasPrice] = await Promise.all([
                estimateGas(rpcUrl, txData),
                fetchPrices([wethAddress])
                  .then(prices => {
                    return prices[wethAddress]?.PriceBuy || 0
                  })
                  .catch(() => 0),
                getCurrentGasPrice(rpcUrl)
              ])
              const gasUsd2 = +formatUnits(gasPrice, 18) * +gasEstimation.toString() * nativeTokenPrice
              setGasUsd(gasUsd2)
            } catch (e) {
              console.log('Estimate gas failed', e)
            }
          }
        })
  }, [account, chainId, deadline, fetchPrices, rpcUrl, zapInfo?.route])

  const handleZapClick = async () => {
    setAttempTx(true)
    setTxHash('')
    setTxError(null)
    fetch(`${process.env.NEXT_PUBLIC_ZAP_API}/${chainIdToChain[chainId]}/api/v1/in/route/build`, {
      method: 'POST',
      body: JSON.stringify({
        sender: account,
        recipient: account,
        route: zapInfo.route,
        deadline,
        source: 'KyberSwap-Earn'
      })
    })
      .then(res => res.json())
      .then(async res => {
        const { data } = res || {}
        if (data.callData && account) {
          const txData = {
            from: account,
            to: data.routerAddress,
            data: data.callData,
            value: `0x${BigInt(data.value).toString(16)}`
          }

          try {
            const gasEstimation = await estimateGas(rpcUrl, txData)

            const txHash2 = await onSubmitTx(account, chain, {
              ...txData,
              gasLimit: calculateGasMargin(gasEstimation)
            })
            setTxHash(txHash2)
          } catch (e) {
            setAttempTx(false)
            setTxError(e)
          }
        }
      })
      .finally(() => setAttempTx(false))
  }

  return {
    txHash,
    attempTx,
    txError,
    txStatus,
    gasUsd,
    handleZapClick,
    setTxError,
    setShowErrorDetail: () => {}
  }
}
