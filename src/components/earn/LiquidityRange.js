import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { formatDisplayNumber } from '../utils/uniswap'

const LiquidityRange = ({ minPrice, maxPrice, token0, token1, revertPrice }) => {
  return (
    <Box
      px={4}
      py={3}
      border={'1px solid #fff3'}
      borderRadius={2}
    >
      <Typography mb={2}>Your position price range</Typography>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={6}
        >
          <Card>
            <CardContent>
              <Typography
                variant='body2'
                color='textSecondary'
                mb={1}
              >
                Min Price
              </Typography>
              <Typography
                variant='h6'
                fontWeight='bold'
              >
                {formatDisplayNumber(!revertPrice ? minPrice : 1 / maxPrice, { significantDigits: 4 })}
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
              >
                {!revertPrice ? token1?.symbol : token0?.symbol}/{!revertPrice ? token0?.symbol : token1?.symbol}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
        >
          <Card>
            <CardContent>
              <Typography
                variant='body2'
                color='textSecondary'
                mb={1}
              >
                Max Price
              </Typography>
              <Typography
                variant='h6'
                fontWeight='bold'
              >
                {formatDisplayNumber(!revertPrice ? maxPrice : 1 / minPrice, { significantDigits: 4 })}
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
              >
                {!revertPrice ? token1?.symbol : token0?.symbol}/{!revertPrice ? token0?.symbol : token1?.symbol}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LiquidityRange
