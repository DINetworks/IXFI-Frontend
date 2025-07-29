import { XrplNetwork } from '../../types/xrpl'

const NetworkLabel = {
  XAHAU: 'xahau',
  XRPL: 'xrp ledger'
}

const NetworkType = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet',
  DEVNET: 'devnet'
}

export class CrossmarkConnector {
  getProvider() {
    return window?.xrpl?.crossmark
  }

  async connect() {
    const provider = this.getProvider()
    if (!provider) {
      throw new Error('Crossmark provider not found')
    }

    await provider.async.signInAndWait()

    const address = provider.session?.address

    if (!address) {
      throw new Error('Crossmark address not found')
    }

    return address
  }

  async signAndSubmit({ network, tx }) {
    const activeNetwork = this.getActiveNetwork()
    if (activeNetwork !== network) {
      throw new Error(`Invalid network (expected ${network}, got ${activeNetwork})`)
    }

    const provider = this.getProvider()

    if (!provider) {
      throw new Error('Crossmark provider not found')
    }

    const result = await provider.async.signAndSubmitAndWait(tx)
    const { data } = result.response

    if (data.meta?.isRejected) {
      throw new Error('User rejected the request.')
    }

    if (data.meta?.isError) {
      throw new Error(data.errorMessage || 'Error signing transaction')
    }

    if (!data.resp.result) {
      throw new Error('Invalid transaction response')
    }

    return {
      hash: data.resp.result.hash,
      status: data.resp.result.meta.TransactionResult
    }
  }

  getActiveNetwork() {
    const provider = this.getProvider()
    if (!provider) {
      throw new Error('Crossmark provider not found')
    }

    const network = provider.session?.network
    if (!network) {
      throw new Error('Crossmark network not found')
    }

    if (network.label !== NetworkLabel.XRPL) {
      throw new Error(`Active network is not supported (expected '${NetworkLabel.XRPL}', got '${network.label}')`)
    }

    switch (network.type) {
      case NetworkType.MAINNET:
        return XrplNetwork.MAINNET
      case NetworkType.TESTNET:
        return XrplNetwork.TESTNET
      default:
        throw new Error(`Active network is not supported (got '${network.type}')`)
    }
  }
}
