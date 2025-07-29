import { Box, Typography } from '@mui/material'
import { BetweenBox } from 'src/components/base/grid'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { formatCurrency, formatNumber } from 'src/components/utils/format'

export default function PoolStats() {
  const { pool } = useAddLiquidity()
  const { poolStats } = pool || {}

  return (
    poolStats && (
      <Box display='flex' flexDirection='column' px={6} py={3} gap={2} borderRadius={2} border='1px solid #f2f2f233'>
        <BetweenBox>
          <Typography variant='body2'>TVL</Typography>
          <Typography variant='body2' color='#fffd'>
            {formatCurrency(poolStats?.tvl)}
          </Typography>
        </BetweenBox>

        <BetweenBox>
          <Typography variant='body2'>24h Volume</Typography>
          <Typography variant='body2' color='#fffd'>
            {formatCurrency(poolStats?.volume24h)}
          </Typography>
        </BetweenBox>

        <BetweenBox>
          <Typography variant='body2'>24h Fee</Typography>
          <Typography variant='body2' color='#fffd'>
            {formatCurrency(poolStats?.fees24h)}
          </Typography>
        </BetweenBox>

        <BetweenBox>
          <Typography variant='body2'>Est. APR</Typography>
          <Typography variant='body2' color='#fffd'>
            {formatNumber(poolStats?.apr24h, 5)} %
          </Typography>
        </BetweenBox>
      </Box>
    )
  )
}
