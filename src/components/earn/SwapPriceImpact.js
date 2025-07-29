import React, { useState } from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import { BetweenBox } from '../base/grid'
import { Icon } from '@iconify/react'
import { formatDisplayNumber } from '../utils/uniswap'

const SwapPriceImpact = ({ swapPi, swapPiRes }) => {
  const [piDetailShow, setPiDetailShow] = useState(false)
  const getLevelColor = level => {
    if (level === 'NORMAL') return { color: 'text.secondary', borderColor: 'text.secondary' }
    if (level === 'HIGH') return { color: 'warning.main', borderColor: 'warning.main' }
    return { color: 'error.main', borderColor: 'error.main' }
  }

  const toggleDetailView = () => setPiDetailShow(prev => !prev)

  return swapPi?.length ? (
    <>
      <BetweenBox>
        <Tooltip
          title='View all the detailed estimated price impact of each swap'
          arrow
          placement='top'
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: 500,
              fontSize: '0.75rem',
              borderBottom: '1px dotted',
              ...getLevelColor(swapPiRes.piRes.level)
            }}
          >
            Swap Price Impact
          </Typography>
        </Tooltip>

        <Icon
          icon={piDetailShow ? 'tabler:chevron-up' : 'tabler:chevron-down'}
          className='cursor-pointer'
          onClick={toggleDetailView}
        />
      </BetweenBox>

      {piDetailShow &&
        swapPi.map((item, index) => (
          <BetweenBox
            key={index}
            fontSize='0.75rem'
            color={
              item.piRes.level === 'NORMAL'
                ? 'text.secondary'
                : item.piRes.level === 'HIGH'
                ? 'warning.main'
                : 'error.main'
            }
            sx={item.piRes.level === 'NORMAL' ? { filter: 'brightness(1.25)' } : {}}
          >
            <Box ml={1}>
              {formatDisplayNumber(item.amountIn, { significantDigits: 4 })} {item.tokenInSymbol} →{' '}
              {formatDisplayNumber(item.amountOut, { significantDigits: 4 })} {item.tokenOutSymbol}
            </Box>
            <Box>{item.piRes.display}</Box>
          </BetweenBox>
        ))}
    </>
  ) : (
    <>
      <Tooltip
        title='Estimated change in price due to the size of your transaction. Applied to the Swap steps.'
        arrow
        placement='top'
      >
        <Typography
          variant='body2'
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            borderBottom: '1px dotted',
            borderColor: 'text.secondary'
          }}
        >
          Swap Impact
        </Typography>
      </Tooltip>
      <Typography variant='body2'>--</Typography>
    </>
  )
}

export default SwapPriceImpact
