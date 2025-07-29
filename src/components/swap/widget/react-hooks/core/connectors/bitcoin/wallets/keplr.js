import {
  BitcoinConnectorInvalidAccountError,
  BitcoinConnectorProviderNotFoundError,
  BitcoinConnectorTransactionFailedError
} from '../errors'

export class KeplrConnector {
  get getProvider() {
    const provider = window?.bitcoin_keplr
    if (!provider) {
      throw new BitcoinConnectorProviderNotFoundError('Keplr')
    }
    return provider
  }

  async sendBTC(to, amount) {
    const txHash = await this.getProvider.sendBitcoin(to, amount)
    if (!txHash) {
      throw new BitcoinConnectorTransactionFailedError()
    }
    return { txHash }
  }

  async requestAccount() {
    const accounts = await this.getProvider.requestAccounts()
    const account = accounts[0]
    if (typeof account !== 'string') {
      throw new BitcoinConnectorInvalidAccountError()
    }
    return {
      address: account
    }
  }
}
