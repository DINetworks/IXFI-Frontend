import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Chip,
  Link as MuiLink,
  Alert,
  Tooltip
} from '@mui/material'

import { useAccount } from 'wagmi'
import {
  chainIdToChain,
  estimateGas,
  formatDisplayNumber,
  formatUnits,
  getCurrentGasPrice,
  isTransactionSuccessful
} from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'
import { useAddLiquidity, useZapAction } from 'src/hooks'
import { formatCurrency } from 'src/components/utils/format'
import BaseDialog from 'src/components/base/baseDialog'
import { BetweenBox, CenterBox, FullCenterBox } from 'src/components/base/grid'
import { onSubmitTx } from 'src/wallet/utils'
import { useTokenPrices } from 'src/hooks/useTokenPrices'
import { formatEther } from 'viem'
import SlippageWarning from './SlippageWarning'
import SwapPriceImpact from '../SwapPriceImpact'
import { Icon } from '@iconify/react'

export default function ZapOutPreviewDialog() {
  const [gasUsd, setGasUsd] = useState(null)
  const [buildData, setBuildData] = useState(null)
  const [error, setError] = useState('')
  const [showProcessing, setShowProcessing] = useState(false)
  const [submiting, setSubmiting] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [txStatus, setTxStatus] = useState('')

  const { address: account, chain } = useAccount()

  const { isLoadingInfo, pool, chainId, zapOutPreviewDialog, closeZapOutPreviewDialog } = useAddLiquidity()
  const { isLoadingPosition, zapOutInfo, zapOutDerivedInfo, zapOutToken } = useZapAction()
  const { amountOut, amountOutUsd, suggestedSlippage, piRes, swapPi, swapPiRes, zapPiRes, zapFee } =
    zapOutDerivedInfo || {}

  const { fetchPrices } = useTokenPrices({ addresses: [], chainId })

  const rpcUrl = NETWORK_INFO[chainId]?.defaultRpc
  const source = 'Kyberswap-Earn'

  useEffect(() => {
    if (!chainId || !zapOutInfo?.route || !zapOutPreviewDialog || !account) return

    fetch(`${process.env.NEXT_PUBLIC_ZAP_API}/${chainIdToChain[chainId]}/api/v1/out/route/build`, {
      method: 'POST',
      body: JSON.stringify({ sender: account, route: zapOutInfo.route, burnNft: false, source }),
      headers: { 'x-client-id': source }
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) setBuildData(res.data)
        else setError(res.message || 'Build failed')
      })
      .catch(err => setError(err.message || JSON.stringify(err)))
  }, [zapOutInfo?.route, zapOutPreviewDialog, account])

  useEffect(() => {
    if (!buildData || !account) return

    const wethAddress = NETWORK_INFO[chainId].wrappedToken.address.toLowerCase()

    ;(async () => {
      const [gasEstimation, gasPrice, nativeTokenPrice] = await Promise.all([
        estimateGas(rpcUrl, {
          from: account,
          to: buildData.routerAddress,
          value: '0x0',
          data: buildData.callData
        }).catch(() => '0'),
        getCurrentGasPrice(rpcUrl).catch(() => 0),
        fetchPrices([wethAddress])
          .then(prices => prices[wethAddress]?.PriceBuy || 0)
          .catch(() => 0)
      ])

      const gasUsd2 = formatEther(BigInt(gasPrice * Number(gasEstimation) * nativeTokenPrice))

      setGasUsd(gasUsd2)
    })()
  }, [buildData, account])

  useEffect(() => {
    if (txHash) {
      const i = setInterval(() => {
        isTransactionSuccessful(rpcUrl, txHash).then(res => {
          if (!res) return
          setTxStatus(res.status ? 'success' : 'failed')
        })
      }, 10000)

      return () => clearInterval(i)
    }
  }, [txHash])

  if (isLoadingInfo || isLoadingPosition || !zapOutToken || !zapOutInfo) return null

  const pi = {
    piHigh: swapPiRes.piRes.level === 'HIGH' || zapPiRes.level === 'HIGH',
    piVeryHigh: swapPiRes.piRes.level === 'VERY_HIGH' || zapPiRes.level === 'VERY_HIGH'
  }

  const closeProcessingModal = () => {
    closeZapOutPreviewDialog()
    setShowProcessing(false)
    setError('')
    setSubmiting(false)
  }

  const txProcessingModal = (
    <BaseDialog openDialog={showProcessing} closeDialog={closeProcessingModal}>
      <Box p={4}>
        {txHash ? (
          <Box textAlign='center'>
            <Typography variant='h5' display='flex' justifyContent='center' alignItems='center' gap={1} mb={2}>
              {txStatus === 'success' ? (
                <Icon icon='icon-park-solid:check-one' color='success' fontSize='2rem' />
              ) : txStatus === 'failed' ? (
                <Icon icon='ooui:alert' color='error' fontSize='2rem' />
              ) : (
                <CircularProgress size={20} />
              )}
              {txStatus === 'success'
                ? 'Zap Out Success!'
                : txStatus === 'failed'
                ? 'Transaction Failed!'
                : 'Processing Transaction'}
            </Typography>
            <Typography variant='body2'>
              {txStatus === 'success'
                ? 'You have successfully removed liquidity!'
                : txStatus === 'failed'
                ? 'An error occurred during the transaction.'
                : 'Waiting for transaction confirmation...'}
            </Typography>
            <MuiLink href={`${NETWORK_INFO[chainId].scanLink}/tx/${txHash}`} target='_blank' rel='noopener' mt={2}>
              View transaction ↗
            </MuiLink>
            <Button variant='contained' fullWidth sx={{ mt: 2 }} onClick={closeProcessingModal}>
              Close
            </Button>
          </Box>
        ) : submiting ? (
          <FullCenterBox>
            <CircularProgress /> Submitting transaction...
          </FullCenterBox>
        ) : error ? (
          <Alert severity='error'>{error}</Alert>
        ) : null}
      </Box>
    </BaseDialog>
  )

  return (
    <BaseDialog
      title='Remove Liquidity via Zap'
      width='480px'
      openDialog={zapOutPreviewDialog}
      closeDialog={closeZapOutPreviewDialog}
    >
      <Box display='flex' flexDirection='column' gap={2}>
        <CenterBox mt={2} gap={2}>
          <img src={pool.token0.logoURI ?? pool.token0.logo ?? '/images/default-token.png'} className='earn-token' />

          <img src={pool.token1.logoURI ?? pool.token1.logo ?? '/images/default-token.png'} className='earn-token' />

          <Chip label={`Fee ${pool.swapFee}%`} size='small' />
        </CenterBox>

        <Box my={2} p={4} bgcolor='#fff2' borderRadius={2}>
          <Typography>Zap-out Amount</Typography>
          <CenterBox mt={1} gap={1}>
            <img
              src={zapOutToken.logoURI ?? zapOutToken.logo ?? '/images/default-token.png'}
              className='earn-token small'
            />

            <Typography>
              {amountOut ? formatDisplayNumber(formatUnits(amountOut, zapOutToken.decimals)) : '--'}{' '}
              {zapOutToken.symbol}
            </Typography>

            <Typography variant='caption' color='text.secondary'>
              ~{amountOutUsd ? formatCurrency(+amountOutUsd) : '--'}
            </Typography>
          </CenterBox>
        </Box>

        <SlippageWarning slippage={100} suggestedSlippage={suggestedSlippage} showWarning={!!zapOutDerivedInfo} />

        <SwapPriceImpact swapPi={swapPi} swapPiRes={swapPiRes} />

        <BetweenBox className='text-xs'>
          <Tooltip title='The difference between input and estimated liquidity received (including remaining amount). Be careful with high value!'>
            <Box
              className={`text-subText ${
                piRes.level !== 'NORMAL'
                  ? piRes.level === 'HIGH'
                    ? 'border-warning text-warning'
                    : 'border-error text-error'
                  : 'border-subText'
              }`}
              sx={{ borderBottom: `1px dotted #ccc8` }}
            >
              Zap Impact
            </Box>
          </Tooltip>
          <Box
            className={
              piRes.level === 'VERY_HIGH' || piRes.level === 'INVALID'
                ? 'text-error'
                : piRes.level === 'HIGH'
                ? 'text-warning'
                : 'text-text'
            }
          >
            {zapOutDerivedInfo ? piRes.display : '--'}
          </Box>
        </BetweenBox>

        <BetweenBox>
          <Typography variant='body2' color='text.secondary'>
            Est. Gas Fee
          </Typography>
          <Typography>{gasUsd ? formatCurrency(gasUsd) : '--'}</Typography>
        </BetweenBox>

        <BetweenBox>
          <Typography variant='body2' color='text.secondary'>
            Zap Fee
          </Typography>
          <Typography>{zapFee.toFixed(3)}%</Typography>
        </BetweenBox>

        <Box p={2}>
          <Typography variant='body2' fontStyle='italic'>
            The information is intended solely for your reference at the time you are viewing. It is your responsibility
            to verify all information before making decisions
          </Typography>
        </Box>

        <Button
          fullWidth
          variant='contained'
          color={pi.piVeryHigh ? 'error' : pi.piHigh ? 'warning' : 'primary'}
          sx={{ my: 3 }}
          onClick={async () => {
            if (!account) return
            if (!buildData) return setShowProcessing(true)

            const txData = {
              from: account,
              to: buildData.routerAddress || '',
              value: '0x0',
              data: buildData.callData || ''
            }
            setShowProcessing(true)
            setSubmiting(true)
            try {
              const gas = await estimateGas(rpcUrl, txData)
              const txHash2 = await onSubmitTx(account, chain, { ...txData, gasLimit: gas })
              setTxHash(txHash2)
            } catch (err) {
              setSubmiting(false)
              setError(`Submit Tx Failed: ${err.message}`)
            }
          }}
        >
          Remove Liquidity
        </Button>

        {txProcessingModal}
      </Box>
    </BaseDialog>
  )
}
