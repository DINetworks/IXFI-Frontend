import { useMemo } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Box, Typography, Tooltip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { BetweenBox } from 'src/components/base/grid'
import { formatCurrency } from 'src/components/utils/format'
import { formatDisplayNumber, formatUnits, formatWei, getPriceImpact } from 'src/components/utils/uniswap'
import SlippageWarning from 'src/components/earn/dialog/SlippageWarning'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { useZapAction } from 'src/hooks/useZapAction'

function EstimateLiquidity({ slippage, gasUsd }) {
  const { pool } = useAddLiquidity()

  const {
    zapInfo,
    addedAmount0,
    addedAmount1,
    addedToken0Usd,
    addedToken1Usd,
    refundUsd,
    refundAmount0,
    refundAmount1,
    swapPi,
    piRes,
    protocolFee,
    suggestedSlippage
  } = useZapAction()

  const piVeryHigh = zapInfo && ['VERY_HIGH' /* VERY_HIGH */, 'INVALID' /* INVALID */].includes(piRes.level)
  const piHigh = zapInfo && piRes.level === 'HIGH' /* HIGH */

  const getImpactColor = level => {
    if (level === 'VERY_HIGH' || level === 'INVALID') return 'error.main'
    if (level === 'HIGH') return 'warning.main'
    return 'text.secondary'
  }

  const tokenImage = (src, alt, style = {}) => (
    <img src={src} alt={alt} style={{ width: 16, height: 16, borderRadius: '50%', ...style }} />
  )

  return (
    <Box display='flex' flexDirection='column' gap={3} mt={6}>
      <BetweenBox>
        <Typography variant='body2' color='text.secondary' fontWeight={500}>
          Est. Pooled Amount
        </Typography>
        <Box display='flex' gap={4}>
          {[
            {
              logo: pool?.token0?.logo,
              amount: +addedAmount0,
              symbol: pool?.token0?.symbol,
              usd: +(addedToken0Usd || 0)
            },
            {
              logo: pool?.token1?.logo,
              amount: +addedAmount1,
              symbol: pool?.token1?.symbol,
              usd: +(addedToken1Usd || 0)
            }
          ].map((token, idx) => (
            <Box key={idx} display='flex' flexDirection='column' gap={0.5}>
              <Box display='flex' alignItems='center' gap={0.5}>
                {token.logo && tokenImage(token.logo, token.symbol)}
                <Typography variant='body2' color={'#fffc'}>
                  {formatDisplayNumber(token.amount, { significantDigits: 4 })} {token.symbol}
                </Typography>
              </Box>
              <Typography variant='body2' color={'#fffc'} align='right'>
                ~ {formatCurrency(token.usd)}
              </Typography>
            </Box>
          ))}
        </Box>
      </BetweenBox>

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Tooltip
          title='Based on your price range settings, a portion of your liquidity will be automatically zapped into the pool, while the remaining amount will stay in your wallet.'
          placement='top'
        >
          <Typography variant='body2' color='text.secondary' sx={{ borderBottom: '1px dotted', cursor: 'help' }}>
            Remaining Amount
          </Typography>
        </Tooltip>
        <Typography display='flex' alignItems='center' variant='body2' fontWeight={500} color={'#fffc'}>
          {formatCurrency(refundUsd)}
          <Tooltip
            title={
              <Box>
                <Typography variant='body2'>
                  {refundAmount0} {pool?.token0.symbol}
                </Typography>
                <Typography variant='body2'>
                  {refundAmount1} {pool?.token1.symbol}
                </Typography>
              </Box>
            }
            ml={2}
            placement='top'
          >
            <Icon icon='ep:info-filled' fontSize='1.2rem' sx={{ ml: 1 }} />
          </Tooltip>
        </Typography>
      </Box>

      <SlippageWarning slippage={slippage} suggestedSlippage={suggestedSlippage} />

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Tooltip
          title='Estimated change in price due to the size of your transaction. Applied to the Swap steps.'
          placement='top'
        >
          <Typography variant='body2' color='text.secondary' sx={{ borderBottom: '1px dotted' }}>
            Zap impact
          </Typography>
        </Tooltip>
        <Typography
          variant='body2'
          fontWeight={500}
          color={
            piRes.level === 'VERY_HIGH' || piRes.level === 'INVALID'
              ? 'error'
              : piRes.level === 'HIGH'
              ? 'warning.main'
              : 'text.primary'
          }
        >
          {zapInfo ? piRes.display : '--'}
        </Typography>
      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Tooltip title='Estimated network fee for your transaction.' placement='top'>
          <Typography variant='body2' color='text.secondary' sx={{ borderBottom: '1px dotted' }}>
            Est. Gas Fee
          </Typography>
        </Tooltip>
        <Typography variant='body2' fontWeight={500} color={'#fffc'}>
          {gasUsd ? formatCurrency(gasUsd) : '--'}
        </Typography>
      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Tooltip
          title={
            <Typography variant='body2'>
              Fees charged for automatically zapping into a liquidity pool. You still have to pay the standard gas fees.{' '}
            </Typography>
          }
          placement='top'
        >
          <Typography variant='body2' color='text.secondary' sx={{ borderBottom: '1px dotted' }}>
            Zap Fee
          </Typography>
        </Tooltip>
        <Typography variant='body2' color={'#fffc'} fontWeight={500}>
          {parseFloat(protocolFee.toFixed(3))}%
        </Typography>
      </Box>
    </Box>
  )
}

export default EstimateLiquidity
