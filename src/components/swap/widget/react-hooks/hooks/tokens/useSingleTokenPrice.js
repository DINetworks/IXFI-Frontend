import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { keys } from '../../core/queries/queries-keys'
import { convertTokenAmountToUSD } from '../../services'

/**
 * If a component need to display price of a single token
 * @param tokenData
 * @returns
 */
export const useSingleTokenPrice = tokenData => {
  const queryClient = useQueryClient()
  const [tokenPrice, setTokenPrice] = useState(tokenData?.usdPrice)

  useEffect(() => {
    const updatePrice = data => {
      const newPrice =
        data?.tokens.find(t => t.address === tokenData?.address && t.chainId === tokenData?.chainId)?.usdPrice ??
        tokenData?.usdPrice
      setTokenPrice(newPrice)
    }

    // Initial price set
    setTokenPrice(tokenData?.usdPrice)

    // Subscribe to react-query changes
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      // Compare both key arrays with join
      // Because we can receive other events
      const sameKey = keys().squidInfo().join() === event?.query?.queryKey?.join()

      // Had to local debug to get this updated event type "observerResultsUpdated"
      if (sameKey && event.type === 'observerResultsUpdated') {
        updatePrice(event.query.state.data)
      }
    })

    // Unsubscribe on unmount
    return () => unsubscribe()
  }, [queryClient, tokenData])

  const getUSDValue = useCallback(
    balance => {
      return convertTokenAmountToUSD(balance, tokenPrice ?? '0') ?? '0'
    },
    [tokenPrice]
  )

  return { tokenPrice, getUSDValue }
}
