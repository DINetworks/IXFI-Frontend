import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import axios from 'axios'

export const usePositionDetail = ({ positionId, chainId, dex }) => {
  const { address } = useAccount()

  const fetchPositionDetail = async () => {
    if (!address || !positionId || !chainId || !dex) {
      throw new Error('Missing required parameters')
    }

    const params = {
      addresses: address,
      chainIds: parseInt(chainId),
      positionId,
      protocols: dex
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_EARN_POSITIONS}`, { params })

      const { positions } = response.data?.data || {}

      // Find the specific position
      const position = positions[0]

      if (!position) {
        throw new Error('Position not found')
      }

      return position
    } catch (error) {
      console.error('Error fetching position detail:', error)
      throw error
    }
  }

  const {
    data: position,
    isLoading: isLoadingPosition,
    error: fetchPositionError
  } = useQuery({
    queryKey: ['positionDetail', address, positionId, chainId, dex],
    queryFn: fetchPositionDetail,
    enabled: !!(address && positionId && chainId && dex),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  return {
    position,
    isLoadingPosition,
    fetchPositionError
  }
}
