import { Box, Typography } from '@mui/material'
import { BetweenBox, CenterBox } from '../base/grid'
import { formatUnits } from 'viem'
import { formatDisplayNumber } from '../utils/uniswap'

const PositionLiquidity = ({ position }) => {
  return (
    <Box
      px={4}
      py={3}
      border={'1px solid #fff3'}
      borderRadius={2}
    >
      <Typography mb={2}>Your position price range</Typography>
      {position?.currentAmounts.map((cta, index) => (
        <BetweenBox
          key={index}
          mb={2}
        >
          <CenterBox>
            <img
              src={cta.token?.logo}
              className='earn-token'
              alt='main-token'
            />
            <Typography
              variant='h6'
              ml={2}
            >
              {cta.token?.symbol}
            </Typography>
          </CenterBox>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
          >
            <Typography
              variant='h6'
              color={'#fff'}
            >
              {formatDisplayNumber(formatUnits(cta.balance, cta.token?.decimals), { significantDigits: 5 })}
            </Typography>
            <Typography variant='body2'>
              $
              {formatDisplayNumber(formatUnits(cta.balance * cta.token?.price, cta.token?.decimals), {
                significantDigits: 5
              })}
            </Typography>
          </Box>
        </BetweenBox>
      ))}
    </Box>
  )
}

export default PositionLiquidity
