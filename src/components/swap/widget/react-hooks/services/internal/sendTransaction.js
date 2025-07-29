import { ChainType } from '@0xsquid/squid-types'
import { coin as cosmJsCoin } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'
import { Transaction } from '@mysten/sui/transactions'
import { Contract, JsonRpcProvider } from 'ethers'
import { erc20Abi } from 'viem'
import { getClient } from '../../core/client'
import { nativeEvmTokenAddress, nativeSuiTokenAddress, nativeXrplTokenAddress } from '../../core/constants'
import { formatBNToReadable } from './numberService'
import { executeSolanaTransfer } from './solanaService'
import { getSuiChain } from './suiService'
import { getXrplNetwork, isXrplAddressValid } from './xrplService'

export async function sendTransactionEvm({ to, amount, token, signer, rpcUrl }) {
  const isNativeToken = token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()
  if (isNativeToken) {
    const tx = await signer.sendTransaction({
      to,
      value: amount,
      chainId: Number(token.chainId)
    })
    return {
      txHash: tx.hash
    }
  }

  const provider = new JsonRpcProvider(rpcUrl)
  const erc20Contract = new Contract(token.address, erc20Abi, provider)
  const encodedTransferCall = erc20Contract.interface.encodeFunctionData('transfer', [to, amount])
  const tx = await signer.sendTransaction({
    to: token.address,
    data: encodedTransferCall,
    chainId: Number(token.chainId)
  })

  return {
    txHash: tx.hash
  }
}

export async function sendTransactionCosmos({ amount, rpcUrl, signer, to, token, nativeToken }) {
  const accounts = await signer.getAccounts()
  const signingClient = await SigningStargateClient.connectWithSigner(rpcUrl, signer)
  const senderAddress = accounts[0].address
  const coins = [cosmJsCoin(amount, token.address)]
  const fee = {
    amount: [cosmJsCoin('500', nativeToken.address)],
    gas: '150000'
  }

  const sendMsg = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: senderAddress,
      toAddress: to,
      amount: coins
    }
  }

  const txHash = await signingClient.signAndBroadcastSync(senderAddress, [sendMsg], fee)

  return { txHash }
}
export async function sendTransactionSolana({ signer, amount, to, token, connection }) {
  const amountBn = BigInt(amount)
  const txHash = await executeSolanaTransfer({
    amount: amountBn,
    connection,
    signer,
    target: to,
    sourceToken: token
  })

  return { txHash }
}

export async function sendTransactionBitcoin({ amount, signer, to }) {
  const { txHash } = await signer.sendBTC(to, Number(amount))

  return { txHash }
}

export async function sendTransactionSui({ account, amount, chain, signer, to, token }) {
  if (chain.chainType !== ChainType.SUI) {
    throw new Error(`Invalid chain type, expected ${ChainType.SUI}, got ${chain.chainType}`)
  }

  const suiChain = getSuiChain(chain.chainId)
  if (!suiChain) {
    throw new Error(`Sui chain not found for chainId: ${chain.chainId}`)
  }

  const suiClient = await getClient(chain)
  const isNativeToken = token.address.toLowerCase() === nativeSuiTokenAddress.toLowerCase()
  const tx = new Transaction()

  if (isNativeToken) {
    const [coin] = tx.splitCoins(tx.gas, [amount])
    tx.transferObjects([coin], to)
  } else {
    const coinType = token.address
    const coinObjects = await suiClient.getCoins({
      owner: account.address,
      coinType
    })
    const coinObject = coinObjects.data.find(coin => BigInt(coin.balance) >= BigInt(amount))
    // if a coin with enough balance is found, use it
    // as it's more efficient than merging multiple coins
    if (coinObject) {
      const [coin] = tx.splitCoins(coinObject.coinObjectId, [amount])
      tx.transferObjects([coin], to)
    } else {
      // otherwise merge coins up to the required amount
      // first, sort the coins by balance in descending order for efficiency
      const sortedCoins = coinObjects.data.sort((a, b) => {
        const diff = BigInt(b.balance) - BigInt(a.balance)
        if (diff === BigInt(0)) {
          return 0
        } else if (diff > BigInt(0)) {
          return 1
        } else {
          return -1
        }
      })
      // gather coins until the required amount is reached
      const selectedCoinObjects = []
      let amountGathered = BigInt(0)
      for (const coin of sortedCoins) {
        if (amountGathered >= BigInt(amount)) {
          break
        }
        selectedCoinObjects.push(coin)
        amountGathered += BigInt(coin.balance)
      }
      if (amountGathered < BigInt(amount)) {
        throw new Error(`Insufficient balance of ${coinType}`)
      }
      const [targetCoin, ...otherCoins] = selectedCoinObjects.map(c => c.coinObjectId)
      // merge the selected coins into a single coin
      tx.mergeCoins(targetCoin, otherCoins)
      // create a new coin with the required amount
      const [coin] = tx.splitCoins(targetCoin, [amount])
      tx.transferObjects([coin], to)
    }
  }

  const signedTx = await signer.signTransaction({
    transaction: tx,
    account,
    chain: suiChain
  })

  // execute transaction without waiting for confirmation
  const txResponse = await suiClient.executeTransactionBlock({
    signature: signedTx.signature,
    transactionBlock: signedTx.bytes
  })

  return { txHash: txResponse.digest }
}

export async function sendTransactionXrpl({ amount, signer, to, token, from }) {
  const xrplNetwork = getXrplNetwork(token.chainId)
  if (xrplNetwork == null) {
    throw new Error(`No XRPL network found for chainId '${token.chainId}'`)
  }

  if (!isXrplAddressValid(from) || !isXrplAddressValid(to)) {
    throw new Error('Invalid from or to address')
  }

  const baseTransaction = {
    TransactionType: 'Payment',
    Account: from,
    Destination: to
  }

  const isNativeToken = token.address.toLowerCase() === nativeXrplTokenAddress.toLowerCase()
  if (isNativeToken) {
    const { hash } = await signer.signAndSubmit({
      network: xrplNetwork,
      tx: {
        ...baseTransaction,
        Amount: amount
      }
    })
    return {
      txHash: hash
    }
  }

  const [currency, issuer] = token.address.split('.')
  const amountFormatted = formatBNToReadable(amount, token.decimals)
  const { hash } = await signer.signAndSubmit({
    network: xrplNetwork,
    tx: {
      ...baseTransaction,
      Amount: {
        currency,
        issuer,
        value: amountFormatted
      }
    }
  })

  return {
    txHash: hash
  }
}
