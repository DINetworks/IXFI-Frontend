import { web3 } from '@project-serum/anchor'
import { Connection, VersionedTransaction } from '@solana/web3.js'

export class SolanaHandler {
  async executeRoute({ data }) {
    const { route } = data
    const signer = data.signer
    const connection = new Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed')

    // currently we support signing only for Jupiter
    const swapRequest = route.transactionRequest.data

    // build tx object
    const swapTransactionBuf = Buffer.from(swapRequest, 'base64')
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf)
    let tx

    // sign tx using provided signer
    if (signer.constructor.name === 'NodeWallet' || signer.payer) {
      // offline signer
      const wallet = signer
      transaction.sign([wallet.payer])

      // send tx onchain
      const rawTransaction = transaction.serialize()

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
      })

      // verify tx was broadcasted
      const latestBlockHash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight + 10,
        signature: txid
      })
      tx = txid
    } else {
      // phantom wallet signer
      const { signature } = signer.signAndSendTransaction(transaction)
      await connection.getSignatureStatus(signature, { searchTransactionHistory: true })
      tx = signature
    }

    return { tx }
  }
}
