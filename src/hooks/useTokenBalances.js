import { useState, useCallback, useEffect } from 'react'
import { getFunctionSelector } from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { useQuery } from 'wagmi/query'

function encodeBytes(data) {
  const length = data.length / 2
  const lengthEncoded = length.toString(16).padStart(64, '0')
  const paddedData = data.padEnd(Math.ceil(data.length / 64) * 64, '0')
  return lengthEncoded + paddedData
}

function encodeMulticallInput(requireSuccess, calls) {
  const functionSelector = getFunctionSelector('tryBlockAndAggregate(bool,(address,bytes)[])')
  const requireSuccessEncoded = requireSuccess ? '01'.padStart(64, '0') : '00'.padStart(64, '0')
  const offset = '40'.padStart(64, '0')
  const callsLength = calls.length.toString(16).padStart(64, '0')

  const encodedCalls = calls.map(call => {
    const encodedTarget = call.target.toLowerCase().replace('0x', '').padStart(64, '0')
    const encodedCallData = encodeBytes(call.callData.replace(/^0x/, ''))
    return encodedTarget + offset + encodedCallData
  })
  const staticPart = `${functionSelector}${requireSuccessEncoded}${offset}${callsLength}`
  const dynamicDataLocaitons = []
  dynamicDataLocaitons.push(calls.length * 32)
  encodedCalls.forEach((call, index) => {
    if (index === encodedCalls.length - 1) return
    dynamicDataLocaitons.push(call.length / 2 + dynamicDataLocaitons[index])
  })

  const encodedDynamicDataLocaitons = dynamicDataLocaitons.map(location => location.toString(16).padStart(64, '0'))
  const dynamicData = encodedDynamicDataLocaitons.join('') + encodedCalls.join('')
  return `0x${staticPart}${dynamicData}`
}

function decodeMulticallOutput(result) {
  if (!result) return []
  const res = result.startsWith('0x') ? result.slice(2) : result
  let offset = 0
  offset += 64
  offset += 64
  offset += 64
  const returnDataLength = parseInt(res.slice(offset, offset + 64), 16)
  offset += 64
  const dynamicData = res.slice(offset)
  const offsetsOfEachData = []
  for (let i = 0; i < returnDataLength; i++) {
    const returnDataOffset = parseInt(res.slice(offset, offset + 64), 16)
    offsetsOfEachData.push(returnDataOffset)
    offset += 64
  }
  const returnData = []
  for (let i = 0; i < returnDataLength; i++) {
    const currentData = dynamicData.slice(offsetsOfEachData[i] * 2)
    let currentOffset = 0
    const success = currentData.slice(currentOffset, 64).endsWith('1')
    currentOffset += 64
    currentOffset += 64

    const currentDataLength = parseInt(currentData.slice(currentOffset, currentOffset + 64), 16)
    currentOffset += 64

    const returnDataHex = '0x' + (currentData.slice(currentOffset, currentOffset + currentDataLength * 2) || '0')
    returnData.push({ success, returnData: returnDataHex })
  }
  return returnData.map(item => {
    if (item.success) return BigInt(item.returnData)
    return BigInt(0)
  })
}
var ERC20_BALANCE_OF_SELECTOR = getFunctionSelector('balanceOf(address)')

var useTokenBalances = (chainId, tokenAddresses, account) => {
  const { defaultRpc: rpcUrl, multiCall } = NETWORK_INFO[chainId] || {}

  const fetchBalances = useCallback(async () => {
    try {
      const nativeBalance = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [
            account,
            // Address
            'latest'
            // Block number or state
          ],
          id: 1
        })
      })
        .then(res => res.json())
        .then(res => BigInt(res.result || '0'))

      const calls = tokenAddresses.map(token3 => {
        const paddedAccount = account.replace('0x', '').padStart(64, '0')
        const callData = `0x${ERC20_BALANCE_OF_SELECTOR}${paddedAccount}`
        return {
          target: token3,
          callData
        }
      })
      const encodedData = encodeMulticallInput(false, calls)

      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            to: multiCall,
            data: encodedData
          },
          'latest'
        ]
      }

      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      const decodedBalances = decodeMulticallOutput(result.result)

      const balancesMap = tokenAddresses.reduce(
        (acc, token3, index) => ({
          ...acc,
          [token3]: decodedBalances[index]
        }),
        {}
      )
      balancesMap[NATIVE_EVM_TOKEN_ADDRESS] = nativeBalance

      return balancesMap
    } catch (error) {
      console.error('Failed to fetch balances:', error)
      return {}
    }
  }, [rpcUrl, account, JSON.stringify(tokenAddresses)])

  const { data: balances = {}, loading } = useQuery({
    queryKey: ['tokenBalances', chainId, JSON.stringify(tokenAddresses), account],
    queryFn: async () => {
      return await fetchBalances()
    },
    enabled: !!rpcUrl && !!account && tokenAddresses?.length > 0,
    refetchInterval: 5000
  })

  return {
    loading,
    balances,
    refetch: fetchBalances
  }
}

export default useTokenBalances
