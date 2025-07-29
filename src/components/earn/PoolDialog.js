import { useMemo, memo, useCallback } from 'react'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import BaseDialog from 'src/components/base/baseDialog'
import DialogButton from '../base/dialogButton'
import { CenterBox, Grid2 } from '../base/grid'
import { Box, Typography } from '@mui/material'
import PoolHeader from './dialog/PoolHeader'
import PoolStats from './dialog/PoolStats'
import PoolPrice from './dialog/PoolPrice'
import PriceRange from './dialog/PriceRange'
import PriceInput from './dialog/PriceInput'
import AddLiquidity from './dialog/AddLiquidity'
import TokenSelectorDialog from './token/TokenSelectorDialog'
import { useZapAction } from 'src/hooks/useZapAction'
import ZapActionButton from './ZapActionButton'
import PreviewDialog from '../dialog/previewDialog'
import { useLiquidityDialogs } from 'src/hooks/useLiquidityDialogs'
import LiquidityRange from './LiquidityRange'
import PositionLiquidity from './PositionLiquidity'
import RemoveLiquidity from './RemoveLiquidity'
import ZapOut from './dialog/ZapOut'
import ZapIn from './dialog/ZapIn'
import ZapOutPreviewDialog from './dialog/ZapOutPreviewDialog'

const PoolDialog = () => {
  const { isLoadingInfo, pool, revertPrice, liquidityType } = useAddLiquidity()
  const { setLiquidityModal, openTokenSelectDialog } = useLiquidityDialogs()
  const { position, tokensForZap } = useZapAction()
  const { token0, token1, type } = pool || {}

  const closeDialog = useCallback(() => {
    setLiquidityModal(null)
  }, [setLiquidityModal])

  const title = useMemo(() => {
    if (isLoadingInfo) {
      return 'Loading...'
    }

    if (type == 'error') {
      return 'error'
    }

    if (liquidityType === 'add') {
      return `Add Liquidity ${token0?.symbol}/${token1?.symbol}`
    } else if (liquidityType === 'increase') {
      return `Increase Liquidity ${token0?.symbol}/${token1?.symbol}`
    } else if (liquidityType === 'remove') {
      return `Remove Liquidity ${token0?.symbol}/${token1?.symbol}`
    }

    return `error`
  }, [isLoadingInfo, type, token0, token1])

  const liquidityTokens = () => {
    return tokensForZap?.map((_, index) => <AddLiquidity key={index} index={index} />)
  }

  return (
    <BaseDialog openDialog={!!pool && type != 'error'} closeDialog={closeDialog} title={title} width='800px'>
      <PoolHeader />

      {pool && (
        <Box sx={{ overflowY: 'auto', maxHeight: '600px', p: 2 }}>
          <Grid2 mt={4}>
            <Box display='flex' flexDirection='column' gap={3}>
              <PoolStats />
              <PoolPrice />
              {!pool.positionInfo.ticks && liquidityTokens()}
              {pool.positionInfo.ticks && (
                <>
                  {liquidityType != 'add' && (
                    <LiquidityRange
                      minPrice={position?.minPrice}
                      maxPrice={position?.maxPrice}
                      token0={token0}
                      token1={token1}
                      revertPrice={revertPrice}
                    />
                  )}
                  {liquidityType == 'add' ? (
                    <>
                      <PriceRange />
                      <PriceInput type='PriceLower' />
                      <PriceInput type='PriceUpper' />
                    </>
                  ) : liquidityType == 'remove' ? (
                    <RemoveLiquidity position={position} />
                  ) : liquidityType == 'increase' ? (
                    <PositionLiquidity position={position} />
                  ) : null}
                </>
              )}
            </Box>
            <Box display='flex' flexDirection='column' gap={3}>
              {liquidityType !== 'remove' && pool.positionInfo.ticks && liquidityTokens()}
              {liquidityType !== 'remove' && tokensForZap?.length < 5 && (
                <Typography
                  className='text-accent'
                  sx={{ cursor: 'pointer', color: '#00cc33' }}
                  onClick={() => openTokenSelectDialog('ADD')}
                >
                  + Add more tokens
                </Typography>
              )}
              {liquidityType == 'remove' ? <ZapOut /> : <ZapIn />}
            </Box>
          </Grid2>
        </Box>
      )}

      <TokenSelectorDialog />

      <PreviewDialog />
      <ZapOutPreviewDialog />

      <CenterBox gap={3}>
        <DialogButton outlined text='Close' flex={1} onClick={closeDialog} />

        {liquidityType !== 'remove' && <ZapActionButton />}
      </CenterBox>
    </BaseDialog>
  )
}

export default memo(PoolDialog)
