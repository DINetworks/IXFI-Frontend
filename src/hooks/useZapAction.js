import { useMemo, useState } from 'react'
import { NETWORK_INFO } from 'src/configs/protocol'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { useAddLiquidity } from './useAddLiquidity'
import { useMarketPrice } from './useMarketPrice'
import { useZapTokenList } from './useZapTokenList'
import { useZapInfo } from './useZapInfo'
import { useZapPriceImpact } from './useZapPriceImpact'
import { useZapHandlers } from './useZapHandlers'
import { useZapDerivedInfo } from './useZapDerivedInfo'
import { useZapValidation } from './useZapValidation'
import { usePositionDetail } from './usePositionDetail'
import { useZapOutAction } from './useZapOutAction'
import { useDebounce } from './useDebounce'
import { useZapOutDerivedInfo } from './useZapOutDerivedInfo'

export const useZapAction = () => {
  const {
    isLoadingInfo,
    chainId,
    pool,
    ids,
    protocol,
    liquidityType,
    dex,
    debounceTickUpper,
    debounceTickLower,
    positionId,
    tokenId,
    tokensForZap,
    setTokensForZap,
    zapOutToken,
    setZapOutToken,
    zapOutPercent,
    setZapOutPercent,
    setZapApiError
  } = useAddLiquidity()

  const { importedTokens, allTokens, fetchTokenInfo, removeToken } = useZapTokenList()
  const { errorNoneForFetch, balances } = useZapValidation()

  const { position, isLoadingPosition, fetchPositionError } = usePositionDetail({
    positionId,
    chainId,
    dex
  })

  const tokensInUsdPrice = useMarketPrice(
    chainId,
    tokensForZap
      ?.map(token =>
        token.address.toLowerCase() !== NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()
          ? token.address
          : NETWORK_INFO[chainId].wrappedToken.address
      )
      ?.join(',')
  )

  const [loading] = useState(false)

  const zapInfo = useZapInfo(
    pool,
    protocol,
    debounceTickUpper,
    debounceTickLower,
    positionId,
    tokensForZap,
    isLoadingInfo,
    errorNoneForFetch,
    setZapApiError
  )

  const tmpLiquidityOut = useMemo(() => {
    if (position?.liquidity) {
      const out = (BigInt(position.liquidity) * BigInt(zapOutPercent * 1000)) / BigInt(1e5)

      return out.toString()
    }

    return 0
  }, [zapOutPercent, position])

  const liquidityOut = useDebounce(tmpLiquidityOut, 300)

  const { zapOutInfo, isLoadingZapOutRoute } = useZapOutAction({
    chainId,
    poolAddress: ids,
    protocol,
    positionId: tokenId,
    liquidityOut,
    tokenOut: zapOutToken
  })

  const {
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
  } = useZapDerivedInfo(zapInfo, pool, isLoadingPosition ? null : position)

  const { aggregatorSwapInfo, poolSwapInfo, priceImpact, piRes, swapPi, swapPiRes } = useZapPriceImpact(
    zapInfo,
    pool,
    tokensForZap,
    chainId,
    feeInfo
  )

  const { selectTokensForZap, handleUpdateToken, handleUpdateTokenAmount, removeTokenForZap } =
    useZapHandlers(setTokensForZap)

  const zapOutDerivedInfo = useZapOutDerivedInfo({
    zapDetails: zapOutInfo?.zapDetails,
    pool,
    chainId,
    isLoadingInfo,
    zapOutToken
  })

  const { token0, token1, swapFee } = pool || {}
  const zapDetails = zapInfo?.zapDetails || {}

  return {
    loading,
    token0,
    token1,
    swapFee,
    zapInfo,
    zapDetails,
    aggregatorSwapInfo,
    poolSwapInfo,
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
    priceImpact,
    piRes,
    swapPi,
    swapPiRes,
    feeInfo,
    partnerFeeInfo,
    protocolFee,
    partnerFee,
    liquidityType,
    tokensForZap,
    setTokensForZap,
    selectTokensForZap,
    zapOutToken,
    setZapOutToken,
    zapOutPercent,
    setZapOutPercent,
    handleUpdateToken,
    handleUpdateTokenAmount,
    removeTokenForZap,
    tokensInUsdPrice,
    importedTokens,
    allTokens,
    fetchTokenInfo,
    removeToken,
    balanceTokens: balances,
    position,
    isLoadingPosition,
    fetchPositionError,
    isLoadingZapOutRoute,
    zapOutInfo,
    zapOutDerivedInfo
  }
}
