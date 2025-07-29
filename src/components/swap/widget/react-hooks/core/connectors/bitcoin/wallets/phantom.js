import * as bitcoin from 'bitcoinjs-lib'
import {
  BitcoinConnectorInvalidAccountError,
  BitcoinConnectorProviderNotFoundError,
  BitcoinConnectorTransactionFailedError
} from '../errors'
import { broadcastTx, createSendBtcPsbt, fromHexString } from '../helpers'

const MAINNET = bitcoin.networks.bitcoin

export class PhantomConnector {
  get getProvider() {
    const provider = window?.phantom?.bitcoin
    if (!provider) {
      throw new BitcoinConnectorProviderNotFoundError('Phantom')
    }
    return provider
  }

  async requestAccount() {
    const phantomAccounts = await this.getProvider.requestAccounts()
    if (!phantomAccounts) throw new BitcoinConnectorInvalidAccountError()
    const paymentAccount = phantomAccounts.find(account => account.purpose === 'payment')
    if (typeof paymentAccount?.address !== 'string') {
      throw new BitcoinConnectorInvalidAccountError()
    }
    return {
      address: paymentAccount.address
    }
  }

  async sendBTC(to, amount) {
    const { address } = await this.requestAccount()
    const { psbtHex } = await createSendBtcPsbt(address, to, amount)
    const { txId } = await this.signPsbt(psbtHex)
    if (!txId) throw new BitcoinConnectorTransactionFailedError()
    return { txHash: txId }
  }

  async signPsbt(psbtHex) {
    const { address: paymentAddress } = await this.requestAccount()

    const toSignPsbt = bitcoin.Psbt.fromHex(String(psbtHex), {
      network: MAINNET
    })
    const inputs = toSignPsbt.data.inputs

    const inputsToSign = [
      {
        // Need to sign each input with the payment address
        address: paymentAddress,
        signingIndexes: inputs.map((_, index) => index)
      }
    ]

    const signedPsbtBytes = await this.getProvider.signPSBT(fromHexString(psbtHex), {
      inputsToSign
    })
    const signedPsbt = bitcoin.Psbt.fromBuffer(signedPsbtBytes)
    signedPsbt.finalizeAllInputs()
    const tx = signedPsbt.extractTransaction()
    const txId = await broadcastTx(tx.toHex())
    return { txId }
  }
}
