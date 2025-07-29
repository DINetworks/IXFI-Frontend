import { ChainType } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { keys } from '../../core/queries/queries-keys'
import { getCosmosKey, suggestChainOrThrow } from '../../services/internal/cosmosService'
import { useCosmosSigner } from './useCosmos'

export const useCosmosForChain = chain => {
  const { keplrTypeWallet } = useCosmosSigner({ chain })

  const cosmosAddressQuery = useQuery({
    queryKey: keys().cosmosAddress(chain?.chainId),
    queryFn: async () => {
      if (!chain || !keplrTypeWallet) return ''

      try {
        const address = await getCosmosKey(chain.chainId, keplrTypeWallet)
        return address ?? ''
      } catch (error) {
        await suggestChainOrThrow({
          chain: chain,
          error,
          keplrTypeWallet
        })
        const address = await getCosmosKey(chain.chainId, keplrTypeWallet)

        return address ?? ''
      }
    },
    enabled: !!keplrTypeWallet && chain?.chainType === ChainType.COSMOS
  })

  return cosmosAddressQuery
}
