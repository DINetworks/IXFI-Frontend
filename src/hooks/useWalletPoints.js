import { useCallback, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export function useWalletPoints(wallet) {
  const [updating, setUpdating] = useState(false)

  const {
    data: points,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['walletPoints', wallet],
    queryFn: async () => {
      const { data } = await axios.get('/api/points', {
        params: { wallet: wallet.trim() },
        timeout: 10000
      })

      return data.points || 0
    },
    enabled: wallet && typeof wallet === 'string' && wallet.trim().length > 0,
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchIntervalInBackground: true, // Continue refetching when tab is not active
    staleTime: 5000,
    gcTime: 30000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: null
  })

  const addPoints = useCallback(
    async ({ txHash, sPoints, txUrl }) => {
      if (!wallet || typeof sPoints !== 'number') return

      setUpdating(true)

      try {
        await axios.post('/api/points', {
          wallet,
          txHash,
          txUrl,
          points: sPoints
        })
      } catch (err) {
        console.log(err.response?.data?.error || err.message)
      } finally {
        setUpdating(false)
      }
    },
    [wallet]
  )

  return {
    points,
    loading,
    updating,
    error,
    addPoints
  }
}
