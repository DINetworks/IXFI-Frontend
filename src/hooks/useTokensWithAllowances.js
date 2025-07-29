import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { erc20Abi, encodeFunctionData, formatUnits } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import HttpAdapter from 'src/widget/sdk/adapter/HttpAdapter'
import { useTokenAndChainStore } from 'src/store/useTokenAndChainStore'
import { nativeEvmTokenAddress, sortAllTokens } from 'src/widget/react-hooks'
import { multicallAbi, multicallAddress } from 'src/widget/react-hooks/core/multicall3'
import { bsc } from 'viem/chains'
import { META_CONTRACT } from 'src/configs/constant'
import { ethers, JsonRpcProvider } from 'ethers'

export const useTokensWithAllowances = () => {
  const {
    tokens: squidTokens,
    chains: squidChains,
    initializedAt,
    setTokenAndChain
  } = useTokenAndChainStore(state => state)
  const { address: owner } = useAccount()
  const chainId = useChainId()

  const chain = bsc
  const spender = META_CONTRACT
  const integratorId = process.env.NEXT_PUBLIC_SQUID_CORAL_INTEGRATOR

  useEffect(() => {
    const now = Date.now() / 1000

    const httpInstance = new HttpAdapter({
      baseURL: 'https://v2.api.squidrouter.com',
      config: {
        integratorId: integratorId,
        apiUrl: 'https://v2.api.squidrouter.com'
      },
      headers: {
        'x-integrator-id': integratorId
      },
      timeout: 5000
    })

    const getTokenAndChains = async () => {
      const response = await httpInstance.get('v2/sdk-info')
      if (response.status != 200) {
        throw new Error('SDK initialization failed')
      }

      const { tokens: _squidTokens, chains: _squidChains } = response.data

      setTokenAndChain({
        tokens: _squidTokens,
        chains: _squidChains,
        initializedAt: now
      })
    }

    if (initializedAt == 0 || now - initializedAt > 3600 * 24) getTokenAndChains()
  }, [initializedAt, setTokenAndChain])

  const tokens = useMemo(
    () =>
      squidTokens
        ?.filter(token => token.chainId.toString() == chain.id.toString() && token.address !== nativeEvmTokenAddress)
        .sort(sortAllTokens),
    [chain, squidTokens]
  )

  const tokenAddresses = useMemo(() => tokens.map(token => token.address), [tokens])

  const executeMulticall = async (multicall, calls, tokens) => {
    try {
      const results = await multicall.tryAggregate.staticCall(false, calls)

      const tokenWithResult = tokens.map((token, index) => {
        const [success, returnData] = results[index]

        const allowanceValue = !success || returnData == '0x' ? '0' : formatUnits(BigInt(returnData), token.decimals)

        return {
          token,
          allowance: allowanceValue
        }
      })
      return tokenWithResult
    } catch (error) {
      console.log(error)
      return tokens.map(token => ({
        token,
        result: { success: false, returnData: '' }
      }))
    }
  }

  // or however you get viem client
  const { data: tokensWithAllowance, refetch: refetchAllowances } = useQuery({
    queryKey: ['allowances', owner],
    queryFn: async () => {
      try {
        const calls = tokenAddresses.map(token => ({
          target: token,
          callData: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'allowance',
            args: [owner, spender]
          })
        }))

        const currentChain = squidChains.find(_chain => _chain?.id?.toString() == chain.id.toString())

        const provider = new JsonRpcProvider(currentChain.rpc)
        const multicall = new ethers.Contract(multicallAddress, multicallAbi, provider)
        const multicallResults = await executeMulticall(multicall, calls, tokens)

        return multicallResults
      } catch (error) {
        console.log(error)
      }
    },
    enabled: !!owner && !!chainId && tokenAddresses.length > 0
  })

  const approvedTokens = useMemo(
    () => tokensWithAllowance?.filter(tokenAllowance => !!tokenAllowance.allowance && tokenAllowance.allowance != '0'),
    [tokensWithAllowance]
  )

  return { tokensInChain: tokens, tokensWithAllowance, approvedTokens, refetchAllowances }
}
