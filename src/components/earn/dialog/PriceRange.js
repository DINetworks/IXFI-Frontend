import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Typography, Grid, Paper, CircularProgress } from '@mui/material'
import {
  DEFAULT_PRICE_RANGE,
  FULL_PRICE_RANGE,
  nearestUsableTick,
  PRICE_RANGE,
  priceToClosestTick,
  tickToPrice,
  toString
} from 'src/components/utils/uniswap'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'

export default function PriceRange() {
  const { isLoadingInfo, pool, setTickLower, setTickUpper, priceLower, priceUpper } = useAddLiquidity()
  const { swapFee: fee, type, token0, token1, minTick, maxTick, positionInfo } = pool || {}

  const [selectedRange, setSelectedRange] = useState(null)

  const priceRanges = useMemo(
    () =>
      !fee
        ? []
        : fee <= 0.01
        ? PRICE_RANGE.LOW_POOL_FEE
        : fee > 0.1
        ? PRICE_RANGE.HIGH_POOL_FEE
        : PRICE_RANGE.MEDIUM_POOL_FEE,
    [fee]
  )

  const handleSelectPriceRange = range => {
    if (isLoadingInfo) return

    if (range === FULL_PRICE_RANGE) {
      setTickLower(minTick)
      setTickUpper(maxTick)
      setSelectedRange({ range, priceLower: null, priceUpper: null })
      return
    }

    const currentPoolPrice = tickToPrice(positionInfo.tick, token0?.decimals, token1?.decimals, false)

    if (!currentPoolPrice) return
    const left = +currentPoolPrice * (1 - range)
    const right = +currentPoolPrice * (1 + range)

    const lower = priceToClosestTick(toString(Number(left)), token0?.decimals, token1?.decimals, false)
    const upper = priceToClosestTick(toString(Number(right)), token0?.decimals, token1?.decimals, false)

    if (lower) setTickLower(nearestUsableTick(lower, positionInfo.tickSpacing))
    if (upper) setTickUpper(nearestUsableTick(upper, positionInfo.tickSpacing))
    setSelectedRange({ range, priceLower: null, priceUpper: null })
  }

  useEffect(() => {
    if (selectedRange?.range && priceLower && priceUpper) {
      if (!selectedRange?.priceLower && !selectedRange?.priceUpper) {
        setSelectedRange({
          ...selectedRange,
          priceLower,
          priceUpper
        })
      } else if (selectedRange.priceLower !== priceLower || selectedRange.priceUpper !== priceUpper)
        setSelectedRange(null)
    }
  }, [priceLower, priceUpper])

  useEffect(() => {
    if (!fee) return
    if (!selectedRange) {
      handleSelectPriceRange(
        fee <= 0.01
          ? DEFAULT_PRICE_RANGE.LOW_POOL_FEE
          : fee > 0.1
          ? DEFAULT_PRICE_RANGE.HIGH_POOL_FEE
          : DEFAULT_PRICE_RANGE.MEDIUM_POOL_FEE
      )
    }
  }, [fee])

  return (
    <Box
      display='flex'
      gap={2}
      my={1.5}
    >
      {priceRanges.map((item, index) => (
        <Button
          key={index}
          variant='outlined'
          color={item === selectedRange?.range ? 'success' : 'inherit'}
          onClick={() => handleSelectPriceRange(item)}
          size='small'
          fullWidth={item === FULL_PRICE_RANGE}
        >
          {item === FULL_PRICE_RANGE ? item : `${Number(item) * 100}%`}
        </Button>
      ))}
    </Box>
  )
}
