import * as ecc from '@bitcoinerlab/secp256k1'
import axios from 'axios'
import * as bitcoin from 'bitcoinjs-lib'

bitcoin.initEccLib(ecc)
const network = bitcoin.networks.bitcoin

export const fromHexString = hexString => {
  const matches = hexString.match(/.{1,2}/g)
  if (!matches) {
    throw new Error('Invalid hex string')
  }
  return Uint8Array.from(matches.map(byte => parseInt(byte, 16)))
}

export async function createSendBtcPsbt(senderAddress, recipientAddress, amount) {
  const feeRate = await getFeeRate()
  const utxos = await getAddressUtxos(senderAddress)
  if (!utxos) {
    throw new Error('No UTXOs found')
  }
  // Sort UTXOs by value in descending order
  // This ensures that we select the UTXOs with the highest value first
  // to optimize the transaction size
  const sortedUtxos = utxos.sort((a, b) => b.value - a.value)
  // Sum up the values of the UTXOs up to the desired amount
  let inputAmount = 0
  const inputs = []
  for (const utxo of sortedUtxos) {
    inputAmount += utxo.value
    inputs.push(utxo)
    if (inputAmount >= amount) break
  }
  if (inputAmount < amount) throw new Error('Insufficient balance')
  const outputsCount = 2 // Only two outputs, recipient and change outputs
  // Calculate fee based on the byte size of the total inputs and outputs
  // Approximate transaction size = (inputs * 150 bytes + outputs * 34 bytes + 10 bytes overhead)
  const transactionSize = inputs.length * 150 + outputsCount * 34 + 10
  const fee = feeRate * transactionSize
  const satsNeeded = fee + amount
  const psbt = new bitcoin.Psbt({ network })
  let amountGathered = 0
  for (const utxo of sortedUtxos) {
    const { txid, vout, value } = utxo
    const script = bitcoin.address.toOutputScript(senderAddress, network)
    psbt.addInput({
      hash: txid,
      index: vout,
      witnessUtxo: {
        script,
        value: BigInt(value)
      }
    })
    amountGathered += value
    if (amountGathered >= satsNeeded) {
      break
    }
  }
  psbt.addOutput({
    address: recipientAddress,
    value: BigInt(amount)
  })
  if (amountGathered > satsNeeded) {
    psbt.addOutput({
      address: senderAddress,
      value: BigInt(amountGathered - satsNeeded)
    })
  }
  return {
    psbtHex: psbt.toHex()
  }
}

export async function broadcastTx(txHex) {
  return axios.post(`https://mempool.space/api/tx`, txHex).then(res => res.data)
}

export async function getAddressUtxos(address) {
  return axios.get(`https://mempool.space/api/address/${address}/utxo`).then(response => response.data)
}

export async function getFeeRate() {
  const response = await axios.get('https://mempool.space/api/v1/fees/recommended')
  return response.data.halfHourFee
}

export async function getTransactionStatus(txHash) {
  return axios.get(`https://mempool.space/api/tx/${txHash}`).then(response => response.data)
}
