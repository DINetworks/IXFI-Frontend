import { useSwap } from 'src/components/swap/widget/react-hooks'
import { useEffect, useRef } from 'react'
import { useSwapRouter } from './useSwapRouter'

/*
 * Listen to swap params changes and navigate to the previous route if there's a change
 * Useful when we need to control widget routing from an external app based on asset changes
 */
export const useSwapParamsListener = () => {
  const { fromToken, toToken } = useSwap()
  const { previousRoute, handleCloseModal, modalRoute } = useSwapRouter()
  const cachedFromToken = useRef(fromToken)
  const cachedToToken = useRef(toToken)

  useEffect(() => {
    const isSameFromToken =
      fromToken?.address === cachedFromToken.current?.address && fromToken?.chainId === cachedFromToken.current?.chainId

    const isSameToToken =
      toToken?.address === cachedToToken.current?.address && toToken?.chainId === cachedToToken.current?.chainId
    cachedFromToken.current = fromToken
    cachedToToken.current = toToken

    if ((!isSameFromToken || !isSameToToken) && modalRoute?.route.id !== 'transaction') {
      previousRoute()
      handleCloseModal()
    }
  }, [fromToken?.address, toToken?.address, fromToken?.chainId, toToken?.chainId, modalRoute?.route.id])
}
