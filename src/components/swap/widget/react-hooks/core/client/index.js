import { ChainType } from '@0xsquid/squid-types'
import { StargateClient } from '@cosmjs/stargate'
import { SuiClient } from '@mysten/sui/client'
import { Connection as SolanaConnection } from '@solana/web3.js'
import { JsonRpcProvider } from 'ethers'
import { getWorkingCosmosRpcUrl } from '../../services/external/rpcService'
import { XrplRpcClient } from '../../services/external/xrplRpcClient'
import { SOLANA_RPC_URL } from '../constants'

const clientCache = new Map()

export async function getClient(chain) {
  const key = `${chain.chainType}:${chain.chainId}`
  if (clientCache.has(key)) {
    return clientCache.get(key)
  }

  const client = await createClient(chain)
  clientCache.set(key, client)

  return client
}

async function createClient(chain) {
  switch (chain.chainType) {
    case ChainType.EVM:
      return new JsonRpcProvider(chain.rpc)

    case ChainType.COSMOS:
      const rpcUrl = await getWorkingCosmosRpcUrl(chain)
      return await StargateClient.connect(rpcUrl)

    case ChainType.SOLANA:
      return new SolanaConnection(SOLANA_RPC_URL)

    case ChainType.BTC:
      return null

    case ChainType.SUI:
      return new SuiClient({
        url: chain.rpc
      })

    case ChainType.XRPL:
      return new XrplRpcClient(chain.rpc)
  }
}
