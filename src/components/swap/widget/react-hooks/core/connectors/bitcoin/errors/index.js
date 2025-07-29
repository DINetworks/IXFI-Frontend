class BitcoinConnectorError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BitcoinConnectorError'
  }
}

export class BitcoinConnectorProviderNotFoundError extends BitcoinConnectorError {
  constructor(providerName) {
    super(`Bitcoin provider ${providerName} not found`)
  }
}

export class BitcoinConnectorTransactionFailedError extends BitcoinConnectorError {
  constructor() {
    super('Bitcoin transaction failed')
  }
}

export class BitcoinConnectorInvalidAccountError extends BitcoinConnectorError {
  constructor() {
    super('Bitcoin account is invalid')
  }
}
