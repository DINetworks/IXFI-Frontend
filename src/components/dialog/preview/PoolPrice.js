import { Icon } from '@iconify/react'
import { Box, Typography } from '@mui/material'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import { divideBigIntToString, formatDisplayNumber, tickToPrice } from 'src/components/utils/uniswap'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'

const PoolPrice = () => {
  const { pool, tickLower, tickUpper, priceLower, priceUpper, revertPrice, toggleRevertPrice } = useAddLiquidity()

  const univ2Price =
    pool?.type == 'v2'
      ? +divideBigIntToString(
          BigInt(pool.reserves[1]) * BigInt(pool.token0?.decimals),
          BigInt(pool.reserves[0]) * BigInt(pool.token1?.decimals),
          18
        )
      : 0

  const price =
    pool?.type == 'v3'
      ? formatDisplayNumber(
          tickToPrice(pool.positionInfo?.tick, pool.token0?.decimals, pool.token1?.decimals, revertPrice),
          {
            significantDigits: 5
          }
        )
      : pool?.type == 'v2'
      ? formatDisplayNumber(revertPrice ? 1 / univ2Price : univ2Price, {
          significantDigits: 5
        })
      : '--'

  const leftPrice = formatDisplayNumber(!revertPrice ? priceLower : 1 / priceUpper, {
    significantDigits: 5
  })

  const rightPrice = formatDisplayNumber(!revertPrice ? priceUpper : 1 / priceLower, {
    significantDigits: 5
  })

  const quote = (
    <span>
      {revertPrice ? `${pool?.token0.symbol}/${pool?.token1.symbol}` : `${pool?.token1.symbol}/${pool?.token0.symbol}`}
    </span>
  )

  return (
    <Box
      className='text-sm'
      mt={4}
    >
      {/* Current pool price */}
      <BetweenBox gap={4}>
        <Typography variant='body1'>Current pool price</Typography>
        <CenterBox gap={1}>
          <Icon
            icon='tabler:transfer'
            fontSize='1.2rem'
            className='cursor-pointer'
            onClick={toggleRevertPrice}
          />
          <Typography
            variant='body1'
            fontWeight={500}
            color={'#fffc'}
          >
            {price} {quote}
          </Typography>
        </CenterBox>
      </BetweenBox>

      {/* Min / Max Price for Uniswap V3 */}
      {pool?.type == 'v3' && (
        <BetweenBox
          gap={4}
          mt={2}
        >
          {/* Min Price */}
          <Box
            display='flex'
            gap={1}
            alignItems='center'
            flex={1}
          >
            <Typography variant='body2'>Min Price</Typography>
            <Typography
              variant='body2'
              fontWeight={500}
              color={'#fffc'}
            >
              {revertPrice
                ? tickUpper === pool.positionInfo?.maxTick
                  ? '0'
                  : leftPrice
                : tickLower === pool.positionInfo?.minTick
                ? '0'
                : leftPrice}
            </Typography>
            <Typography variant='body2'>{quote}</Typography>
          </Box>

          {/* Max Price */}
          <Box
            display='flex'
            gap={1}
            justifyContent='end'
            flex={1}
          >
            <Typography variant='body2'>Max Price</Typography>
            <Typography
              variant='body2'
              fontWeight={500}
              color={'#fffc'}
            >
              {!revertPrice
                ? tickUpper === pool.positionInfo?.maxTick
                  ? '∞'
                  : rightPrice
                : tickLower === pool.positionInfo?.minTick
                ? '∞'
                : rightPrice}
            </Typography>
            <Typography variant='body2'>{quote}</Typography>
          </Box>
        </BetweenBox>
      )}
    </Box>
  )
}

export default PoolPrice
