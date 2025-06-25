import { ChainType } from '@0xsquid/squid-types'
import { AxiosError } from 'axios'
import { getClient } from '../../core/client'
import { getTransactionStatus as getBtcTxStatus } from '../../core/connectors/bitcoin/helpers'
import { SendTransactionStatus } from '../../core/types/transaction'
import { XrplTxStatus } from '../../core/types/xrpl'

async function getTxStatusEvm({ chain, txHash }) {
  const client = await getClient(chain)
  const receipt = await client.getTransactionReceipt(txHash)

  if (!receipt) return SendTransactionStatus.ONGOING
  switch (receipt.status) {
    case 0:
      return SendTransactionStatus.ERROR
    case 1:
      return SendTransactionStatus.SUCCESS
  }

  return SendTransactionStatus.ONGOING
}

async function getTxStatusCosmos({ txHash, chain }) {
  const client = await getClient(chain)
  const tx = await client.getTx(txHash)
  if (!tx) {
    return SendTransactionStatus.ONGOING
  }

  if (tx.code === 0) {
    return SendTransactionStatus.SUCCESS
  }

  return SendTransactionStatus.ERROR
}

async function getTxStatusSolana({ txHash, chain }) {
  const client = await getClient(chain)
  const txStatus = await client.getSignatureStatus(txHash, {
    searchTransactionHistory: true
  })

  if (!txStatus.value) {
    return SendTransactionStatus.ONGOING
  }

  if (txStatus.value.err) {
    return SendTransactionStatus.ERROR
  }

  switch (txStatus.value.confirmationStatus) {
    case 'processed':
    case 'confirmed':
      return SendTransactionStatus.ONGOING
    case 'finalized':
      return SendTransactionStatus.SUCCESS
  }

  return SendTransactionStatus.ONGOING
}

async function getTxStatusBitcoin({ txHash }) {
  try {
    const response = await getBtcTxStatus(txHash)
    if (response.status.confirmed) {
      return SendTransactionStatus.SUCCESS
    }
    return SendTransactionStatus.ONGOING
  } catch (error) {
    if (error instanceof AxiosError) {
      if (/transaction not found/i.test(error.message)) {
        return SendTransactionStatus.ONGOING
      }
    }
    throw error
  }
}

async function getTxStatusSui({ chain, txHash }) {
  if (chain.chainType !== ChainType.SUI) {
    throw new Error(`Invalid chain type, expected ${ChainType.SUI}, got ${chain.chainType}`)
  }

  const suiClient = await getClient(chain)
  const txResponse = await suiClient.waitForTransaction({
    digest: txHash,
    options: {
      showEffects: true
    }
  })

  if (txResponse.effects?.status.error) {
    return SendTransactionStatus.ERROR
  }

  switch (txResponse.effects?.status.status) {
    case 'success':
      return SendTransactionStatus.SUCCESS
    case 'failure':
      return SendTransactionStatus.ERROR
    default:
      return SendTransactionStatus.ONGOING
  }
}
async function getTxStatusXrpl({ chain, txHash }) {
  const xrplClient = await getClient(chain)
  const status = await xrplClient.waitForTransaction(txHash, {
    interval: 1_000
  })

  if (status === XrplTxStatus.SUCCESS) {
    return SendTransactionStatus.SUCCESS
  }

  return SendTransactionStatus.ERROR
}

export async function getSendTransactionStatus({ chain, txHash }) {
  switch (chain.chainType) {
    case ChainType.EVM:
      return getTxStatusEvm({
        txHash,
        chain
      })
    case ChainType.COSMOS:
      return getTxStatusCosmos({
        txHash,
        chain
      })
    case ChainType.SOLANA:
      return getTxStatusSolana({
        txHash,
        chain
      })
    case ChainType.BTC:
      return getTxStatusBitcoin({
        txHash
      })
    case ChainType.SUI:
      return getTxStatusSui({
        txHash,
        chain
      })
    case ChainType.XRPL:
      return getTxStatusXrpl({
        txHash,
        chain
      })
  }
}
