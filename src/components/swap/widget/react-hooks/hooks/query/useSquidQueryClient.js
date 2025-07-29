import { useQueryClient } from '@tanstack/react-query'
import { getPrefixKey } from '../../core/queries/queries-keys'

export const useSquidQueryClient = () => {
  const queryClient = useQueryClient()

  const invalidateQueries = key => {
    const prefixKey = getPrefixKey(key)
    queryClient.invalidateQueries(prefixKey)
  }

  const refetchQueries = key => {
    const prefixKey = getPrefixKey(key)
    queryClient.refetchQueries(prefixKey)
  }

  const invalidateAndRefetchQueries = key => {
    invalidateQueries(key)
    refetchQueries(key)
  }

  return {
    invalidateQueries,
    refetchQueries,
    invalidateAndRefetchQueries
  }
}
