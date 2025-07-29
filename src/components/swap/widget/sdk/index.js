'use client'

import { SquidDataType, ChainType } from './types'
import HttpAdapter from './adapter/HttpAdapter'
import { EvmHandler, CosmosHandler, SolanaHandler } from './handlers'
import { TokensChains } from './utils/TokensChains'
import { getCosmosChainsForChainIds } from './utils/cosmos'
import { getEvmTokensForChainIds, getChainRpcUrls } from './utils/evm'
import { isValidNumber } from './utils/numbers'

const baseUrl = 'https://testnet.api.squidrouter.com/'

export class Squid extends TokensChains {
  constructor(config = {}) {
    super()
    this.handlers = {
      evm: new EvmHandler(),
      cosmos: new CosmosHandler(),
      solana: new SolanaHandler()
    }
    this.initialized = false
    this.isInMaintenanceMode = false

    if (!config.integratorId) {
      throw new Error('integratorId required')
    }

    this.httpInstance = new HttpAdapter({
      baseURL: config?.baseUrl || baseUrl,
      config,
      headers: {
        'x-integrator-id': config.integratorId
      },
      timeout: config.timeout
    })

    this.config = {
      baseUrl: config?.baseUrl || baseUrl,
      ...config
    }
  }

  setConfig(config) {
    this.httpInstance = new HttpAdapter({
      baseURL: config?.baseUrl || baseUrl,
      config,
      headers: {
        'x-integrator-id': config.integratorId || 'squid-sdk'
      },
      timeout: config.timeout
    })

    this.config = {
      baseUrl: config?.baseUrl || baseUrl,
      ...config
    }
  }

  async init() {
    const response = await this.httpInstance.get('v2/sdk-info')
    if (response.status != 200) {
      throw new Error('SDK initialization failed')
    }

    this.tokens = response.data.tokens
    this.chains = response.data.chains
    this.isInMaintenanceMode = response.data.isInMaintenanceMode
    this.maintenanceMessage = response.data.maintenanceMessage
    this.axelarscanURL = response.data.axlScanUrl
    this.initialized = true
  }

  // PUBLIC METHODS
  async getStatus(params) {
    const { data, headers } = await this.httpInstance.axios.get('/v2/status', {
      params,
      headers: {
        ...this.httpInstance.axios.defaults.headers.common,
        ...(params.requestId && { 'x-request-id': params.requestId }),
        ...(params.integratorId && { 'x-integrator-id': params.integratorId })
      }
    })

    const requestId = headers?.['x-request-id']
    const integratorId = headers?.['x-integrator-id']

    return {
      ...data,
      requestId,
      integratorId
    }
  }

  async getRoute(params) {
    this.validateInit()
    const { data, headers, status } = await this.httpInstance.post('v2/route', params)

    if (status != 200) {
      throw new Error(data.error)
    }

    const requestId = headers?.['x-request-id']
    const integratorId = headers?.['x-integrator-id']

    return {
      ...data,
      requestId,
      integratorId
    }
  }

  async executeRoute(data) {
    this.validateInit()
    this.validateTransactionRequest(data.route)

    switch (data.route.transactionRequest?.type) {
      case SquidDataType.OnChainExecution:
        return await this.executeOnChainTx(data)
      case SquidDataType.ChainflipDepositAddress:
        return await this.requestDepositAddress(data)
      default:
        throw new Error(`Unsupported transaction request type - ${data.route.transactionRequest?.type}`)
    }
  }

  async executeOnChainTx(data) {
    const fromChain = this.getChainData(data.route.params.fromChain)

    switch (fromChain.chainType) {
      case ChainType.EVM:
        const evmParams = this.handlers.evm.populateRouteParams(this, data.route.params, data.signer)
        return this.handlers.evm.executeRoute({
          data,
          params: evmParams
        })
      case ChainType.COSMOS:
        const cosmosParams = this.handlers.cosmos.populateRouteParams(this, data.route.params)
        return this.handlers.cosmos.executeRoute({
          data,
          params: cosmosParams
        })
      case ChainType.SOLANA:
        return this.handlers.solana.executeRoute({ data })
      default:
        throw new Error(`Method not supported given chain type ${fromChain.chainType}`)
    }
  }

  async requestDepositAddress(route) {
    const depositAddressRequest = route.route.transactionRequest
    const { data, status } = await this.httpInstance.post('v2/deposit-address', depositAddressRequest)

    if (status != 200) {
      throw new Error(data.error)
    }

    return data
  }

  async isRouteApproved({ route, sender }) {
    this.validateInit()
    this.validateTransactionRequest(route)

    const fromChain = this.getChainData(route.params.fromChain)

    switch (fromChain.chainType) {
      case ChainType.EVM:
        const params = this.handlers.evm.populateRouteParams(this, route.params)
        return await this.handlers.evm.isRouteApproved({
          sender,
          params,
          target: route.transactionRequest.target
        })
      default:
        throw new Error(`Method not supported given chain type ${fromChain.chainType}`)
    }
  }

  async approveRoute(data) {
    this.validateInit()
    this.validateTransactionRequest(data.route)

    const fromChain = this.getChainData(data.route.params.fromChain)

    switch (fromChain.chainType) {
      case ChainType.EVM:
        const params = this.handlers.evm.populateRouteParams(this, data.route.params, data.signer)
        return this.handlers.evm.approveRoute({ data, params })
      default:
        throw new Error(`Method not supported given chain type ${fromChain.chainType}`)
    }
  }

  getRawTxHex(data) {
    this.validateInit()
    this.validateTransactionRequest(data.route)
    return this.handlers.evm.getRawTxHex({ ...data })
  }

  async getTokenPrice({ tokenAddress, chainId }) {
    const response = await this.httpInstance.axios.get('/v2/tokens', {
      params: { address: tokenAddress, chainId, usdPrice: true }
    })

    const token = response.data.tokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase())

    if (!token || !isValidNumber(token.usdPrice)) {
      throw new Error(`Valid token price not found for address ${tokenAddress} on chain ${chainId}`)
    }

    return Number(token.usdPrice)
  }

  async getMultipleTokensPrice({ chainId }) {
    const response = await this.httpInstance.axios.get('/v2/tokens', {
      params: {
        ...(chainId && { chainId }),
        usdPrice: true
      }
    })

    return response.data.tokens.filter(token => isValidNumber(token.usdPrice))
  }

  async getFromAmount({ fromToken, toAmount, toToken, slippagePercentage = 1.5 }) {
    const [fromTokenPrice = fromToken.usdPrice ?? 0, toTokenPrice = toToken.usdPrice ?? 0] = await Promise.all([
      this.getTokenPrice({
        chainId: fromToken.chainId,
        tokenAddress: fromToken.address
      }),
      this.getTokenPrice({
        chainId: toToken.chainId,
        tokenAddress: toToken.address
      })
    ])

    const fromAmount = (toTokenPrice * Number(toAmount ?? 0)) / fromTokenPrice
    const slippage = fromAmount * (slippagePercentage / 100)
    const fromAmountPlusSlippage = fromAmount + slippage

    return fromAmountPlusSlippage.toString()
  }

  async getEvmBalances({ userAddress, chains = [] }) {
    const chainRpcUrls = getChainRpcUrls({
      chains: this.chains
    })

    const tokens = getEvmTokensForChainIds({
      chainIds: chains,
      tokens: this.tokens
    })

    return this.handlers.evm.getBalances(tokens, userAddress, chainRpcUrls)
  }

  async getCosmosBalances({ addresses, chainIds = [] }) {
    const cosmosChains = getCosmosChainsForChainIds({
      chainIds,
      chains: this.chains
    })

    return this.handlers.cosmos.getBalances({
      addresses,
      cosmosChains
    })
  }

  async getAllBalances({ chainIds = [], cosmosAddresses, evmAddress }) {
    const normalizedChainIds = chainIds.map(String)

    const [evmChainIds, cosmosChainIds] = this.chains.reduce(
      (cosmosAndEvmChains, chain) => {
        if (!normalizedChainIds.includes(String(chain.chainId))) {
          return cosmosAndEvmChains
        }

        if (chain.chainType === ChainType.COSMOS) {
          cosmosAndEvmChains[1].push(chain.chainId)
        } else {
          cosmosAndEvmChains[0].push(chain.chainId)
        }

        return cosmosAndEvmChains
      },
      [[], []]
    )

    const evmBalances = evmAddress
      ? await this.getEvmBalances({
          chains: evmChainIds,
          userAddress: evmAddress
        })
      : []

    const cosmosBalances = cosmosAddresses
      ? await this.getCosmosBalances({
          addresses: cosmosAddresses,
          chainIds: cosmosChainIds
        })
      : []

    return {
      evmBalances,
      cosmosBalances
    }
  }

  // INTERNAL PRIVATES METHODS
  validateInit() {
    if (!this.initialized) {
      throw new Error('SquidSdk must be initialized! Please call the SquidSdk.init method')
    }
  }

  validateTransactionRequest(route) {
    if (!route.transactionRequest) {
      throw new Error('transactionRequest param not found in route object')
    }
  }
}
