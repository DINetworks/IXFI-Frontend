import { Box, Divider, Typography, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useState } from 'react'

import { BetweenBox, CenterBox } from '../../base/grid'
import { useZapAction } from 'src/hooks/useZapAction'
import { formatDisplayNumber, getPriceImpact } from 'src/components/utils/uniswap'
import { formatCurrency } from 'src/components/utils/format'
import SlippageWarning from './SlippageWarning'

const ZapInfo = () => {
  const {
    liquidityType,
    token0,
    token1,
    amount0,
    amount1,
    addedAmountUsd,
    addedAmount0,
    addedAmount1,
    addedToken0Usd,
    addedToken1Usd,
    refundUsd,
    refundAmount0,
    refundAmount1,
    initUsd,
    zapInfo,
    feeInfo,
    swapPi,
    swapPiRes,
    protocolFee,
    partnerFee,
    piRes,
    suggestedSlippage
  } = useZapAction()

  const [piDetailShow, setPiDetailShow] = useState(false)

  const isHighRemainingAmount = initUsd ? refundUsd / initUsd >= suggestedSlippage : false

  const togglePriceImpact = () => setPiDetailShow(prev => !prev)

  const renderSwapImpactDetails = () => (
    <Box
      sx={{ height: piDetailShow ? '4rem' : '0px', display: piDetailShow ? 'block' : 'none' }}
      className='transition-all duration-300 ease-in-out'
    >
      {swapPi.map((item, index) => (
        <BetweenBox
          key={index}
          className={`text-xs ${
            item.piRes.level === 'NORMAL'
              ? 'text-subText brightness-125'
              : item.piRes.level === 'HIGH'
              ? 'text-warning'
              : 'text-error'
          }`}
          sx={{ px: 3 }}
        >
          <Typography variant='body2'>
            {formatDisplayNumber(item.amountIn, { significantDigits: 4 })} {item.tokenInSymbol} →{' '}
            {formatDisplayNumber(item.amountOut, { significantDigits: 4 })} {item.tokenOutSymbol}
          </Typography>
          <Typography variant='body2'>{item.piRes.display}</Typography>
        </BetweenBox>
      ))}
    </Box>
  )

  return (
    <Box display='flex' flexDirection='column' py={3} px={4} gap={2} borderRadius={2} border='1px solid #f2f2f233'>
      <BetweenBox>
        <Typography variant='body1'>Est Liquidity</Typography>
        <Typography color={'#fff'} variant='body1'>
          {!!addedAmountUsd ? formatCurrency(addedAmountUsd) : ''}
        </Typography>
      </BetweenBox>

      <Divider />

      {[token0, token1].map((token, index) => (
        <BetweenBox key={token?.address} alignItems='start'>
          <CenterBox gap={1}>
            <Typography variant='body2'>Est. Pooled</Typography>
            <img className='earn-token small' src={token?.logoURI} alt={token?.symbol} />
            <Typography variant='body2'>{token?.symbol}</Typography>
          </CenterBox>
          <Box display='flex' flexDirection='column' alignItems='flex-end'>
            {liquidityType == 'increase' && (
              <Typography color={'#fff'} variant='body2'>
                {formatDisplayNumber(index === 0 ? amount0 : amount1, { significantDigits: 5 })}
                {token?.symbol}
              </Typography>
            )}
            <Typography color={'#fff'} variant='body2'>
              {liquidityType == 'increase' ? '+' : ''}{' '}
              {formatDisplayNumber(index === 0 ? addedAmount0 : addedAmount1, { significantDigits: 5 })}
              {token?.symbol}
            </Typography>
            <Typography fontSize='0.6rem'>
              ${formatDisplayNumber(index === 0 ? addedToken0Usd : addedToken1Usd, { significantDigits: 5 })}
            </Typography>
          </Box>
        </BetweenBox>
      ))}

      <BetweenBox>
        <Tooltip title='Based on your price range settings, a portion of your liquidity will be automatically zapped into the pool, while the remaining amount will stay in your wallet.'>
          <Typography variant='body2' sx={{ borderBottom: `1px dotted #ccc8` }}>
            Est Remaining Value
          </Typography>
        </Tooltip>
        <CenterBox gap={1}>
          <Typography variant='body2'>{formatCurrency(refundUsd)}</Typography>
          <Tooltip
            title={
              <Box>
                <Typography>
                  {refundAmount0} {token0?.symbol}
                </Typography>
                <Typography>
                  {refundAmount1} {token1?.symbol}
                </Typography>
              </Box>
            }
          >
            <Icon icon='ep:info-filled' fontSize='1.2rem' />
          </Tooltip>
        </CenterBox>
      </BetweenBox>

      <BetweenBox>
        <Tooltip title='View all the detailed estimated price impact of each swap'>
          <Typography variant='body2' sx={{ borderBottom: `1px dotted #ccc8` }}>
            Swap Price Impact
          </Typography>
        </Tooltip>
        <Typography variant='body2'>
          {swapPi?.length ? (
            <Icon icon={piDetailShow ? 'tabler:chevron-up' : 'tabler:chevron-down'} onClick={togglePriceImpact} />
          ) : (
            '--'
          )}
        </Typography>
      </BetweenBox>

      {renderSwapImpactDetails()}

      <SlippageWarning
        className='text-xs'
        slippage={50}
        suggestedSlippage={suggestedSlippage || 100}
        showWarning={!!zapInfo}
      />

      <BetweenBox className='text-xs'>
        <Tooltip title='The difference between input and estimated liquidity received (including remaining amount). Be careful with high value!'>
          <Box
            className={`text-subText ${
              piRes.level !== 'NORMAL'
                ? piRes.level === 'HIGH'
                  ? 'border-warning text-warning'
                  : 'border-error text-error'
                : 'border-subText'
            }`}
            sx={{ borderBottom: `1px dotted #ccc8` }}
          >
            Zap Impact
          </Box>
        </Tooltip>
        <Box
          className={
            piRes.level === 'VERY_HIGH' || piRes.level === 'INVALID'
              ? 'text-error'
              : piRes.level === 'HIGH'
              ? 'text-warning'
              : 'text-text'
          }
        >
          {zapInfo ? piRes.display : '--'}
        </Box>
      </BetweenBox>

      <BetweenBox className='text-xs'>
        <Tooltip title='Fees charged for automatically zapping into a liquidity pool. You still have to pay the standard gas fees.'>
          <Box className='text-subText' sx={{ borderBottom: `1px dotted #ccc8` }}>
            Zap Fee
          </Box>
        </Tooltip>
        <Tooltip
          title={partnerFee ? `${protocolFee.toFixed(3)}% Protocol Fee + ${partnerFee.toFixed(3)}% Partner Fee` : ''}
        >
          <Typography variant='body2' color={'#fff'}>
            {feeInfo ? `${(protocolFee + partnerFee).toFixed(3)}%` : '--'}
          </Typography>
        </Tooltip>
      </BetweenBox>

      {zapInfo && isHighRemainingAmount && (
        <Box p={2} mt={2} className='text-xs text-warning' sx={{ background: `#ff990133`, borderRadius: 2 }}>
          {((refundUsd * 100) / initUsd).toFixed(2)}% of your input remains unused. Consider lowering your input amount.
        </Box>
      )}

      {zapInfo && swapPiRes.piRes.level !== 'NORMAL' && (
        <Box
          p={2}
          mt={2}
          className={`text-xs ${swapPiRes.piRes.level === 'HIGH' ? 'text-warning' : 'text-error'}`}
          sx={{ background: swapPiRes.piRes.level === 'HIGH' ? `#cc333333` : `#ff990133`, borderRadius: 2 }}
        >
          {swapPiRes.piRes.msg}
        </Box>
      )}

      {zapInfo && piRes.level !== 'NORMAL' && (
        <Box
          p={2}
          mt={2}
          className={`text-xs ${piRes.level === 'HIGH' ? 'text-warning' : 'text-error'}`}
          sx={{ background: piRes.level === 'HIGH' ? `#cc333333` : `#ff990133`, borderRadius: 2 }}
        >
          {piRes.msg}
        </Box>
      )}
    </Box>
  )
}

export default ZapInfo
