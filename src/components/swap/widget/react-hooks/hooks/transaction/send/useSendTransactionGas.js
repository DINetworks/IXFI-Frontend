import { ChainType } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { Interface } from 'ethers'
import { erc20Abi } from 'viem'
import { getClient } from '../../../core/client'
import { getFeeRate } from '../../../core/connectors/bitcoin/helpers'
import { nativeEvmTokenAddress } from '../../../core/constants'
import { keys } from '../../../core/queries/queries-keys'

export function useSendTransactionGas({ chain, token, from }) {
  return useQuery({
    queryKey: keys().sendTransactionGas(chain?.chainId, token?.address, from),
    queryFn: async () => {
      if (!chain || !token) throw new Error('Missing params')

      switch (chain.chainType) {
        case ChainType.EVM: {
          const client = await getClient(chain)
          const feeData = await client.getFeeData()
          if (!feeData.maxFeePerGas) return BigInt(0)
          const dummyAddress = '0x1111111111111111111111111111111111111111'
          // Some RPC providers require the sender to have enough balance, otherwise estimation reverts
          // so we'll try to use the user provided address when possible
          const sender = from || dummyAddress
          if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
            const gas = await client.estimateGas({
              from: sender,
              to: dummyAddress,
              value: 1,
              chainId: chain.chainId
            })
            return gas * feeData.maxFeePerGas
          }
          const erc20Interface = new Interface(erc20Abi)
          const data = erc20Interface.encodeFunctionData('transfer', [dummyAddress, 1])

          const gas = await client.estimateGas({
            from: sender,
            to: token.address,
            data,
            chainId: chain.chainId
          })

          return gas * feeData.maxFeePerGas
        }
        case ChainType.COSMOS: {
          // TODO: get gas estimation from backend
          return BigInt(0)
        }
        case ChainType.SOLANA: {
          // TODO: get gas estimation from backend
          return BigInt(5000)
        }
        case ChainType.BTC: {
          const feeRate = await getFeeRate()
          // average vBytes for a segwit tx (2 inputs, 2 outputs)
          const vBytes = 378
          const feeSats = feeRate * vBytes
          // TODO: get gas estimation from backend?
          return BigInt(feeSats)
        }
        default:
          throw new Error(`Gas estimation not implemented for chain type ${chain.chainType}`)
      }
    },
    enabled: !!chain && !!token,
    // 5 minutes
    staleTime: 1_000 * 60 * 5,
    refetchInterval: 1_000 * 60 * 5
  })
}
