import { WalletConnectModal } from '@walletconnect/modal'
import UniversalProvider from '@walletconnect/universal-provider'
import { getSdkError } from '@walletconnect/utils'
import { XRPL_METHOD, XrplCAIP2ChainId, XrplNetwork, XrplTxStatus } from '../../../core/types/xrpl'
import { isXrplAddressValid } from '../../../services/internal/xrplService'

const chains = [XrplCAIP2ChainId.MAINNET, XrplCAIP2ChainId.TESTNET]

export class XrplWalletConnect {
  provider = null
  session = null
  modal = null
  projectId
  metadata
  recommendedWalletId
  listeners = {}

  constructor({ projectId, metadata, recommendedWalletId }) {
    this.metadata = metadata
    this.projectId = projectId
    this.recommendedWalletId = recommendedWalletId
  }

  validateInitialized() {
    if (!this.provider) {
      throw new Error('Provider is not initialized')
    }
  }

  /**
   * Sets up providers and event listeners, must be called before connecting
   *
   * - initializes WalletConnect UniversalProvider
   * - initializes WalletConnectModal
   * - attaches event listeners
   */
  async initialize() {
    if (this.provider) return
    this.provider = await UniversalProvider.init({
      projectId: this.projectId,
      // logger: "debug",
      metadata: this.metadata,
      // We need to specify a custom storage prefix to avoid conflicts with Wagmi's walletConnect instance
      // https://docs.reown.com/walletkit/web/usage#core-instance-sharing
      customStoragePrefix: 'squid-xrpl'
    })
    this.provider.client.on('session_delete', () => {
      this.emit('disconnect', undefined)
    })
    const options = this.recommendedWalletId
      ? {
          explorerRecommendedWalletIds: [this.recommendedWalletId],
          explorerExcludedWalletIds: 'ALL'
        }
      : {}
    this.modal = new WalletConnectModal({
      projectId: this.projectId,
      chains,
      ...options
    })
  }

  /**
   * Initializes WalletConnect and silently connects to the last session if it exists
   */
  async autoConnect() {
    await this.initialize()
    this.validateInitialized()
    const sessions = this.provider.client.session.getAll()
    if (sessions.length === 0) {
      this.emit('disconnect', undefined)
      return null
    }
    const lastKeyIndex = sessions.length - 1
    const lastSession = sessions[lastKeyIndex]
    return this.onSessionConnected(lastSession)
  }

  /**
   * Initializes WalletConnect and prompts the user to connect to a new session
   */
  async connect() {
    await this.initialize()
    this.validateInitialized()
    const { uri, approval } = await this.provider.client.connect({
      requiredNamespaces: {
        xrpl: {
          chains: [XrplCAIP2ChainId.MAINNET],
          methods: [XRPL_METHOD.SIGN_TRANSACTION],
          events: ['accountsChanged']
        }
      }
    })

    let modalClosed = () => {}
    const modalClosedPromise = new Promise((_, reject) => {
      modalClosed = reject
    })

    let unsubscribe = () => {}
    if (uri) {
      this.modal.openModal({ uri })
      unsubscribe = this.modal.subscribeModal(state => {
        if (state.open === false) {
          // propagate the error by rejecting the promise
          // to avoid connect() from running forever
          modalClosed(new Error('User closed the modal'))
        }
      })
    }

    try {
      const session = await Promise.race([approval(), modalClosedPromise])
      const address = await this.onSessionConnected(session)
      return address
    } finally {
      unsubscribe()
      this.modal.closeModal()
    }
  }

  /**
   * Disconnects from the current session
   */
  async disconnect() {
    if (!this.session) throw new Error('Session is not connected')
    this.validateInitialized()
    await this.provider.client.disconnect({
      topic: this.session.topic,
      reason: getSdkError('USER_DISCONNECTED')
    })
  }

  /**
   * Prompts the user to sign and submit a transaction
   */
  async signAndSubmit({ network, tx }) {
    if (!this.session) throw new Error('Session is not connected')
    this.validateInitialized()
    const result = await this.provider.client.request({
      chainId: this.getWcChainId(network),
      topic: this.session.topic,
      request: {
        method: XRPL_METHOD.SIGN_TRANSACTION,
        params: {
          tx_json: tx,
          autofill: true,
          submit: true
        }
      }
    })
    const { hash } = result.tx_json
    if (!hash) {
      throw new Error('Invalid transaction hash')
    }
    return {
      hash,
      // Wallet side handles submitting and validating the transaction
      status: XrplTxStatus.SUCCESS
    }
  }

  /**
   * Maps the given network to the WalletConnect chain ID format
   */
  getWcChainId(network) {
    switch (network) {
      case XrplNetwork.MAINNET:
        return XrplCAIP2ChainId.MAINNET
      case XrplNetwork.TESTNET:
        return XrplCAIP2ChainId.TESTNET
      default:
        throw new Error(`Network ${network} is not supported`)
    }
  }

  /**
   * Stores the provided session and returns the user's address
   */
  async onSessionConnected(session) {
    this.session = session
    const allNamespaceAccounts = Object.values(session.namespaces).flatMap(namespace => namespace.accounts)
    const [firstAccount] = allNamespaceAccounts
    const address = firstAccount?.split(':')?.at(-1)
    if (address && isXrplAddressValid(address)) {
      return address
    }
    throw new Error('No address found in session')
  }

  on(event, listener) {
    if (this.listeners[event]) this.listeners[event]?.push(listener)
    else this.listeners[event] = [listener]
    return () => this.off(event, listener)
  }

  emit(event, args) {
    this.listeners[event]?.forEach(listener => listener.apply(null, [args]))
  }

  off(event, listener) {
    this.listeners[event] = this.listeners[event]?.filter(existingListener => listener !== existingListener)
  }
}
