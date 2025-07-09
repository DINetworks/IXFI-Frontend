import { Icon } from '@iconify/react'
import { Box, TextField, Typography, IconButton, Paper, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { MAX_TICK, MIN_TICK, nearestUsableTick, priceToClosestTick, tickToPrice } from 'src/components/utils/uniswap'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { formatNumber } from 'src/components/utils/format'

export default function PriceInput({ type }) {
  const { pool, isLoadingInfo, tickLower, tickUpper, revertPrice, setTickLower, setTickUpper } = useAddLiquidity()

  const [localValue, setLocalValue] = useState('')

  const isFullRange = !isLoadingInfo && tickLower === pool?.minTick && tickUpper === pool?.maxTick

  const poolTick = isLoadingInfo
    ? undefined
    : pool.positionInfo.tick % pool.positionInfo.tickSpacing === 0
    ? pool.positionInfo.tick
    : nearestUsableTick(pool.positionInfo.tick, pool.positionInfo.tickSpacing)

  const updateTick = fn => {
    if (isLoadingInfo || poolTick === undefined) return
    fn()
  }

  const increaseTickLower = () =>
    updateTick(() => {
      const newTick =
        tickLower !== null ? tickLower + pool.positionInfo.tickSpacing : poolTick + pool.positionInfo.tickSpacing
      if (newTick <= MAX_TICK) setTickLower(newTick)
    })

  const increaseTickUpper = () =>
    updateTick(() => {
      const newTick =
        tickUpper !== null ? tickUpper + pool.positionInfo.tickSpacing : poolTick + pool.positionInfo.tickSpacing
      if (newTick <= MAX_TICK) setTickUpper(newTick)
    })

  const decreaseTickLower = () =>
    updateTick(() => {
      const newTick = (tickLower !== null ? tickLower : pool.positionInfo.tick) - pool.positionInfo.tickSpacing
      if (newTick >= MIN_TICK) setTickLower(newTick)
    })

  const decreaseTickUpper = () =>
    updateTick(() => {
      const newTick = (tickUpper !== null ? tickUpper : pool.positionInfo.tick) - pool.positionInfo.tickSpacing
      if (newTick >= MIN_TICK) setTickUpper(newTick)
    })

  const onPriceChange = e => {
    const value = e.target.value.replace(/,/g, '')
    const inputRegex = /^(\d+)?([.]?\d*)?$/
    if (value === '' || inputRegex.test(value)) {
      setLocalValue(value)
    }
  }

  const wrappedCorrectPrice = value => {
    if (isLoadingInfo) return

    const tick2 = priceToClosestTick(value, pool.token0?.decimals, pool.token1?.decimals, revertPrice)
    if (tick2 !== undefined) {
      const t =
        tick2 % pool.positionInfo.tickSpacing === 0 ? tick2 : nearestUsableTick(tick2, pool.positionInfo.tickSpacing)

      if (type === 'PriceLower') {
        revertPrice ? setTickUpper(t) : setTickLower(t)
      } else {
        revertPrice ? setTickLower(t) : setTickUpper(t)
      }
    }
  }

  const isMinTick = !isLoadingInfo && tickLower === pool.minTick
  const isMaxTick = !isLoadingInfo && tickUpper === pool.maxTick

  useEffect(() => {
    if (!isLoadingInfo) {
      let minPrice = localValue
      let maxPrice = localValue

      if (tickUpper !== null)
        maxPrice = isMaxTick
          ? revertPrice
            ? '0'
            : '∞'
          : tickToPrice(tickUpper, pool.token0?.decimals, pool.token1?.decimals, revertPrice)

      if (tickLower !== null)
        minPrice = isMinTick
          ? revertPrice
            ? '∞'
            : '0'
          : tickToPrice(tickLower, pool.token0?.decimals, pool.token1?.decimals, revertPrice)

      const valueToSet = type === 'PriceLower' ? (revertPrice ? maxPrice : minPrice) : revertPrice ? minPrice : maxPrice

      setLocalValue(valueToSet === '∞' ? valueToSet : formatNumber(parseFloat(valueToSet).toPrecision(6)))
    }
  }, [tickUpper, tickLower, pool, revertPrice, isMaxTick, isMinTick, type])

  const showSymbol = !isLoadingInfo
    ? revertPrice
      ? `${pool.token0.symbol}/${pool.token1.symbol}`
      : `${pool.token1.symbol}/${pool.token0.symbol}`
    : '--'

  return (
    <Paper
      variant='outlined'
      sx={{
        py: 2,
        px: 3,
        borderColor: type === 'PriceLower' ? '#31cb9e' : '#7289DA',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant='caption' color='textSecondary'>
          {type === 'PriceLower' ? 'Min' : 'Max'} Price
        </Typography>
        <TextField
          variant='standard'
          fullWidth
          value={localValue}
          onChange={onPriceChange}
          onBlur={e => wrappedCorrectPrice(e.target.value)}
          placeholder='0.0'
          inputProps={{
            inputMode: 'decimal',
            pattern: '^[0-9]*[.,]?[0-9]*$',
            minLength: 1,
            maxLength: 79
          }}
          sx={{
            mt: 0.5,
            fontSize: 16,
            input: {
              color: 'white',
              fontWeight: 'bold'
            }
          }}
        />
        <Typography variant='caption' color='textSecondary'>
          {showSymbol}
        </Typography>
      </Box>

      {true && (
        <Box display='flex' flexDirection='column' gap={2} ml={2}>
          <Button
            size='small'
            variant='outlined'
            color='inherit'
            onClick={() => {
              type === 'PriceLower'
                ? revertPrice
                  ? decreaseTickUpper()
                  : increaseTickLower()
                : revertPrice
                ? decreaseTickLower()
                : increaseTickUpper()
            }}
            disabled={isFullRange}
          >
            <Icon fontSize='1rem' icon='tabler:plus' />
          </Button>
          <Button
            size='small'
            variant='outlined'
            color='inherit'
            onClick={() => {
              type === 'PriceLower'
                ? revertPrice
                  ? increaseTickUpper()
                  : decreaseTickLower()
                : revertPrice
                ? increaseTickLower()
                : decreaseTickUpper()
            }}
            disabled={isFullRange}
          >
            <Icon fontSize='1rem' icon='tabler:minus' />
          </Button>
        </Box>
      )}
    </Paper>
  )
}
