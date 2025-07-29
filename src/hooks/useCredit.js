import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { GAS_CREDIT_VAUT, TOKEN_ADDRESSES, TOKEN_CHAIN } from 'src/configs/constant'
import { getPublicClient } from 'src/wallet/utils'
import GasCreditVault from 'src/contracts/GasCreditVault.json'
import { formatNumber } from 'src/components/utils/format'
import { useToken } from './useToken'

export const useCredit = () => {
  const { address } = useAccount()
  const { getBalance: getDIBalance } = useToken(TOKEN_CHAIN, TOKEN_ADDRESSES.TOKEN)

  const { data: credit, refetch: refetchCredit } = useQuery({
    queryKey: ['credit', address],
    queryFn: async () => {
      const client = getPublicClient(TOKEN_CHAIN)

      const result = await client.readContract({
        address: GAS_CREDIT_VAUT,
        abi: GasCreditVault.abi,
        functionName: 'credits',
        args: [owner]
      })

      console.log(result)
      return formatNumber(result)
    },
    enabled: !!address
  })

  const { data: diBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['DIBalance', address],
    queryFn: async () => {
      const balance = await getDIBalance()

      return balance ? formatNumber(formatEther(dinBalance), 2) : '0'
    },
    refetchInterval: 3000,
    enabled: !!address
  })

  return {
    credit,
    refetchCredit,
    diBalance,
    refetchBalance
  }
}
