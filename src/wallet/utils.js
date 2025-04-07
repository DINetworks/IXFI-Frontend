import { GASRELAYER_CROSSFI, GATEWAY_CROSSFI, IXFI_CROSSFI } from 'src/configs/constant'
import { erc20Abi, createPublicClient, createWalletClient, http, formatEther, custom, parseEther } from 'viem'
import GasRelayerXFI from 'src/contracts/GasRelayerXFI.json'
import IXFI from 'src/contracts/IXFI.json'

export const truncateAddress = address => {
  if (!address) return 'No Account'

  const match = address.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/)
  if (!match) return address

  return `${match[1]}⋯${match[2]}`
}

export const formatPercent = value => {
  return parseFloat(formatNumber(value) * 100).toFixed(2)
}

export const formatNumber = bigNumberValue => {
  if (typeof bigNumberValue != 'bigint') return 0

  return parseFloat(formatEther(bigNumberValue)).toFixed(2)
}

export const isOnlyNumber = value => {
  return /^-?\d*\.?\d*$/.test(value)
}

export const isInvalidAmount = amount => {
  return !amount || isNaN(amount) || parseFloat(amount) <= 0
}

export const getPublicClient = chain => {
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls?.default?.http[0])
  })
}

export const getWalletClient = (chain, address) => {
  return createWalletClient({
    account: address,
    chain,
    transport: custom(window.ethereum)
  })
}

export const getBalanceInApp = async (chain, owner) => {
  return getPublicClient(chain).readContract({
    address: GASRELAYER_CROSSFI,
    abi: GasRelayerXFI.abi,
    functionName: 'gasBalance',
    args: [owner]
  })
}

export const getXFIBalanceInWallet = async (chain, owner) => {
  return getPublicClient(chain).getBalance({ address: owner })
}

export const getIXFIBalanceInWallet = async (chain, owner) => {
  return getPublicClient(chain).readContract({
    address: IXFI_CROSSFI,
    abi: IXFI.abi,
    functionName: 'balanceOf',
    args: [owner]
  })
}

export const getApprovedTokens = async (chain, tokens, owner, spender) => {
  const client = getPublicClient(chain)

  try {
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
  return getPublicClient(chain).readContract({
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

  // 4. Generate and sign the typed data
  return getWalletClient(address, chain).signTypedData({
    account: address,
    domain,
    types,
    primaryType: 'Transfer',
    message
  })
}

export const depositXFI = (address, chain, amount) => {
  return getWalletClient(address, chain).sendTransaction({
    to: GASRELAYER_CROSSFI,
    value: parseEther(amount.toString())
  })
}

export const depositIXFI = (address, chain, amount) => {
  return getWalletClient(address, chain).writeContract({
    address: GASRELAYER_CROSSFI,
    abi: GasRelayerXFI.abi,
    functionName: 'depositGasIXFI',
    args: [parseEther(amount.toString())]
  })
}

export const withdrawXFI = (address, chain, amount) => {
  return getWalletClient(address, chain).writeContract({
    address: GASRELAYER_CROSSFI,
    abi: GasRelayerXFI.abi,
    functionName: 'withdrawGas',
    args: [parseEther(amount.toString())]
  })
}

export const withdrawIXFI = (address, chain, amount) => {
  return getWalletClient(address, chain).writeContract({
    address: GASRELAYER_CROSSFI,
    abi: GasRelayerXFI.abi,
    functionName: 'withdrawGasIXFI',
    args: [parseEther(amount.toString())]
  })
}

export const waitForTransactionReceipt = (chain, hash) => {
  return getPublicClient(chain).waitForTransactionReceipt({ hash })
}
