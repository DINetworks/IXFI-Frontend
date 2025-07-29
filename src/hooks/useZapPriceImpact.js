import { useMemo } from 'react'
import { formatWei, getPriceImpact } from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'

export const useZapPriceImpact = (zapInfo, pool, tokensForZap, chainId, feeInfo) => {
  const aggregatorSwapInfo = zapInfo?.zapDetails?.actions.find(item => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP')

  const poolSwapInfo = zapInfo?.zapDetails?.actions.find(item => item.type === 'ACTION_TYPE_POOL_SWAP')

  const piRes = getPriceImpact(
    zapInfo?.zapDetails?.priceImpact,
    'Zap Impact',
    zapInfo?.zapDetails?.suggestedSlippage || 100
  )

  const priceImpact = useMemo(() => {
    const aggregatorSwapPi =
      aggregatorSwapInfo?.aggregatorSwap?.swaps?.map(item => {
        const pi2 =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        return getPriceImpact(pi2, 'Swap Price Impact', zapInfo?.zapDetails.suggestedSlippage || 100)
      }) || []

    const poolSwapPi =
      poolSwapInfo?.poolSwap?.swaps?.map(item => {
        const pi2 =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        return getPriceImpact(pi2, 'Swap Price Impact', zapInfo?.zapDetails.suggestedSlippage || 100)
      }) || []
    const swapPiHigh = !!aggregatorSwapPi.concat(poolSwapPi).find(item => item.level === 'HIGH')

    const swapPiVeryHigh = !!aggregatorSwapPi.concat(poolSwapPi).find(item => item.level === 'VERY_HIGH')

    const piVeryHigh = (zapInfo && ['VERY_HIGH', 'INVALID'].includes(piRes.level)) || swapPiVeryHigh
    const piHigh = (zapInfo && piRes.level === 'HIGH') || swapPiHigh
    return { piVeryHigh, piHigh }
  }, [zapInfo])

  const swapPi = useMemo(() => {
    if (!pool) return []

    const tokens = [...tokensForZap, pool.token0, pool.token1, NETWORK_INFO[chainId].wrappedToken]

    const parsedAggregatorSwapInfo =
      aggregatorSwapInfo?.aggregatorSwap?.swaps?.map(item => {
        const tokenIn = tokens.find(token3 => token3.address.toLowerCase() === item.tokenIn.address.toLowerCase())

        const tokenOut = tokens.find(token3 => token3.address.toLowerCase() === item.tokenOut.address.toLowerCase())

        const amountIn = formatWei(item.tokenIn.amount, tokenIn?.decimals).replace(/,/g, '')

        const amountOut = formatWei(item.tokenOut.amount, tokenOut?.decimals).replace(/,/g, '')

        const pi =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100

        const piRes2 = getPriceImpact(pi, 'Swap Price Impact', zapInfo?.zapDetails.suggestedSlippage || 100)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes: piRes2
        }
      }) || []

    const parsedPoolSwapInfo =
      poolSwapInfo?.poolSwap?.swaps?.map(item => {
        const tokenIn = tokens.find(token3 => token3.address.toLowerCase() === item.tokenIn.address.toLowerCase())

        const tokenOut = tokens.find(token3 => token3.address.toLowerCase() === item.tokenOut.address.toLowerCase())

        const amountIn = formatWei(item.tokenIn.amount, tokenIn?.decimals).replace(/,/g, '')

        const amountOut = formatWei(item.tokenOut.amount, tokenOut?.decimals).replace(/,/g, '')

        const pi =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100

        const piRes2 = getPriceImpact(pi, 'Swap Price Impact', zapInfo?.zapDetails.suggestedSlippage || 100)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes: piRes2
        }
      }) || []
    return parsedAggregatorSwapInfo.concat(parsedPoolSwapInfo)
  }, [zapInfo?.zapDetails?.actions, pool, tokensForZap, chainId, feeInfo])

  const swapPiRes = useMemo(() => {
    const invalidRes = swapPi.find(item => item.piRes.level === 'INVALID')
    if (invalidRes) return invalidRes
    const highRes = swapPi.find(item => item.piRes.level === 'HIGH')
    if (highRes) return highRes

    const veryHighRes = swapPi.find(item => item.piRes.level === 'HIGH')
    if (veryHighRes) return veryHighRes
    return { piRes: { level: 'NORMAL', msg: '' } }
  }, [swapPi])

  return { aggregatorSwapInfo, poolSwapInfo, priceImpact, piRes, swapPi, swapPiRes }
}
