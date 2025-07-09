import { useState, useMemo } from 'react'

import { Box, Divider, Typography } from '@mui/material'
import { BetweenBox, CenterBox, FullCenterBox } from 'src/components/base/grid'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { DEX_INFO, NETWORK_INFO } from 'src/configs/protocol'
import { formatWei } from 'src/components/utils/uniswap'
import { useZapAction } from 'src/hooks/useZapAction'
import { Icon } from '@iconify/react'

function ZapRoute() {
  const [expanded, setExpanded] = useState(false)
  const { tokensForZap, zapInfo, addedAmount0, addedAmount1, aggregatorSwapInfo, poolSwapInfo } = useZapAction()
  const { pool, protocol, isLoadingInfo, chainId } = useAddLiquidity()

  const symbol0 = isLoadingInfo ? '' : pool.token0.symbol
  const symbol1 = isLoadingInfo ? '' : pool.token1.symbol
  const dexNameObj = DEX_INFO[protocol]?.name
  const dexName = typeof dexNameObj === 'string' ? dexNameObj : dexNameObj?.[chainId]

  const onExpand = () => setExpanded(prev => !prev)

  const swapInfo = useMemo(() => {
    if (isLoadingInfo) return []

    const tokens = [...tokensForZap, pool.token0, pool.token1, NETWORK_INFO[chainId]?.wrappedToken]

    const parseSwaps = (swaps, poolLabel) =>
      swaps?.map(swap => {
        const tokenIn = tokens.find(t => t.address.toLowerCase() === swap.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find(t => t.address.toLowerCase() === swap.tokenOut.address.toLowerCase())
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn: formatWei(swap.tokenIn.amount, tokenIn?.decimals),
          amountOut: formatWei(swap.tokenOut.amount, tokenOut?.decimals),
          pool: poolLabel
        }
      }) || []

    return [
      ...parseSwaps(aggregatorSwapInfo?.aggregatorSwap?.swaps, 'KyberSwap'),
      ...parseSwaps(poolSwapInfo?.poolSwap?.swaps, `${dexName} Pool`)
    ]
  }, [zapInfo?.zapDetails?.actions, pool, tokensForZap, chainId, dexName])

  const convertedPool = pool => (pool == 'KyberSwap' ? 'DI Swap' : pool)

  return (
    <Box
      display='flex'
      flexDirection='column'
      py={3}
      px={4}
      gap={2}
      borderRadius={2}
      mt={2}
      border='1px solid #f2f2f233'
    >
      <BetweenBox py={1} onClick={onExpand} sx={{ cursor: 'pointer' }}>
        <Typography>Zap Summary</Typography>

        <Icon icon={expanded ? 'tabler:chevron-up' : 'tabler:chevron-down'} fontSize='1.2rem' />
      </BetweenBox>

      <Box
        sx={{ display: expanded ? 'flex' : 'none', flexDirection: 'column', gap: 2 }}
        className='transition-all duration-300 ease-in-out'
      >
        <Divider mt={2} />
        <Box className='text-subText text-xs'>The actual Zap Routes could be adjusted with on-chain states</Box>

        {swapInfo.map((item, index) => (
          <CenterBox key={index} gap={3} className='text-xs'>
            <FullCenterBox borderRadius={8} width='2rem' height='2rem' sx={{ background: '#fff3' }}>
              {index + 1}
            </FullCenterBox>

            <Box flex={1} className='text-subText'>
              Swap {item.amountIn} {item.tokenInSymbol} for {item.amountOut} {item.tokenOutSymbol} via{' '}
              <span className='font-medium text-text'>{convertedPool(item.pool)}</span>
            </Box>
          </CenterBox>
        ))}

        <CenterBox gap={3} className='text-xs'>
          <FullCenterBox borderRadius={8} width='2rem' height='2rem' sx={{ background: '#fff3' }}>
            {swapInfo.length + 1}
          </FullCenterBox>
          <Box flex={1} className='text-subText'>
            Build LP using {addedAmount0} {symbol0} and {addedAmount1} {symbol1} on{' '}
            <span className='font-medium text-text'>{dexName}</span>
          </Box>
        </CenterBox>
      </Box>
    </Box>
  )
}

export default ZapRoute
