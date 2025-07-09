import { Box, Typography, Grid, Paper } from '@mui/material'
import { formatDisplayNumber, tickToPrice } from 'src/components/utils/uniswap'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'

export function PositionPriceRange() {
  const { position: rawPosition, pool: rawPool, revertPrice } = useAddLiquidity()

  if (rawPool?.type !== 'v3' || !rawPosition.type != 'v3') return null

  const minPrice = tickToPrice(position.tickLower, pool.token0.decimals, pool.token1.decimals, revertPrice)

  const maxPrice = tickToPrice(position.tickUpper, pool.token0.decimals, pool.token1.decimals, revertPrice)

  const isMinTick = position.tickLower === pool.minTick
  const isMaxTick = position.tickUpper === pool.maxTick

  const displayLower = isMinTick
    ? '0'
    : formatDisplayNumber(revertPrice ? maxPrice : minPrice, { significantDigits: 8 })

  const displayUpper = isMaxTick
    ? '∞'
    : formatDisplayNumber(revertPrice ? minPrice : maxPrice, { significantDigits: 8 })

  const label = revertPrice
    ? `${pool.token0.symbol} per ${pool.token1.symbol}`
    : `${pool.token1.symbol} per ${pool.token0.symbol}`

  return (
    <Box
      p={3}
      border='1px solid'
      borderColor='divider'
      borderRadius={2}
      sx={{ backgroundColor: 'background.paper', color: 'text.secondary' }}
    >
      <Typography
        variant='subtitle1'
        gutterBottom
      >
        Your Position Price Ranges
      </Typography>

      <Grid
        container
        spacing={2}
        mt={1}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            elevation={1}
            sx={{ p: 2, textAlign: 'center' }}
          >
            <Typography variant='body2'>Min Price</Typography>
            <Typography variant='h6'>{displayLower}</Typography>
            <Typography
              variant='caption'
              color='text.secondary'
            >
              {label}
            </Typography>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            elevation={1}
            sx={{ p: 2, textAlign: 'center' }}
          >
            <Typography variant='body2'>Max Price</Typography>
            <Typography variant='h6'>{displayUpper}</Typography>
            <Typography
              variant='caption'
              color='text.secondary'
            >
              {label}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
