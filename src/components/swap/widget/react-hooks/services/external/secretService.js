import { StargateClient } from '@cosmjs/stargate'
import { SecretNetworkClient } from 'secretjs'
import { CHAIN_IDS } from '../../core/constants'
import { formatBNToReadable } from '../internal/numberService'

/**
 * Fetch secret network token balance
 * Using the permit signature, see permit function for more details
 * @param secretJS
 * @param contract
 * @param chainId
 * @param walletAddress
 * @param permit
 * @returns
 */
export const getTokenBalance = async (secretJS, contract, permit) => {
  if (permit) {
    const msg = {
      balance: {}
    }

    const result = await secretJS.query.compute.queryContract({
      contract_address: contract.address,
      code_hash: contract.codeHash,
      query: {
        with_permit: {
          query: msg,
          permit
        }
      }
    })
    return result
  }
  return -1
}

export const getPermit = async (chainId, contracts, address) => {
  const contractsString = contracts.join('_')
  const permKey = `perm_${chainId}_${contractsString}_${address}`
  let permit
  const permitStored = window.localStorage.getItem(permKey)
  if (permitStored) permit = JSON.parse(permitStored)
  // Not able to fetch permit signature from local storage,
  // Ask user to sign message
  if (!permit) {
    try {
      const result = await window.keplr.signAmino(
        chainId,
        address,
        {
          chain_id: chainId,
          account_number: '0',
          sequence: '0',
          fee: {
            amount: [{ denom: 'uscrt', amount: '0' }],
            gas: '1'
          },
          msgs: [
            {
              type: 'query_permit',
              value: {
                permit_name: 'secret-bridge-balance',
                allowed_tokens: contracts,
                permissions: ['balance']
              }
            }
          ],
          memo: ''
        },
        {
          preferNoSetFee: true,
          preferNoSetMemo: true
        }
      )
      permit = {
        params: {
          permit_name: 'secret-bridge-balance',
          allowed_tokens: contracts,
          chain_id: chainId,
          permissions: ['balance']
        },
        signature: result.signature
      }
      window.localStorage.setItem(permKey, JSON.stringify(permit))
    } catch (err) {
      console.error('--- PERMIT ERROR ---')
      console.error(err)
    }
  }
  return permit
}

/**
 * Fetches the secret balance of the user
 * This has a different logic than the other balances because Secret network hides the balance of the user by design
 * So we need to fetch the balance in a different way
 */
export const fetchAllSecretBalances = async (chainData, userAddress, secretTokens, keplr) => {
  if (!keplr) return []
  // Enables app to utilize keplr's secret utilities
  await keplr.enable(CHAIN_IDS.SECRET)

  // Create a client that handles the query encryption
  const client = new SecretNetworkClient({
    url: chainData.rest,
    chainId: CHAIN_IDS.SECRET,
    wallet: keplr.getOfflineSignerOnlyAmino(CHAIN_IDS.SECRET),
    encryptionUtils: keplr.getEnigmaUtils(CHAIN_IDS.SECRET),
    walletAddress: userAddress
  })

  // Get secret tokens
  const permit = await getPermit(
    CHAIN_IDS.SECRET,
    secretTokens.map(st => st.address),
    userAddress
  )

  // Fetching all balances in parallel
  const privateTokens = await Promise.all(
    secretTokens
      .filter(t => !!t.codeHash)
      .map(async token => {
        const result = await getTokenBalance(
          client,
          {
            address: token.address,
            codeHash: token.codeHash ?? ''
          },
          permit
        )
        return {
          ...token,
          balance: formatBNToReadable(BigInt(result.balance.amount), token?.decimals)
        }
      })
  )
  // Use Stargate getBalance for SCRT
  const stargateClient = await StargateClient.connect(chainData.rpc)
  const nativeSecretToken = secretTokens.find(t => t.address === 'uscrt')
  const publicTokenBalance = await stargateClient.getBalance(userAddress, 'uscrt')

  const publicTokenWithBalance = {
    ...nativeSecretToken,
    balance: formatBNToReadable(BigInt(publicTokenBalance.amount), nativeSecretToken?.decimals ?? 18)
  }
  return [...privateTokens, publicTokenWithBalance]
}
