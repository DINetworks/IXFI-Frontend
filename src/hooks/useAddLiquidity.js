import { useEarnPoolsStore } from 'src/store/useEarnPoolsStore'
import { useLiquidityPool } from './useLiquidityPool'
import { useV3Liquidity } from './useV3Liquidity'
import { useLiquidityDialogs } from './useLiquidityDialogs'

export const useAddLiquidity = () => {
  const { tokensForZap, zapOutToken, zapOutPercent, zapApiError } = useEarnPoolsStore(state => state.liquidityZap)

  const { pool, isLoadingInfo, chainId, ids, protocol, liquidityType, positionId, tokenId, dex } = useLiquidityPool()
  const v3Liquidity = useV3Liquidity()
  const dialogs = useLiquidityDialogs()

  const setLiquidityZapParam = (key, value) => {
    useEarnPoolsStore.setState(state => ({
      liquidityZap: {
        ...state.liquidityZap,
        [key]: value
      }
    }))
  }

  const setTokensForZap = tokens => {
    setLiquidityZapParam('tokensForZap', tokens)
  }

  const setZapOutToken = token => {
    setLiquidityZapParam('zapOutToken', token)
  }

  const setZapOutPercent = percent => {
    setLiquidityZapParam('zapOutPercent', percent)
  }

  const setZapApiError = error => {
    setLiquidityZapParam('zapApiError', error)
  }

  const setPositionId = id => {
    setLiquidityZapParam('positionId', id)
  }

  return {
    pool,
    isLoadingInfo,
    liquidityType,
    chainId,
    ids,
    dex,
    protocol,
    positionId,
    tokenId,
    setPositionId,
    tokensForZap,
    setTokensForZap,
    zapOutToken,
    setZapOutToken,
    zapOutPercent,
    setZapOutPercent,
    zapOutPercent,
    zapApiError,
    setZapApiError,
    ...v3Liquidity,
    ...dialogs
  }
}
