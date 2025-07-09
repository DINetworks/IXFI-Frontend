import { useMemo } from 'react'
import { formatUnits, getPriceImpact } from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'

export const useZapOutDerivedInfo = ({ zapDetails, pool, chainId, zapOutToken, isLoadingInfo }) => {
  const actionRefund = zapDetails?.actions.find(item => item.type === 'ACTION_TYPE_REFUND')

  const amountOut = BigInt(actionRefund?.refund.tokens[0].amount || 0)

  const amountOutUsd = Number(actionRefund?.refund.tokens[0].amountUsd || 0)

  const feeInfo = zapDetails?.actions.find(item => item.type === 'ACTION_TYPE_PROTOCOL_FEE')

  const piRes = getPriceImpact(zapDetails?.priceImpact, 'Zap Impact', zapDetails?.suggestedSlippage || 100)

  const suggestedSlippage = zapDetails?.suggestedSlippage || 100

  const zapFee = ((feeInfo?.protocolFee.pcm || 0) / 1e5) * 100

  const tokensIn = useMemo(
    () => (isLoadingInfo || !pool || !zapOutToken ? [] : [pool.token0, pool.token1, zapOutToken]),
    [pool, zapOutToken]
  )

  const swapPi = useMemo(() => {
    const aggregatorSwapInfo = zapDetails?.actions.find(item => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP')

    const poolSwapInfo = zapDetails?.actions.find(item => item.type === 'ACTION_TYPE_POOL_SWAP')

    if (isLoadingInfo || !pool || !chainId) return []

    console.log('chainId', chainId)
    const tokens = [...tokensIn, NETWORK_INFO[chainId].wrappedToken]

    const parsedAggregatorSwapInfo =
      aggregatorSwapInfo?.aggregatorSwap?.swaps?.map(item => {
        const tokenIn = tokens.find(token3 => token3.address.toLowerCase() === item.tokenIn.address.toLowerCase())

        const tokenOut = tokens.find(token3 => token3.address.toLowerCase() === item.tokenOut.address.toLowerCase())

        const amountIn = formatUnits(item.tokenIn.amount, tokenIn?.decimals)
        const amountOut = formatUnits(item.tokenOut.amount, tokenOut?.decimals)
        const pi =
          parseFloat(item.tokenIn.amountUsd) === 0 || parseFloat(item.tokenOut.amountUsd) === 0
            ? null
            : ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
                parseFloat(item.tokenIn.amountUsd)) *
              100

        const piRes = getPriceImpact(pi, 'Swap Price Impact', zapDetails?.suggestedSlippage || 100)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes
        }
      }) || []

    const parsedPoolSwapInfo =
      poolSwapInfo?.poolSwap?.swaps?.map(item => {
        const tokenIn = tokens.find(token3 => token3.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find(token3 => token3.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        const amountIn = formatUnits(item.tokenIn.amount, tokenIn?.decimals)
        const amountOut = formatUnits(item.tokenOut.amount, tokenOut?.decimals)
        const pi =
          parseFloat(item.tokenIn.amountUsd) === 0 || parseFloat(item.tokenOut.amountUsd) === 0
            ? 0
            : ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
                parseFloat(item.tokenIn.amountUsd)) *
              100
        const piRes = getPriceImpact(pi, 'Swap Price Impact', zapDetails?.suggestedSlippage || 100)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes
        }
      }) || []

    return parsedAggregatorSwapInfo.concat(parsedPoolSwapInfo)
  }, [zapDetails?.actions, pool, tokensIn, chainId, feeInfo])

  const swapPiRes = useMemo(() => {
    const invalidRes = swapPi.find(item => item.piRes.level === 'INVALID')

    if (invalidRes) return invalidRes
    const highRes = swapPi.find(item => item.piRes.level === 'HIGH')

    if (highRes) return highRes
    const veryHighRes = swapPi.find(item => item.piRes.level === 'VERY_HIGH')
    if (veryHighRes) return veryHighRes
    return { piRes: { level: 'NORMAL', msg: '' } }
  }, [swapPi])

  const zapPiRes = getPriceImpact(zapDetails?.priceImpact, 'Zap Impact', zapDetails?.suggestedSlippage || 100)

  return {
    actionRefund,
    amountOut,
    amountOutUsd,
    feeInfo,
    piRes,
    suggestedSlippage,
    zapFee,
    swapPi,
    swapPiRes,
    zapPiRes
  }
}
