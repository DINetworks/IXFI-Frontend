import { Icon } from '@iconify/react'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { Typography } from '@mui/material'
import { FullCenterBox } from 'src/components/base/grid'
import { useMemo } from 'react'
import { divideBigIntToString, formatDisplayNumber, tickToPrice } from 'src/components/utils/uniswap'

export default function PoolPrice() {
  const { pool, isLoadingInfo, revertPrice, toggleRevertPrice } = useAddLiquidity()
  const { token0, token1, reserves, positionInfo } = pool || {}

  const primaryToken = revertPrice ? token0?.symbol : token1?.symbol
  const secondaryToken = revertPrice ? token1?.symbol : token0?.symbol

  const price = useMemo(() => {
    if (isLoadingInfo) return '--'

    if (pool.type == 'v3' && positionInfo) {
      return formatDisplayNumber(tickToPrice(positionInfo.tick, token0.decimals, token1.decimals, revertPrice), {
        significantDigits: 5
      })
    }

    if (pool.type == 'v2' && reserves) {
      const p = divideBigIntToString(
        BigInt(reserves[1]) * BigInt(token0.decimals),
        BigInt(reserves[0]) * BigInt(token1.decimals),
        18
      )
      return formatDisplayNumber(revertPrice ? 1 / +p : p, {
        significantDigits: 5
      })
    }
  }, [pool, revertPrice])

  return (
    <FullCenterBox
      px={2}
      py={2}
      gap={2}
      borderRadius={2}
      border='1px solid #f2f2f233'
      sx={{ cursor: 'pointer' }}
      onClick={toggleRevertPrice}
    >
      <Typography>Pool price </Typography>
      <Typography color='#00ff33'>{price}</Typography>
      <Typography fontWeight='medium'>
        {primaryToken}/{secondaryToken}
      </Typography>
      <Icon
        icon='tabler:transfer'
        fontSize='1.2rem'
      />
    </FullCenterBox>
  )
}
