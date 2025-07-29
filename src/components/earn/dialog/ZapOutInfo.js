import { Box, Divider, Tooltip, Typography } from '@mui/material'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import { formatDisplayNumber } from 'src/components/utils/uniswap'
import { useZapAction } from 'src/hooks'
import { formatCurrency } from 'src/components/utils/format'
import SlippageWarning from './SlippageWarning'
import SwapPriceImpact from '../SwapPriceImpact'
import { formatUnits } from 'ethers'

const ZapOutInfo = () => {
  const { zapOutDerivedInfo, zapOutToken } = useZapAction()
  const { amountOut, amountOutUsd, suggestedSlippage, feeInfo, piRes, swapPi, swapPiRes, zapFee } =
    zapOutDerivedInfo || {}

  return (
    <Box
      display='flex'
      flexDirection='column'
      py={3}
      px={4}
      gap={2}
      borderRadius={2}
      mb={3}
      border='1px solid #f2f2f233'
    >
      <BetweenBox>
        <Typography variant='body1'>Est. Received Value</Typography>
        <Typography color={'#fff'} variant='body1'>
          {formatCurrency(amountOutUsd)}
        </Typography>
      </BetweenBox>

      <Divider />

      <BetweenBox alignItems='start'>
        <CenterBox gap={1}>
          <Typography variant='body2'>Est. Received</Typography>
          <img
            className='earn-token small'
            src={zapOutToken?.logoURI ?? zapOutToken?.logo ?? '/images/default-token.png'}
            alt={zapOutToken?.symbol}
          />
          <Typography variant='body2'>{zapOutToken?.symbol}</Typography>
        </CenterBox>
        <Box display='flex' flexDirection='column' alignItems='flex-end'>
          <Typography color={'#fff'} variant='body2'>
            {!!amountOut || !!zapOutToken
              ? formatDisplayNumber(formatUnits(amountOut, zapOutToken?.decimals || 18))
              : '--'}
            {zapOutToken?.symbol}
          </Typography>
        </Box>
      </BetweenBox>

      <SlippageWarning slippage={100} suggestedSlippage={suggestedSlippage} showWarning={!!zapOutDerivedInfo} />

      <SwapPriceImpact swapPi={swapPi} swapPiRes={swapPiRes} />

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
          {zapOutDerivedInfo ? piRes.display : '--'}
        </Box>
      </BetweenBox>

      <BetweenBox className='text-xs'>
        <Tooltip title='Fees charged for automatically zapping into a liquidity pool. You still have to pay the standard gas fees.'>
          <Box className='text-subText' sx={{ borderBottom: `1px dotted #ccc8` }}>
            Zap Fee
          </Box>
        </Tooltip>

        <Typography variant='body2' color={'#fff'}>
          {feeInfo ? `${zapFee.toFixed(3)}%` : '--'}
        </Typography>
      </BetweenBox>
    </Box>
  )
}

export default ZapOutInfo
