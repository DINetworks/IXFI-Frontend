import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { getSecurityTokenInfo } from 'src/components/utils/uniswap'

const useSecurityTokenInfo = (chainId, tokenAddress) => {
  const { data: securityInfo, loading } = useQuery({
    queryKey: ['tokenSecurityInfo', chainId, tokenAddress],
    queryFn: async () => {
      try {
        const tokenApi = `${process.env.NEXT_PUBLIC_GO_PLUS_API}/${chainId}?contract_addresses=${tokenAddress}`

        const { data } = await axios.get(tokenApi)

        return getSecurityTokenInfo(data.result?.[tokenAddress])
      } catch (e) {
        console.log(e.message)
      }
    },
    enabled: !!chainId && !!tokenAddress
  })

  return { securityInfo, loading }
}

export default useSecurityTokenInfo
