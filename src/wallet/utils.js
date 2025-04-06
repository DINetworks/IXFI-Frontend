import { GATEWAY_CROSSFI } from 'src/configs/constant'
import { erc20Abi, createPublicClient, createWalletClient, http } from 'viem'

export const truncateAddress = address => {
  if (!address) return 'No Account'

  const match = address.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/)
  if (!match) return address

  return `${match[1]}⋯${match[2]}`
}

export const formatPercent = value => {
  return parseFloat(formatNumber(value) * 100).toFixed(2)
}

export const isOnlyNumber = value => {
  return /^-?\d*\.?\d*$/.test(value)
}

export const getApprovedTokens = async (chain, tokens, owner, spender) => {
  const client = createPublicClient({
    chain,
    transport: http(chain.rpcUrls?.default?.http[0])
  })

  try {
    console.log('here', tokens)

    const allowances = await Promise.all(
      tokens.map(token =>
        client
          .readContract({
            address: token.address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [owner, spender]
          })
          .then(allowance => ({ token, allowance }))
          .catch(error => {
            console.error(`Error checking allowance for token: ${token.address}`, error)

            return { token, allowance: 0n } // Return zero allowance in case of error
          })
      )
    )

    return allowances.filter(({ allowance }) => allowance > 0n).map(({ token }) => token)
  } catch (error) {
    console.error('Error fetching allowances', error)

    return []
  }
}

export const getGatewayNonce = async (chain, sender) => {
  const publicClient = createPublicClient({
    chain: chain,
    transport: http(chain.rpcUrls?.default?.http[0])
  })

  return publicClient.readContract({
    address: GATEWAY_CROSSFI,
    abi: [
      {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'nonces',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
        stateMutability: 'view'
      }
    ],
    functionName: 'nonces',
    args: [sender]
  })
}

export const generateEIP712Signature = async (chain, sender, transferData, nonce) => {
  // 1. Define EIP-712 domain separator
  const domain = {
    name: 'IXFIGateway',
    version: '1',
    chainId: chain.id,
    verifyingContract: GATEWAY_CROSSFI
  }

  // 2. Define the message types
  const types = {
    Transfer: [
      { name: 'sender', type: 'address' },
      { name: 'transferData', type: 'bytes' },
      { name: 'nonce', type: 'uint256' }
    ]
  }

  // 3. Create the message value
  const message = {
    sender,
    transferData,
    nonce
  }

  // Create wallet client with proper event listeners
  const walletClient = createWalletClient({
    account: address,
    chain,
    transport: custom(window.ethereum)
  })

  // 4. Generate and sign the typed data
  return walletClient.signTypedData({
    account: address,
    domain,
    types,
    primaryType: 'Transfer',
    message
  })
}
