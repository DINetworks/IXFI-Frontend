const { createWalletClient, createPublicClient, http, parseUnits } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const erc20Abi = require('../src/contracts/erc20.json')

const rpcUrlCrossFi = `https://crossfi-testnet.g.alchemy.com/v2/6wuyMqGSzF1QeZ1rZa_t9DnkYtaoFAF4`

const crossfiTestnet = {
  id: 4157,
  name: 'CrossFi Testnet',
  network: 'crossfi',
  nativeCurrency: {
    name: 'XFI',
    symbol: 'XFI',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [rpcUrlCrossFi]
    },
    public: {
      http: [rpcUrlCrossFi]
    }
  },
  blockExplorers: {
    default: { name: 'Crossfi Explorer', url: rpcUrlCrossFi }
  },
  testnet: true
}

// Setup wallet client (for signing transactions)
const account = privateKeyToAccount('0x22c484a0396582971f463a8b2b3ffb783c4084a3c3613db9496dbe3712a82e64')

console.log('address: ', account.address)

const walletClient = createWalletClient({
  account,
  chain: crossfiTestnet,
  transport: http(rpcUrlCrossFi)
})

// Setup public client (for contract simulation)
const publicClient = createPublicClient({
  chain: crossfiTestnet,
  transport: http(rpcUrlCrossFi)
})

const mintAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
async function getOwner(tokenAddress) {
  const { data } = await publicClient.readContract({
    address: tokenAddress,
    abi: [
      {
        type: 'function',
        name: 'owner',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'address' }]
      }
    ],
    functionName: 'owner'
  })
  console.log('Contract Owner:', data)
}

getOwner('0x9a6043fa2a5777BDB8DF6774e5436ECC80311b22')

// Mint Function
async function mintToken(tokenAddress, to, amount) {
  const amountInWei = parseUnits(amount, 18) // Convert to 18 decimals

  try {
    // Use public client to simulate the contract call
    const { request } = await publicClient.simulateContract({
      address: tokenAddress,
      abi: mintAbi,
      functionName: 'mint',
      args: [to, amountInWei]
    })

    // Use wallet client to send the transaction
    const txHash = await walletClient.writeContract(request)
    console.log('Transaction Hash:', txHash)

    return txHash
  } catch (error) {
    console.error('Minting Failed:', error)
  }
}

// Call the mint function
// mintToken('0x9a6043fa2a5777BDB8DF6774e5436ECC80311b22', '0x075Fee80E95ff922Ec067AEd2657b11359990479', '100000')

// mintToken('0x14b3e5FE14154f16D706AE627e2abC2c5c1871fE', '100000')
// mintToken('0x43c846fb5C6a6239BcC8D28a84Bd92dc8cC98059', '100000')
// mintToken('0x1C5c4F0e47E71c9A3FFB582D7dBfE074BBc5aaF5', '100000')
// mintToken('0xbd99c574b3BE14A190DCCd1F992a4Df8c0C986F5', '100000')
// mintToken('0x7f87b92ef6B39FCc8b10bcABf7BB2FFe2Ce8335a', '100000')

// 100000000000000000000000
