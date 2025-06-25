import { ChainType } from '@0xsquid/squid-types'
import { StargateClient } from '@cosmjs/stargate'
import { ethers, Interface, JsonRpcProvider } from 'ethers'
import { erc20Abi } from 'viem'
import { getClient } from '../../core/client'
import { nativeEvmTokenAddress, nativeSolanaTokenAddress, SOLANA_RPC_URL } from '../../core/constants'
import { getMulticall3Address, multicallAbi } from '../../core/multicall3'
import { normalizeIbcAddress } from '../internal/assetsService'
import { isBitcoinAddressValid } from '../internal/bitcoinService'
import { formatBNToReadable, parseToBigInt } from '../internal/numberService'
import { CosmosRestClient } from './cosmosRestClient'
import { SuiRpcClient } from './suiRpcClient'

const isTokenNative = token => token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()

const getTokenAddressForMultiCall = t => {
  return isTokenNative(t) ? getMulticall3Address(t.chainId) : t.address
}

const getTokenBalanceCall = (token, userAddress) => {
  const address = getTokenAddressForMultiCall(token)
  const abi = isTokenNative(token) ? multicallAbi : erc20Abi
  const method = isTokenNative(token) ? 'getEthBalance' : 'balanceOf'
  const iface = new Interface(abi)
  const callData = iface.encodeFunctionData(method, [userAddress])

  return [address, callData]
}

/**
 * Using Multicall3 contract, available on a lot of chains
 * @param multicall
 * @param calls
 * @param tokens
 * @returns
 */
const executeMulticall = async (multicall, calls, tokens) => {
  try {
    const results = await multicall.tryAggregate.staticCall(false, calls)
    const tokenWithResult = tokens.map((token, index) => ({
      token,
      result: { success: results[index][0], returnData: results[index][1] }
    }))

    return tokenWithResult
  } catch (error) {
    return tokens.map(token => ({
      token,
      result: { success: false, returnData: '' }
    }))
  }
}

/**
 * Format balance using ethers, based on success of the call
 * If the call fails, we return 0 as balance
 * @param results
 * @returns
 */
const formatBalanceForTokens = results => {
  return results.map(data => {
    const token = data.token
    const result = data.result
    if (!result.success) {
      return { ...token, balance: '0' }
    }

    try {
      return {
        ...token,
        balance: formatBNToReadable(BigInt(result.returnData), token.decimals)
      }
    } catch {
      return {
        ...token,
        balance: '0'
      }
    }
  })
}

export const getTokensSupportingMultiCall = async (tokens, userAddress, chains) => {
  // Create providers for each chain
  const providers = {}
  chains.forEach(chain => {
    providers[chain.chainId] = new JsonRpcProvider(chain.rpc)
  })

  const fetchBalancesForChain = async chain => {
    const tokensForChain = tokens.filter(t => t.chainId === chain.chainId)
    if (tokensForChain.length === 0) return []
    const provider = providers[chain.chainId]
    if (!provider) {
      return [
        ...tokensForChain.map(t => ({
          ...t,
          balance: '0'
        }))
      ]
    }
    const multicallAddress = getMulticall3Address(chain.chainId)
    const multicall = new ethers.Contract(multicallAddress, multicallAbi, provider)
    const calls = tokensForChain.map(token => getTokenBalanceCall(token, userAddress))
    const multicallResults = await executeMulticall(multicall, calls, tokensForChain)

    return formatBalanceForTokens(multicallResults)
  }

  const allResults = await Promise.all(chains.map(chain => fetchBalancesForChain(chain)))

  return allResults.flat()
}

export const getAllEvmTokensBalance = async (evmTokens, userAddress, chains) => {
  const tokensMulticall = await getTokensSupportingMultiCall(evmTokens, userAddress, chains)

  return tokensMulticall
}

/**
 * We'll get the current block of a given RPC to see if we can query it
 * Without getting CORS error or any other error
 * @param rpc
 * @returns
 */
const testCosmosRpc = async rpc => {
  let rpcIsValid = false
  try {
    const client = await StargateClient.connect(rpc)
    const block = await client.getBlock()
    rpcIsValid = !!block.id
  } catch (error) {
    rpcIsValid = false
  }

  return rpcIsValid
}

export const getWorkingCosmosRpcUrl = async chainData => {
  const chain = chainData
  const rpcList = chain.rpcList.length > 0 ? chain.rpcList : chain.rpc ? [chain.rpc] : []
  // if rpcList is empty, use the default rpc
  if (rpcList.length === 0) {
    try {
      const isValid = await testCosmosRpc(chain.rpc)
      if (isValid) {
        return chain.rpc
      }
    } catch (error) {
      console.error(`Error fetching rpc url: ${chain.rpc} - Error: ${error?.toString()}`)
    }
  }
  // if rpcList is not empty, try to fetch each rpc until we find a valid one
  for (const rpc of rpcList) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const isValid = await timeout(5_000, testCosmosRpc(rpc))
      if (isValid) {
        return rpc
      }
    } catch (error) {
      console.error(`Error fetching rpc url: ${chain.rpc} - Error: ${error?.toString()}`)
    }
  }
  // In the case that all rpcs are invalid, return the default rpc anyway
  return chain.rpc
}

/**
 * Get the balance of a single token for a given address
 * @param chainRpc - rpc url
 * @param address - user address
 * @param tokenAddress - token address
 * @returns balance as string
 */
export const getCosmosTokenBalance = async (chain, address, tokenAddress) => {
  if (chain.chainType !== ChainType.COSMOS) return '0'
  const cosmosChain = chain
  const client = new CosmosRestClient(cosmosChain.rest)
  const balance = await client.getBalance(address, tokenAddress)

  return balance?.amount || '0'
}

/**
 * Fetches all Cosmos balances for a given address and RPC.
 *
 * @param {string} params.rpc - RPC URL to fetch balances from.
 * @param {string} params.address - user address to fetch balances for.
 * @param {Token[]} params.tokens - array of Cosmos tokens.
 * @returns {Promise<TokenWithBalance[]>} promise that resolves to an array of tokens with their balances.
 */
export const getAllCosmosBalancesForChain = async ({ rest, address, tokens }) => {
  const client = new CosmosRestClient(rest)
  const cosmosBalances = await client.getAllBalances(address)
  // Need to map tokens and put balance, based on denom
  const tokensWithBalance = tokens.map(t => {
    const balanceCoin = cosmosBalances.find(c => c.denom === normalizeIbcAddress(t.address))
    return {
      ...t,
      balance: balanceCoin ? formatBNToReadable(BigInt(balanceCoin?.amount), t?.decimals) : '0'
    }
  })

  return tokensWithBalance
}

/**
 * Fetches all Cosmos balances for a given address and RPC.
 *
 * @param {object} params.addresses user addresses per cosmos network
 * @param {Token[]} params.cosmosTokens
 * @param {CosmosChain[]} params.cosmosChains
 * @returns {Promise<TokenWithBalance[]>} All tokens with their balances.
 */
export const getAllCosmosBalances = async ({ addresses, cosmosTokens, cosmosChains }) => {
  const tokensWithBalance = []

  await Promise.all(
    cosmosChains.map(async cosmosChain => {
      const userAddress = addresses.find(a => a.chainId === cosmosChain.chainId)?.address
      const tokensForChain = cosmosTokens.filter(t => t.chainId === cosmosChain.chainId)
      if (!userAddress) {
        tokensWithBalance.push(...tokensForChain.map(t => ({ ...t, balance: '0' })))
        return
      }

      try {
        const balances = await timeout(
          6_000,
          getAllCosmosBalancesForChain({
            rest: cosmosChain.rest,
            address: userAddress,
            tokens: tokensForChain
          })
        )
        if (balances) {
          tokensWithBalance.push(...balances)
        } else {
          tokensWithBalance.push(...tokensForChain.map(t => ({ ...t, balance: '0' })))
        }
      } catch (error) {
        console.warn(`Failed to fetch balances for chain ${cosmosChain.chainId}:`, error)
        tokensWithBalance.push(...tokensForChain.map(t => ({ ...t, balance: '0' })))
      }
    })
  )

  return tokensWithBalance
}

export const getSolanaNativeBalance = async userAddress => {
  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [userAddress]
    })
  })
  const data = await response.json()

  return BigInt(data.result?.value || 0)
}

export const getSolanaTokenBalance = async (userAddress, tokenAddress) => {
  if (tokenAddress.toLowerCase() === nativeSolanaTokenAddress.toLowerCase()) {
    return getSolanaNativeBalance(userAddress)
  }

  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [userAddress, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, { encoding: 'jsonParsed' }]
    })
  })

  const data = await response.json()
  const tokenAccount = data.result?.value?.find(
    acc => acc.account.data.parsed.info.mint.toLowerCase() === tokenAddress.toLowerCase()
  )

  return BigInt(tokenAccount?.account.data.parsed.info.tokenAmount.amount || 0)
}

export const getSolanaTokensBalance = async (userAddress, tokenAddresses) => {
  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [userAddress, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, { encoding: 'jsonParsed' }]
    })
  })
  const data = await response.json()

  return tokenAddresses.reduce((acc, address) => {
    const tokenAccount = data.result?.value?.find(
      accountInfo => accountInfo.account.data.parsed.info.mint.toLowerCase() === address.toLowerCase()
    )
    acc[address] = BigInt(tokenAccount?.account.data.parsed.info.tokenAmount.amount || 0)

    return acc
  }, {})
}

export const getAllSolanaTokensBalance = async (solanaTokens, userAddress) => {
  try {
    const nativeToken = solanaTokens.find(t => t.address === nativeEvmTokenAddress)
    const otherTokens = solanaTokens.filter(t => t.address !== nativeEvmTokenAddress)

    const [nativeBalance, tokenBalances] = await Promise.all([
      nativeToken ? getSolanaNativeBalance(userAddress) : Promise.resolve(BigInt(0)),
      getSolanaTokensBalance(
        userAddress,
        otherTokens.map(t => t.address)
      )
    ])

    return solanaTokens.map(token => ({
      ...token,
      balance:
        token.address === nativeEvmTokenAddress
          ? formatBNToReadable(nativeBalance, token.decimals)
          : formatBNToReadable(tokenBalances[token.address], token.decimals)
    }))
  } catch (error) {
    console.warn('Failed to fetch Solana balances:', error)
    return solanaTokens.map(t => ({ ...t, balance: '0' }))
  }
}

export async function getBitcoinNativeBalance(address) {
  try {
    const isValidBitcoinAddress = isBitcoinAddressValid(address)
    if (!isValidBitcoinAddress) {
      throw new Error(`Invalid Bitcoin address: ${address}`)
    }
    const apiUrl = `https://blockchain.info/q/addressbalance/${address}?confirmations=6`
    const response = await fetch(apiUrl)
    const balanceInSatoshis = await response.json()
    const isValidResponse = typeof balanceInSatoshis === 'string' || typeof balanceInSatoshis === 'number'
    if (!isValidResponse) {
      throw new Error('Invalid balance response')
    }

    return String(balanceInSatoshis || '0')
  } catch (error) {
    console.error('Failed to fetch Bitcoin balance:', error)
    return '0'
  }
}

// TODO: implement fetching balances for all bitcoin tokens
export const getAllBitcoinTokensBalance = async (userAddress, bitcoinTokens) => {
  const nativeBalance = await getBitcoinNativeBalance(userAddress)

  return Promise.all(
    bitcoinTokens.map(async token => {
      return {
        ...token,
        balance: formatBNToReadable(nativeBalance, token.decimals)
      }
    })
  )
}

/**
 * Returns the balance of a single Sui coin for a given address
 */
export const getSuiTokenBalance = async (userAddress, tokenAddress, rpcUrl) => {
  const suiClient = new SuiRpcClient(rpcUrl)
  const { totalBalance } = await suiClient.getBalance(userAddress, tokenAddress)

  return BigInt(totalBalance || 0)
}

export const getAllSuiTokensBalance = async (userAddress, suiTokens, suiChains) => {
  const getBalancesForChain = async chain => {
    const tokensForChain = suiTokens.filter(t => t.chainId === chain.chainId)
    const suiClient = new SuiRpcClient(chain.rpc)
    const foundBalances = await suiClient.getAllBalances(userAddress)

    const balanceMap = foundBalances.reduce((acc, balance) => {
      acc[balance.coinType] = balance.totalBalance
      return acc
    }, {})

    return tokensForChain.map(token => {
      const balanceBn = BigInt(balanceMap[token.address] || 0)

      return {
        ...token,
        balance: formatBNToReadable(balanceBn, token.decimals)
      }
    })
  }
  const allResults = await Promise.all(suiChains.map(getBalancesForChain))

  return allResults.flat()
}

export const getXrplTokenBalance = async (userAddress, token, chain) => {
  const xrplClient = await getClient(chain)
  const balance = await xrplClient.getBalance(userAddress, token.address)

  return parseToBigInt(balance, token.decimals)
}

export const getAllXrplTokensBalance = async (userAddress, xrplTokens, xrplChains) => {
  const getBalancesForChain = async chain => {
    const tokensForChain = xrplTokens.filter(t => t.chainId === chain.chainId)
    const xrplClient = await getClient(chain)
    const foundBalances = await xrplClient.getAllBalances(userAddress)
    const balanceMap = foundBalances.reduce((acc, { address, balance }) => {
      acc[address] = balance
      return acc
    }, {})

    return tokensForChain.map(token => {
      return {
        ...token,
        balance: balanceMap[token.address] || 0
      }
    })
  }

  const allResults = await Promise.all(xrplChains.map(getBalancesForChain))

  return allResults.flat()
}

/**
 * Returns a promise that resolves when the given promise resolves or after the given timeout
 * @param ms - timeout in milliseconds
 * @param promise - the promise to wait for
 */
export function timeout(ms, promise) {
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, ms)
  })

  return Promise.race([promise, timeoutPromise])
}
