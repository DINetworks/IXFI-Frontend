import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, usePublicClient, useSwitchChain, useWalletClient } from 'wagmi'
import { getPrefixKey, keys, QueryKeys } from '../../core/queries/queries-keys'
import { ChainType } from '@0xsquid/squid-types'
import { ethers } from 'ethers'
import ics20Abi from '../../core/abis/ics20.json'
import { CHAIN_IDS, nativeEvmTokenAddress } from '../../core/constants'
import { isEvmosChain, isProblematicConnector, sleep } from '../../services'
import { useSquidChains } from '../chains/useSquidChains'
import { useSwapStore } from '../store/useSwapStore'
import { useSwap } from '../swap/useSwap'
import { useMultiChainWallet } from '../wallet/useMultiChainWallet'
import { useSigner } from '../wallet/useSigner'
import { useErc20Allowance } from './useErc20Allowance'
import { useIcs20Allowance } from './useIcs20Allowance'

export const useApproval = ({ squidRoute }) => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const queryClient = useQueryClient()
  const squid = useSwapStore(state => state.squid)
  const { fromChain, fromToken, fromPrice, isSameChain } = useSwap()
  const { evmSigner } = useSigner({ chain: fromChain })
  const { connector: activeConnector } = useAccount()
  const { getChainType } = useSquidChains()
  const { switchChainAsync } = useSwitchChain()
  const {
    connectedAddress: { address: sourceUserAddress }
  } = useMultiChainWallet(fromChain)
  const isSrcChainEvmos = isEvmosChain(fromChain)
  const isSagaSameChainSwap = isSameChain && fromChain?.chainId.toString() === CHAIN_IDS.SAGA_EVM.toString()
  // Use ICS20 for Evmos chains, except for SAGA same chain swaps
  const useIcs20 = isSrcChainEvmos && !isSagaSameChainSwap

  const {
    hasAllowance: hasErc20Allowance,
    query: erc20AllowanceQuery,
    allowanceInWei: erc20AllowanceInWei
  } = useErc20Allowance({
    tokenAddress: fromToken?.address,
    ownerAddress: sourceUserAddress,
    spenderAddress: squidRoute?.transactionRequest?.target,
    amount: BigInt(squidRoute?.params.fromAmount ?? '0'),
    chainId: Number(fromChain?.chainId),
    enabled: !useIcs20
  })

  const {
    hasAllowance: hasIcs20Allowance,
    query: ics20AllowanceQuery,
    allowanceInWei: ics20AllowanceInWei
  } = useIcs20Allowance({
    ownerAddress: sourceUserAddress,
    targetAddress: squidRoute?.transactionRequest?.target,
    amount: BigInt(squidRoute?.params.fromAmount ?? '0'),
    chainId: Number(fromChain?.chainId),
    enabled: useIcs20
  })

  const hasAllowance = useIcs20 ? hasIcs20Allowance : hasErc20Allowance
  const allowanceInWei = useIcs20 ? ics20AllowanceInWei : erc20AllowanceInWei
  const allowanceQuery = useIcs20 ? ics20AllowanceQuery : erc20AllowanceQuery

  /**
   * Checking if spending tokens is allowed for this source address
   * On Success: storing the transaction
   * On Error: Showing the error message if any
   * @returns {boolean} approved
   */
  const routeApproved = useQuery({
    queryKey: keys().routeApproved(squidRoute, allowanceInWei),
    queryFn: async () => {
      // Approval is only needed for EVM chains
      if (getChainType(squidRoute?.params.fromChain) === ChainType.EVM) {
        return hasAllowance
      }

      return true
    },
    enabled: !!squidRoute && !!sourceUserAddress && !allowanceQuery?.isLoading && allowanceQuery?.isFetched
  })

  // USDT has a very specific way of handling approvals
  // ```
  /// To change the approve amount you first have to reduce the addresses`
  //  allowance to zero by calling `approve(_spender, 0)` if it is not
  //  already 0 to mitigate the race condition described here:
  //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
  // ```
  // This is why we had an unpredictable gas error for USDT approvals
  // So it needs a custom gas limit
  //
  // TODO: We're only doing it for USDT on Ethereum Mainnet, need to check if it's needed for USDT on other chains
  const approveSpecificTokenToZero = async token => {
    if (walletClient && token.symbol.toLowerCase() === 'usdt' && token.chainId === CHAIN_IDS.ETHEREUM && fromToken) {
      const fromChainRouterAddress = squidRoute?.transactionRequest?.target
      const allowance = await publicClient?.readContract({
        address: token.address,
        abi: [
          {
            constant: true,
            inputs: [
              { name: '_owner', type: 'address' },
              { name: '_spender', type: 'address' }
            ],
            name: 'allowance',
            outputs: [{ name: 'remaining', type: 'uint256' }],
            type: 'function'
          }
        ],
        functionName: 'allowance',
        args: [sourceUserAddress, fromChainRouterAddress]
      })

      if (allowance && BigInt(allowance.toString()) > BigInt(0) && publicClient) {
        const approveAbi = [
          {
            constant: false,
            inputs: [
              { name: '_spender', type: 'address' },
              { name: '_value', type: 'uint256' }
            ],
            name: 'approve',
            outputs: [],
            type: 'function'
          }
        ]

        const contractCallArgs = {
          address: token.address,
          abi: approveAbi,
          functionName: 'approve',
          args: [fromChainRouterAddress, BigInt(0)],
          account: sourceUserAddress
        }

        let request

        try {
          const estimatedGas = await publicClient.estimateContractGas(contractCallArgs)
          const gasLimit = (estimatedGas * 120n) / 100n
          const simulation = await publicClient.simulateContract({
            ...contractCallArgs,
            gas: gasLimit
          })

          request = simulation.request
        } catch (estimationError) {
          const simulation = await publicClient.simulateContract({
            ...contractCallArgs,
            gas: 100000n // Fallback gas limit
          })

          request = simulation.request
        }
        if (request) {
          await walletClient.writeContract(request)
        }
      }
    }
    return true
  }

  /**
   * Manually approve route if necessary
   */
  const approveRoute = useMutation({
    mutationFn: async () => {
      try {
        if (fromToken?.address === nativeEvmTokenAddress) {
          return true
        }

        if (!!squidRoute && walletClient && fromToken && evmSigner && squid) {
          await approveSpecificTokenToZero(fromToken)

          try {
            // If needed, we can switch the chain here
            // If already on the correct chain, this will do nothing
            await switchChainAsync({ chainId: Number(fromChain?.chainId) })
          } catch (error) {
            console.error('Error switching network:', error)
          }

          let approveTx
          if (useIcs20) {
            const channel = squidRoute.estimate.actions[0].data.ibcChannel
            const ics20Interface = new ethers.Interface(ics20Abi)
            const approveData = ics20Interface.encodeFunctionData('approve', [
              squidRoute.params.fromAddress,
              [
                {
                  sourcePort: 'transfer',
                  sourceChannel: channel,
                  spendLimit: [
                    {
                      denom: squidRoute.estimate.actions[0].fromToken.originalAddress,
                      amount: squidRoute.params.fromAmount
                    }
                  ],
                  allowList: [],
                  allowedPacketData: ['*']
                }
              ]
            ])
            approveTx = await evmSigner.sendTransaction({
              to: squidRoute.transactionRequest.target,
              data: approveData,
              value: '0',
              gasLimit: squidRoute.transactionRequest.gasLimit,
              gasPrice: squidRoute.transactionRequest.gasPrice
            })
          } else {
            approveTx = await squid.approveRoute({
              route: squidRoute,
              signer: evmSigner,
              // For security reasons, we don't want to allow infinite approvals in our frontends
              executionSettings: {
                infiniteApproval: false
              }
            })
          }
          if (isProblematicConnector(activeConnector)) {
            await sleep(3_000)
          }
          await approveTx?.wait()

          return true
        }

        return false
      } catch (error) {
        // Keep the error in the console to debug future issues
        console.error(error)

        return false
      }
    },
    onSuccess: async () => {
      await allowanceQuery?.refetch()
      queryClient.invalidateQueries(getPrefixKey(QueryKeys.RouteApproved))
      // After an approval, we refetch the transaction query with all required parameters
      // This is to ensure we're using the latest expiry timestamp
      if (squidRoute) {
        queryClient.refetchQueries({
          queryKey: keys().transaction(
            squidRoute.params.fromChain,
            squidRoute.params.toChain,
            squidRoute.params.toToken,
            squidRoute.params.fromToken,
            fromPrice,
            squidRoute.params.slippage,
            squidRoute.params.receiveGasOnDestination,
            squidRoute.params.fromAddress,
            squidRoute.params.bypassGuardrails,
            squidRoute.params.toAddress,
            squidRoute.params.fallbackAddresses?.[0]?.address,
            squidRoute.params.quoteOnly,
            getChainType(squidRoute.params.fromChain),
            squidRoute.params.preHook,
            squidRoute.params.postHook
          )
        })
      }
    }
  })

  return {
    routeApproved,
    approveRoute,
    allowanceInWei
  }
}
