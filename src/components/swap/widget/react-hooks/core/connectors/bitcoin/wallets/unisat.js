import {
  BitcoinConnectorInvalidAccountError,
  BitcoinConnectorProviderNotFoundError,
  BitcoinConnectorTransactionFailedError
} from '../errors'

export class UnisatConnector {
  get getProvider() {
    const provider = window?.unisat
    if (!provider) {
      throw new BitcoinConnectorProviderNotFoundError('Unisat')
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
