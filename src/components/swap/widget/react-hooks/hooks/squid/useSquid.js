import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { keys } from '../../core/queries/queries-keys'
import { initializeSquidWithAssetsColors } from '../../services'
import { useAssetsColorsStore } from '../store/useAssetsColorsStore'
import { useSwapStore } from '../store/useSwapStore'

/**
 * Fetch squid info based on the current squid object
 * @param refetchInterval refetch at this frequency in milliseconds (or false to disable)
 * @returns tokens, chains, forceSquidInfoRefetch, squidInfoQuery
 */
export const useSquid = () => {
  // Use initial squid object (because has infos about integrator id, ect)
  const squid = useSwapStore(state => state.squid)
  const maintenanceMode = useSwapStore(state => state.maintenanceMode)
  const assetsColors = useAssetsColorsStore()

  /**
   * Fetch squid info
   * Will refetch every minute
   */
  const squidInfoQuery = useQuery({
    queryKey: keys().squidInfo(),
    queryFn: async () => {
      if (squid) {
        await squid?.init()
        initializeSquidWithAssetsColors(squid, assetsColors)
        return squid
      }
      return null
    }
  })

  const tokens = useMemo(() => {
    if ((squidInfoQuery?.data?.tokens ?? []).length > 0) {
      return squidInfoQuery?.data?.tokens
    } else {
      return squid?.tokens ?? []
    }
  }, [squidInfoQuery?.data?.tokens, squid?.tokens])

  const chains = useMemo(() => {
    if ((squidInfoQuery?.data?.chains ?? []).length > 0) {
      return squidInfoQuery?.data?.chains
    } else {
      return squid?.chains ?? []
    }
  }, [squidInfoQuery?.data?.chains, squid?.chains])

  // If needed, force refetch to get latest prices
  const forceSquidInfoRefetch = squidInfoQuery.refetch
  return {
    tokens,
    chains,
    forceSquidInfoRefetch,
    squidInfoQuery,
    maintenanceMode
  }
}
