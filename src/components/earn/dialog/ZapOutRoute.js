import React, { useMemo } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import { formatDisplayNumber } from 'src/components/utils/uniswap'
import { useAddLiquidity, useZapAction } from 'src/hooks'
import { DEX_INFO, NETWORK_INFO } from 'src/configs/protocol'
import { formatUnits } from 'ethers'
import { FullCenterBox } from 'src/components/base/grid'

function ZapOutRoute() {
  const { chainId, pool, protocol, isLoadingInfo } = useAddLiquidity()
  const { zapOutInfo, zapOutToken } = useZapAction()

  const actionRefund = zapOutInfo?.zapDetails.actions.find(item => item.type === 'ACTION_TYPE_REFUND')
  const amountOut = BigInt(actionRefund?.refund.tokens[0].amount || 0)

  const actionRemoveLiq = zapOutInfo?.zapDetails.actions.find(item => item.type === 'ACTION_TYPE_REMOVE_LIQUIDITY')
  const { tokens, fees } = actionRemoveLiq?.removeLiquidity || {}

  const poolTokens = isLoadingInfo ? [] : [pool.token0, pool.token1]

  const token0 = poolTokens.find(item => item.address.toLowerCase() === tokens?.[0]?.address.toLowerCase())
  const token1 = poolTokens.find(item => item.address.toLowerCase() === tokens?.[1]?.address.toLowerCase())

  const amountToken0 = BigInt(tokens?.[0]?.amount || 0)
  const amountToken1 = BigInt(tokens?.[1]?.amount || 0)

  const feeToken0 = poolTokens.find(item => item.address.toLowerCase() === fees?.[0]?.address.toLowerCase())
  const feeToken1 = poolTokens.find(item => item.address.toLowerCase() === fees?.[1]?.address.toLowerCase())

  const feeAmount0 = BigInt(fees?.[0]?.amount || 0)
  const feeAmount1 = BigInt(fees?.[1]?.amount || 0)

  const swapAction = zapOutInfo?.zapDetails.actions.find(item => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP')

  const amountIns = []
  swapAction?.aggregatorSwap?.swaps.forEach(item => {
    const token3 = poolTokens.find(pt => pt.address.toLowerCase() === item.tokenIn.address.toLowerCase())
    const amount = BigInt(item.tokenIn.amount)
    if (token3) {
      amountIns.push({ token: token3, amount })
    }
  })

  const dexNameObj = DEX_INFO[protocol].name
  const dexName = typeof dexNameObj === 'string' ? dexNameObj : dexNameObj[chainId]

  const swapInfo = useMemo(() => {
    const aggregatorSwapInfo = zapOutInfo?.zapDetails.actions.find(item => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP')
    const poolSwapInfo = zapOutInfo?.zapDetails.actions.find(item => item.type === 'ACTION_TYPE_POOL_SWAP')

    if (isLoadingInfo) return []

    const tokens2 = [pool.token0, pool.token1, NETWORK_INFO[chainId].wrappedToken]
    if (zapOutToken) tokens2.push(zapOutToken)

    const parsedAggregator =
      aggregatorSwapInfo?.aggregatorSwap?.swaps?.map(item => {
        const tokenIn = tokens2.find(t => t.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens2.find(t => t.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        return {
          tokenInsymbol: tokenIn?.symbol || '--',
          zapOutTokensymbol: tokenOut?.symbol || '--',
          amountIn: formatUnits(item.tokenIn.amount, tokenIn?.decimals),
          amountOut: formatUnits(item.tokenOut.amount, tokenOut?.decimals),
          pool: 'KyberSwap'
        }
      }) || []

    const parsedPool =
      poolSwapInfo?.poolSwap?.swaps?.map(item => {
        const tokenIn = tokens2.find(t => t.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens2.find(t => t.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        return {
          tokenInsymbol: tokenIn?.symbol || '--',
          zapOutTokensymbol: tokenOut?.symbol || '--',
          amountIn: formatUnits(item.tokenIn.amount, tokenIn?.decimals),
          amountOut: formatUnits(item.tokenOut.amount, tokenOut?.decimals),
          pool: `${dexName} Pool`
        }
      }) || []

    return parsedAggregator.concat(parsedPool)
  }, [chainId, dexName, pool, zapOutInfo?.zapDetails.actions])

  const swapStep = swapInfo.length > 0 ? 2 : 1
  const receiveStep = swapInfo.length > 0 ? 3 : 2

  const StepMark = ({ index }) => (
    <FullCenterBox borderRadius={8} width='2rem' height='2rem' sx={{ background: '#fff3' }}>
      {index}
    </FullCenterBox>
  )

  return (
    <Box display='flex' flexDirection='column' py={3} px={4} gap={2} borderRadius={2} border='1px solid #f2f2f233'>
      <Typography>Est. Steps</Typography>
      <Typography
        variant='body2'
        sx={{ mt: 1, mb: 2, fontStyle: 'italic', fontSize: '0.75rem', color: 'text.secondary' }}
      >
        The actual Zap Routes could be adjusted with on-chain states
      </Typography>

      <Divider />

      <Box display='flex' gap={1} mt={2}>
        <StepMark index={1} />
        <Box flex={1}>
          <Typography variant='body2' color='text.secondary'>
            Remove{' '}
            {amountToken0 !== 0n &&
              `${formatDisplayNumber(formatUnits(amountToken0, token0?.decimals || 18))} ${token0?.symbol}`}{' '}
            {amountToken1 !== 0n &&
              `+ ${formatDisplayNumber(formatUnits(amountToken1, token1?.decimals || 18))} ${token1?.symbol}`}{' '}
            {(feeAmount0 !== 0n || feeAmount1 !== 0n) && (
              <>
                and claim fee{' '}
                {feeAmount0 !== 0n &&
                  `${formatDisplayNumber(formatUnits(feeAmount0, feeToken0?.decimals || 18))} ${
                    feeToken0?.symbol
                  }`}{' '}
                {feeAmount1 !== 0n &&
                  `+ ${formatDisplayNumber(formatUnits(feeAmount1, feeToken1?.decimals || 18))} ${feeToken1?.symbol}`}
              </>
            )}
          </Typography>
        </Box>
      </Box>

      {swapInfo.length > 0 && (
        <Box display='flex' gap={1} mt={3}>
          <StepMark index={2} />
          <Box flex={1}>
            {swapInfo.map((item, index) => (
              <Box key={index} display='flex' gap={2} alignItems='center' fontSize='0.75rem'>
                <Typography variant='body2' color='text.secondary' sx={{ flex: 1, lineHeight: '1rem' }}>
                  Swap {formatDisplayNumber(item.amountIn)} {item.tokenInSymbol} for{' '}
                  {formatDisplayNumber(item.amountOut)} {item.tokenOutSymbol} via <strong>{item.pool}</strong>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box display='flex' gap={1} mt={3} alignItems='center'>
        <StepMark index={receiveStep} />
        <Typography variant='body2' color='text.secondary'>
          Receive {formatDisplayNumber(formatUnits(amountOut, zapOutToken?.decimals || 18))} {zapOutToken?.symbol}
        </Typography>
      </Box>
    </Box>
  )
}

export default ZapOutRoute
