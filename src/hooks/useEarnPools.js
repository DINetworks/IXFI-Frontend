import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from 'wagmi/query'
import { useEarnPoolsStore } from 'src/store/useEarnPoolsStore'
import { supportedDexes } from 'src/configs/protocol'

const PAGE_SIZE = 10

export const useEarnPools = () => {
  const { tag, chainId, protocol, interval, query, sortBy, orderBy, page, poolsData } = useEarnPoolsStore()

  const setSearchParam = param => {
    useEarnPoolsStore.setState(param)
  }

  const setFilteredPools = data => {
    useEarnPoolsStore.setState({ poolsData: data })
  }

  const pageCount = useMemo(() => {
    return Math.ceil((poolsData?.pagination?.totalItems ?? 0) / PAGE_SIZE)
  }, [poolsData])

  const protocols = useMemo(() => {
    const dexes = supportedDexes.find(dexes => dexes.chainId == chainId)
    return dexes?.protocols || []
  }, [chainId])

  const { data: earnPools, isLoading } = useQuery({
    queryKey: ['fetchEarnPools'],
    queryFn: async () => {
      try {
        const { data: res } = await axios.get(process.env.NEXT_PUBLIC_EARN_POOLS)
        const { data, message } = res

        return data
      } catch (err) {
        console.log('error', err.message)
        return {}
      }
    },
    refetchInterval: 60000, // Poll every 3 seconds
    enabled: true
  })

  return {
    earnPools,
    isLoading,
    tag,
    chainId,
    protocols,
    protocol,
    interval,
    query,
    sortBy,
    orderBy,
    page,
    pageCount,
    setSearchParam,
    poolsData,
    setFilteredPools
  }
}
