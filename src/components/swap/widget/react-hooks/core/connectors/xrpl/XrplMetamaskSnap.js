import { XrplNetwork } from '../../types/xrpl'

const EIP6963EventNames = {
  Announce: 'eip6963:announceProvider',
  Request: 'eip6963:requestProvider'
}

const NetworkChainId = {
  MAINNET: 0,
  TESTNET: 1,
  DEVNET: 2
}

const snapId = 'npm:xrpl-snap'

export class XrplMetamaskSnapConnector {
  provider

  async connect() {
    await this.initialize()
    await this.requestSnap(snapId)
    const { account } = await this.getAccount()
    return account
  }

  async signAndSubmit({ network, tx }) {
    if (!this.provider) throw new Error('Provider not initialized')

    const activeNetwork = await this.getActiveNetwork()
    const targetChainId = this.getNetworkChainId(network)

    if (activeNetwork.chainId !== targetChainId) {
      await this.changeNetwork(targetChainId)
    }

    const res = await this.invokeSnap({
      method: 'xrpl_signAndSubmit',
      params: tx
    })

    if (!res?.result) {
      throw new Error('Invalid transaction result')
    }

    const txResponse = res.result.tx_json
    const txStatus = res.result.engine_result

    return {
      hash: txResponse.hash,
      status: txStatus
    }
  }

  // Cannot use constructor because of the async initialization
  async initialize() {
    this.provider = await this.getProvider()
  }

  async requestSnap(id) {
    await this.request({
      method: 'wallet_requestSnaps',
      params: {
        [id]: {}
      }
    })
  }

  async getAccount() {
    return this.invokeSnap({
      method: 'xrpl_getAccount',
      params: undefined
    })
  }

  async getActiveNetwork() {
    return this.invokeSnap({
      method: 'xrpl_getActiveNetwork',
      params: undefined
    })
  }

  async changeNetwork(chainId) {
    try {
      return await this.invokeSnap({
        method: 'xrpl_changeNetwork',
        params: { chainId }
      })
    } catch (error) {
      // changeNetwork may fail if the user is already on the correct network
      // so we don't need to handle the error here
      return null
    }
  }

  async invokeSnap({ params, method }) {
    return this.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method,
          params
        }
      }
    })
  }

  async getProvider() {
    if (typeof window === 'undefined') {
      return null
    }
    if (await this.hasSnapsSupport(window.ethereum)) {
      return window.ethereum
    }
    if (window.ethereum?.detected) {
      for (const provider of window.ethereum.detected) {
        if (await this.hasSnapsSupport(provider)) {
          return provider
        }
      }
    }
    if (window.ethereum?.providers) {
      for (const provider of window.ethereum.providers) {
        if (await this.hasSnapsSupport(provider)) {
          return provider
        }
      }
    }
    // Need to use EIP-6963 provider discovery because we need Metamask to be installed
    // other wallets overriding Metamask won't work here because they don't support Metamask snaps
    const eip6963Provider = await this.getMetamaskEIP6963Provider()
    if (eip6963Provider && (await this.hasSnapsSupport(eip6963Provider))) {
      return eip6963Provider
    }

    return null
  }

  async hasSnapsSupport(provider = window.ethereum) {
    try {
      await provider.request({
        method: 'wallet_getSnaps'
      })
      return true
    } catch {
      return false
    }
  }

  async getMetamaskEIP6963Provider() {
    return new Promise(rawResolve => {
      // Timeout looking for providers after 500ms
      const timeout = setTimeout(() => {
        resolve(null)
      }, 500)
      function resolve(provider) {
        // Resolve the promise with a Metamask provider and clean up the timeout.
        window.removeEventListener(EIP6963EventNames.Announce, onAnnounceProvider)
        clearTimeout(timeout)
        rawResolve(provider)
      }

      /**
       * Listener for the EIP6963 announceProvider event.
       * Resolves the promise if a Metamask provider is found.
       */
      function onAnnounceProvider({ detail }) {
        const { info, provider } = detail
        if (info.rdns.includes('io.metamask')) {
          resolve(provider)
        }
      }

      window.addEventListener(EIP6963EventNames.Announce, onAnnounceProvider)
      window.dispatchEvent(new Event(EIP6963EventNames.Request))
    })
  }

  async request({ method, params }) {
    if (!this.provider) {
      throw new Error('XRPL Metamask provider not initialized')
    }
    return this.provider.request({ method, params })
  }

  getNetworkChainId(network) {
    switch (network) {
      case XrplNetwork.MAINNET:
        return NetworkChainId.MAINNET
      case XrplNetwork.TESTNET:
        return NetworkChainId.TESTNET
      default:
        throw new Error(`Network ${network} is not supported`)
    }
  }
}
