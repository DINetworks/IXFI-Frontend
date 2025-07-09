import { useEffect, useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { useAddLiquidity } from './useAddLiquidity'
import { useZapAction } from './useZapAction'
import { erc20Abi } from 'viem'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { parseEther } from 'viem'
import { NETWORK_INFO } from 'src/configs/protocol'

export const useZapApproval = () => {
  const { address: account, chain } = useAccount()
  const publicClient = usePublicClient({ chain })
  const { data: walletClient } = useWalletClient()
  const { tokensForZap, chainId } = useAddLiquidity()
  const { zapInfo } = useZapAction()
  const [pendingApprove, setPendingApprove] = useState(false)
  const [invalidApproves, setInvalidApproves] = useState(false)
  const [allowances, setAllowances] = useState([])

  useEffect(() => {
    const checkAllowances = async () => {
      if (!account || !zapInfo?.routerAddress || !chainId) return

      const multicallAddress = NETWORK_INFO[chainId].multiCall
      if (!multicallAddress) {
        // Fallback to individual calls if multicall is not available
        const allowancePromises = tokensForZap.map(async token => {
          if (token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()) {
            return { ...token, allowance: parseEther('1000000') }
          }

          const allowance = await publicClient.readContract({
            address: token.address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [account, zapInfo.routerAddress]
          })

          return { ...token, allowance }
        })
        const resolvedAllowances = await Promise.all(allowancePromises)
        setAllowances(resolvedAllowances)

        const needsApproval =
          resolvedAllowances.filter(token => {
            return parseEther(token.amount.toString()) > token.allowance
          }).length > 0
        setInvalidApproves(needsApproval)
        return
      }

      const contracts = tokensForZap
        .filter(token => token.address.toLowerCase() !== NATIVE_EVM_TOKEN_ADDRESS.toLowerCase())
        .map(token => ({
          address: token.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account, zapInfo.routerAddress]
        }))

      const results = await publicClient.multicall({ contracts, multicallAddress })

      const resolvedAllowances = tokensForZap.map((token, index) => {
        if (token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()) {
          return { ...token, allowance: parseEther('1000000') }
        }
        const result = results.shift()
        return { ...token, allowance: result.status === 'success' ? result.result : 0 }
      })

      setAllowances(resolvedAllowances)

      const needsApproval =
        resolvedAllowances.filter(token => {
          return parseEther(token.amount.toString()) > token.allowance
        }).length > 0
      setInvalidApproves(needsApproval)
    }

    checkAllowances()
  }, [account, tokensForZap, zapInfo, publicClient, chainId])

  const handleApprove = async () => {
    if (!walletClient || !zapInfo?.routerAddress) return

    setPendingApprove(true)
    try {
      const tokensToApprove = allowances.filter(token => parseEther(token.amount.toString()) > token.allowance)

      const approvePromises = tokensToApprove.map(async token => {
        const { request } = await publicClient.simulateContract({
          address: token.address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [zapInfo.routerAddress, parseEther(token.amount.toString())],
          account
        })
        await walletClient.writeContract(request)
      })

      await Promise.all(approvePromises)
    } catch (error) {
      console.error('Approve error', error)
    } finally {
      setPendingApprove(false)
    }
  }

  return { invalidApproves, handleApprove, pendingApprove }
}
