import { useEffect, useMemo, useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { Alert, Box, Button, CircularProgress, Divider, Link, Stack, Typography } from '@mui/material'
import BaseDialog from 'src/components/base/baseDialog'
import DialogButton from 'src/components/base/dialogButton'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import { Icon } from '@iconify/react'
import { showToast } from 'src/components/utils/toast'
import { formatDisplayNumber, formatUnits, friendlyError, isTransactionSuccessful } from 'src/components/utils/uniswap'
import { DEX_INFO, NETWORK_INFO } from 'src/configs/protocol'
import { useAddLiquidity } from 'src/hooks'
import { useClaimFees } from 'src/hooks/useClaimFees'
import { useDialogs } from 'src/hooks/useDialogs'

const CollectFeeDialog = () => {
  const { switchChain } = useSwitchChain()
  const { setConnectDialog } = useDialogs()
  const { address, chainId: networkChainId } = useAccount()
  const [txHash, setTxHash] = useState(null)

  const [txStatus, setTxStatus] = useState('')
  const [attempTx, setAttempTx] = useState(false)
  const [showErrorDetail, setShowErrorDetail] = useState(false)
  const [txError, setTxError] = useState(null)

  const { collectUnclaimedFees } = useClaimFees()
  const { collectFeePosition, closeCollectFeeDialog } = useAddLiquidity()
  const { chainId, pool, tokenId, feePending } = collectFeePosition || {}

  const isSubmitting = attempTx || !!txHash
  const totalUnclaimedFees = feePending?.reduce((sum, fee) => sum + fee.quotes.usd.value, 0) || 0

  const buttonText = useMemo(() => {
    return !address
      ? 'Connect Wallet'
      : chainId != networkChainId
      ? 'Switch Network'
      : isSubmitting
      ? 'Collecting fees'
      : 'Claim Fees'
  })

  const handleCollectFees = async () => {
    if (!address) setConnectDialog(true)
    else if (chainId != networkChainId) switchChain({ chainId })
    else {
      const dexName = pool?.project
      const nftManager = Object.values(DEX_INFO).find(dex => dex.name === dexName)?.nftManagerContract[chainId]

      if (!nftManager) {
        showToast('error', 'This feature is not available for this pool')

        return
      }

      try {
        setAttempTx(true)
        setTxHash(null)
        setTxError(null)
        const hash = await collectUnclaimedFees(nftManager, tokenId)

        setTxHash(hash)
        setAttempTx(false)
      } catch (error) {
        console.error('Error collecting fees:', error)

        setAttempTx(false)
        setTxError(error)
      }
    }
  }

  useEffect(() => {
    if (txHash) {
      const i = setInterval(() => {
        isTransactionSuccessful(NETWORK_INFO[chainId].defaultRpc, txHash).then(res => {
          if (!res) return
          if (res.status) {
            setTxStatus('success')
          } else setTxStatus('failed')
        })
      }, 10000)

      return () => {
        clearInterval(i)
      }
    }
  }, [chainId, txHash])

  return (
    <BaseDialog
      title='Claim Fees'
      width='480px'
      openDialog={!!collectFeePosition}
      closeDialog={closeCollectFeeDialog}
    >
      <Typography
        variant='h5'
        sx={{ textAlign: 'center', mb: 2 }}
      >
        You are currently claiming fees from your liquidity position.
      </Typography>
      {!isSubmitting && (
        <Box sx={{ background: '#0005', borderRadius: 2, p: 4, textAlign: 'center' }}>
          <BetweenBox mb={2}>
            <Typography
              variant='body2'
              color='textSecondary'
            >
              Total Value
            </Typography>
            <Typography color={'#fff'}>
              $ {formatDisplayNumber(totalUnclaimedFees, { significantDegits: 4 })}
            </Typography>
          </BetweenBox>
          {feePending?.map((fee, index) => (
            <BetweenBox
              key={index}
              mb={2}
            >
              <CenterBox gap={1}>
                <img
                  src={fee.token.logo ?? '/images/default-token.png'}
                  alt=''
                  className='earn-token'
                />
                <Typography variant='body2'>
                  {formatDisplayNumber(formatUnits(fee.balance, fee.token.decimals), { significantDegits: 6 })}{' '}
                  {fee.token.symbol}
                </Typography>
              </CenterBox>

              <Typography
                variant='body2'
                color='textSecondary'
              >
                ${formatDisplayNumber(fee.quotes.usd.value, { significantDegits: 4 })}
              </Typography>
            </BetweenBox>
          ))}
        </Box>
      )}

      <Stack spacing={2}>
        {txError && (
          <Alert severity='error'>
            <Typography>{friendlyError(txError)}</Typography>
            {showErrorDetail && <Typography variant='caption'>{txError.message || JSON.stringify(txError)}</Typography>}
            <Button
              size='small'
              onClick={() => setShowErrorDetail(prev => !prev)}
            >
              {showErrorDetail ? 'Hide Details' : 'Show Details'}
            </Button>
          </Alert>
        )}

        {isSubmitting && (
          <Box textAlign='center'>
            {txStatus === 'success' ? (
              <Icon
                icon='icon-park-solid:check-one'
                color='#33cc55'
                fontSize='1.5rem'
              />
            ) : txStatus === 'failed' ? (
              <Icon
                icon='ix:error-filled'
                color='#cc3300'
                fontSize='large'
              />
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
              <Typography
                variant='body2'
                color='text.secondary'
                align='center'
              >
                Confirm this transaction in your wallet - Caliming{' '}
              </Typography>
            )}

            {txHash && !txStatus && (
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Waiting for the transaction to be mined
              </Typography>
            )}

            <Divider sx={{ width: '100%' }} />

            {txHash && chainId && (
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

            <Box
              display='flex'
              mt={2}
              gap={2}
              width='100%'
            >
              <Button
                fullWidth
                variant={'contained'}
                onClick={closeCollectFeeDialog}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Stack>

      {!txHash && (
        <CenterBox
          gap={3}
          mb={2}
        >
          <DialogButton
            outlined
            text='Close'
            flex={1}
            onClick={closeCollectFeeDialog}
          />

          <DialogButton
            text={buttonText}
            disabled={isSubmitting}
            flex={1}
            onClick={handleCollectFees}
          />
        </CenterBox>
      )}
    </BaseDialog>
  )
}

export default CollectFeeDialog
