import { useMemo } from 'react'
import { formatDisplayNumber, formatUnits, toRawString } from 'src/components/utils/uniswap'

export const useZapDerivedInfo = (zapInfo, pool, position) => {
  const { token0, token1 } = pool || {}

  const zapDetails = zapInfo?.zapDetails || {}

  const addLiquidityInfo = useMemo(
    () => zapDetails.actions?.find(item => item.type === 'ACTION_TYPE_ADD_LIQUIDITY'),
    [zapDetails.actions]
  )

  const addedAmount0 = useMemo(
    () => formatUnits(addLiquidityInfo?.addLiquidity.token0.amount || '0', token0?.decimals ?? 0),
    [addLiquidityInfo, token0]
  )

  const addedAmount1 = useMemo(
    () => formatUnits(addLiquidityInfo?.addLiquidity.token1.amount || '0', token1?.decimals ?? 0),
    [addLiquidityInfo, token1]
  )

  const amount0 =
    !position || !token0?.decimals ? 0 : +toRawString(BigInt(position.currentAmounts[0].balance), token0?.decimals)

  const amount1 =
    !position || !token1?.decimals ? 0 : +toRawString(BigInt(position.currentAmounts[1].balance), token1?.decimals)

  const positionAmount0Usd = (amount0 * +(addLiquidityInfo?.addLiquidity.token0.amountUsd || 0)) / +addedAmount0 || 0
  const positionAmount1Usd = (amount1 * +(addLiquidityInfo?.addLiquidity.token1.amountUsd || 0)) / +addedAmount1 || 0

  const addedAmountUsd = useMemo(
    () => +(zapInfo?.positionDetails?.addedAmountUsd || 0) + positionAmount0Usd + positionAmount1Usd,
    [zapInfo, positionAmount0Usd, positionAmount1Usd]
  )

  const addedToken0Usd = useMemo(() => addLiquidityInfo?.addLiquidity.token0.amountUsd || 0, [addLiquidityInfo])

  const addedToken1Usd = useMemo(() => addLiquidityInfo?.addLiquidity.token1.amountUsd || 0, [addLiquidityInfo])

  const refundInfo = useMemo(
    () => zapDetails.actions?.find(item => item.type === 'ACTION_TYPE_REFUND'),
    [zapDetails.actions]
  )

  const filterRefund = token =>
    refundInfo?.refund.tokens.filter(item => item.address.toLowerCase() === token?.address?.toLowerCase()) || []

  const refundToken0 = useMemo(() => filterRefund(token0), [token0])
  const refundToken1 = useMemo(() => filterRefund(token1), [token1])

  const refundAmount = (tokens, decimals) =>
    formatDisplayNumber(formatUnits(tokens.reduce((acc, cur) => acc + BigInt(cur.amount), 0n).toString(), decimals), {
      significantDigits: 6
    })

  const refundAmount0 = useMemo(() => refundAmount(refundToken0, token0?.decimals), [refundToken0, token0])
  const refundAmount1 = useMemo(() => refundAmount(refundToken1, token1?.decimals), [refundToken1, token1])

  const refundUsd = useMemo(
    () => refundInfo?.refund.tokens.reduce((acc, cur) => acc + +cur.amountUsd, 0) || 0,
    [refundInfo]
  )
  const initUsd = useMemo(() => Number(zapDetails.initialAmountUsd || 0), [zapDetails])
  const suggestedSlippage = useMemo(() => (zapDetails.suggestedSlippage || 100) / 1e4, [zapDetails])

  const feeInfo = useMemo(
    () => zapInfo?.zapDetails?.actions?.find(item => item.type === 'ACTION_TYPE_PROTOCOL_FEE'),
    [zapInfo]
  )

  const partnerFeeInfo = useMemo(
    () => zapInfo?.zapDetails?.actions?.find(item => item.type === 'ACTION_TYPE_PARTNER_FEE'),
    [zapInfo]
  )

  const protocolFee = useMemo(() => ((feeInfo?.protocolFee.pcm || 0) / 1e5) * 100, [feeInfo])
  const partnerFee = useMemo(() => ((partnerFeeInfo?.partnerFee.pcm || 0) / 1e5) * 100, [partnerFeeInfo])

  return {
    amount0,
    amount1,
    positionAmount0Usd,
    positionAmount1Usd,
    addedAmountUsd,
    addedAmount0,
    addedAmount1,
    addedToken0Usd,
    addedToken1Usd,
    refundUsd,
    refundToken0,
    refundAmount0,
    refundToken1,
    refundAmount1,
    initUsd,
    suggestedSlippage,
    feeInfo,
    partnerFeeInfo,
    protocolFee,
    partnerFee
  }
}
