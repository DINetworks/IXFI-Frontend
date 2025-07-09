import { useState, memo } from 'react'
import { Box, Typography, Button, Stack, Divider, CircularProgress, Alert } from '@mui/material'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { friendlyError } from '../utils/uniswap'
import { DEX_INFO, NETWORK_INFO } from 'src/configs/protocol'
import Link from 'next/link'
import PoolHeader from '../earn/dialog/PoolHeader'
import EstimateLiquidity from './preview/EstimateLiquidity'
import PoolPrice from './preview/PoolPrice'
import Warning from './preview/Warning'
import BaseDialog from '../base/baseDialog'
import DialogButton from '../base/dialogButton'
import { Icon } from '@iconify/react'
import { useZapAction } from 'src/hooks/useZapAction'
import { formatCurrency } from 'src/components/utils/format'
import { BetweenBox } from '../base/grid'
import { useZapTransaction } from 'src/hooks/useZapTransaction'

function PreviewDialog({ onViewPosition }) {
  const { protocol, chainId, tokensForZap, zapPreviewDialog, closeZapPreviewDialog } = useAddLiquidity()
  const { token0, token1, swapFee, tokensInUsdPrice } = useZapAction()
  const { txHash, attempTx, txError, txStatus, gasUsd, handleZapClick } = useZapTransaction()

  const [showErrorDetail, setShowErrorDetail] = useState(false)

  const slippage = 50

  const dexName = DEX_INFO[protocol]
    ? typeof DEX_INFO[protocol].name === 'string'
      ? DEX_INFO[protocol].name
      : DEX_INFO[protocol].name[chainId]
    : ''

  const isSubmitting = attempTx || !!txHash

  if (!chainId) return null

  return (
    <BaseDialog
      title='Add Liquidity via Zap'
      openDialog={zapPreviewDialog}
      closeDialog={closeZapPreviewDialog}
      width='600px'
    >
      <Box p={3}>
        <Stack spacing={2}>
          <PoolHeader />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <BetweenBox>
          <Typography variant='subtitle1'>Zap-in Amount</Typography>
          <Box>
            {tokensForZap.map((token, idx) => (
              <Box key={token.address} display='flex' alignItems='center' gap={1}>
                <img src={token.logoURI} className='earn-token small' alt={token.symbol} />
                <Typography>
                  {token.amount} {token.symbol}
                </Typography>
                <Typography className='text-warning'>
                  ~ {formatCurrency(tokensInUsdPrice[idx] * parseFloat(token.amount))}
                </Typography>
              </Box>
            ))}
          </Box>
        </BetweenBox>
        <Stack spacing={1}>
          <PoolPrice />

          <EstimateLiquidity slippage={slippage} gasUsd={gasUsd} />

          <Warning slippage={slippage} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          {txError && (
            <Alert severity='error'>
              <Typography>{friendlyError(txError)}</Typography>
              {showErrorDetail && (
                <Typography variant='caption'>{txError.message || JSON.stringify(txError)}</Typography>
              )}
              <Button size='small' onClick={() => setShowErrorDetail(prev => !prev)}>
                {showErrorDetail ? 'Hide Details' : 'Show Details'}
              </Button>
            </Alert>
          )}

          {isSubmitting && (
            <Box textAlign='center'>
              {txStatus === 'success' ? (
                <Icon icon='icon-park-solid:check-one' color='#33cc55' fontSize='1.5rem' />
              ) : txStatus === 'failed' ? (
                <Icon icon='ix:error-filled' color='#cc3300' fontSize='large' />
              ) : (
                <CircularProgress />
              )}
              <Typography mt={2}>
                {txStatus === 'success'
                  ? 'Transaction successful'
                  : txStatus === 'failed'
                  ? 'Transaction failed'
                  : txHash
                  ? 'Processing transaction'
                  : 'Waiting for confirmation'}
              </Typography>

              {!txHash && (
                <Typography variant='body2' color='text.secondary' align='center'>
                  Confirm this transaction in your wallet - Zapping{' '}
                  {`${dexName} ${token0?.symbol}/${token1?.symbol} ${swapFee}%`}
                </Typography>
              )}

              {txHash && !txStatus && (
                <Typography variant='body2' color='text.secondary'>
                  Waiting for the transaction to be mined
                </Typography>
              )}

              <Divider sx={{ width: '100%' }} />

              {txHash && (
                <Link
                  href={`${NETWORK_INFO[chainId].scanLink}/tx/${txHash}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  underline='hover'
                  color='primary'
                  fontSize='0.875rem'
                  mb={2}
                >
                  View transaction ↗
                </Link>
              )}

              <Box display='flex' mt={2} gap={2} width='100%'>
                <Button fullWidth variant={onViewPosition ? 'outlined' : 'contained'} onClick={closeZapPreviewDialog}>
                  Close
                </Button>
                {txStatus === 'success' && onViewPosition && (
                  <Button fullWidth variant='contained' onClick={onViewPosition}>
                    View position
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Stack>

        {!isSubmitting && !txError && (
          <DialogButton
            fullWidth
            variant='contained'
            color='primary'
            onClick={handleZapClick}
            sx={{ mt: 4 }}
            text={'Add Liquidity'}
          />
        )}
      </Box>
    </BaseDialog>
  )
}

export default memo(PreviewDialog)
