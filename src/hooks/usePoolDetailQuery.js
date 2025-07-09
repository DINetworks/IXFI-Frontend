import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const usePoolDetailQuery = ({ chainId, address, protocol }) => {
  const { data: pool, isLoading: isLoadingInfo } = useQuery({
    queryKey: ['poolDetailInfo', chainId, address, protocol],
    queryFn: async () => {
      const poolRes = await axios.get(`${process.env.NEXT_PUBLIC_EARN_POOL_INFO}`, {
        params: {
          chainId,
          address,
          protocol
        }
      })

      const { data } = poolRes.data

      return data
    }
  })

  return {
    pool,
    isLoadingInfo
  }
}
