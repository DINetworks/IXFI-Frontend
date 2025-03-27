import { createPublicClient, http } from 'viem'
import erc20Abi from 'src/contracts/erc20.json'

export const truncateAddress = address => {
  if (!address) return 'No Account'

  const match = address.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/)
  if (!match) return address

  return `${match[1]}⋯${match[2]}`
}

export const toHex = num => {
  const val = Number(num)

  return '0x' + val.toString(16)
}

export const formatPercent = value => {
  return parseFloat(formatNumber(value) * 100).toFixed(2)
}

export const isOnlyNumber = value => {
  return /^-?\d*\.?\d*$/.test(value)
}

export const getApprovedTokens = async (chain, tokens, owner, spender) => {
  const approvedTokens = []

  const client = createPublicClient({
    chain,
    transport: http(chain.rpcUrls?.default?.http[0])
  })

  for (const token of tokens) {
    try {
      const allowance = await client.readContract({
        address: token.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner, spender]
      })

      if (allowance > 0n) approvedTokens.push(token)
    } catch (error) {
      console.error(`Error checking allowance for token: ${token.address}`, error)
    }
  }

  return approvedTokens
}
