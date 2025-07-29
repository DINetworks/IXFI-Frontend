import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useTokenPrices = ({ addresses, chainId }) => {
  const fetchPrices = useCallback(
    async _addresses => {
      const { data: res } = await axios.post(`${process.env.NEXT_PUBLIC_TOKEN_API}/v1/public/tokens/prices`, {
        [chainId]: _addresses
      })

      return res?.data?.[chainId] || {}
    },
    [chainId]
  )

  const { data: prices = [], loading } = useQuery({
    queryKey: ['fetchTokenPrices', chainId, addresses.join(',')],
    queryFn: async () => {
      try {
        const prices2 = await fetchPrices(addresses)

        return addresses.reduce((acc, address) => {
          return {
            ...acc,
            [address]: prices2[address]?.PriceBuy || 0
          }
        }, {})
      } catch (e) {
        console.log(e.message)
        return addresses.reduce((acc, address) => {
          return {
            ...acc,
            [address]: { price: 0 }
          }
        }, {})
      }
    },
    enabled: !!chainId && addresses?.length != 0
  })

  return {
    loading,
    prices,
    fetchPrices
  }
}
