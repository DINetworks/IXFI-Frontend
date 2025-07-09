import { useMemo } from 'react'
import { erc20Abi, getContract } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

export function useToken(chain, tokenAddress) {
  const { address } = useAccount()

  const publicClient = usePublicClient({ chain })
  const { data: walletClient } = useWalletClient({ chain })

  const tokenContract = useMemo(
    () =>
      getContract({
        address: tokenAddress,
        abi: erc20Abi,
        chain,
        client: {
          public: publicClient,
          wallet: walletClient
        }
      }),
    [tokenAddress, chain, publicClient, walletClient]
  )

  const getNonce = async () => {
    return await publicClient.getTransactionCount({
      address,
      blockTag: 'pending'
    })
  }

  const approveTokens = async (spender, tokenAmount) => {
    if (!spender || !tokenAmount) return

    try {
      const nonce = await getNonce()
      await tokenContract.write.approve([spender, tokenAmount], { account: walletClient.account, nonce })
    } catch (error) {
      console.error('Error approve tokens:', error)
      throw new Error('Failed to approve token')
    }
  }

  const getBalance = async () => {
    const balance = await tokenContract.read.balanceOf([address])
    return balance
  }

  const getAllowance = async spender => {
    if (!tokenAddress || !address || !spender) {
      return 0
    }

    const approvedAmount = await tokenContract.read.allowance([address, spender])
    return approvedAmount
  }

  return {
    tokenContract,
    getBalance,
    getAllowance,
    approveTokens
  }
}
