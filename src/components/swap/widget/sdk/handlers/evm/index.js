import erc20Abi from '../../abi/erc20.json' assert { type: 'json' }
import { EthersAdapter } from '../../adapter/EthersAdapter'
import { uint256MaxValue, NATIVE_EVM_TOKEN_ADDRESS, CHAINS_WITHOUT_MULTICALL } from '../../constants'
import { Utils } from './utils'

const ethersAdapter = new EthersAdapter()

export class EvmHandler extends Utils {
  async executeRoute({ data, params }) {
    const {
      route: { transactionRequest },
      overrides
    } = data

    const { target, value, data: txData } = transactionRequest
    const signer = data.signer

    const gasData = this.getGasData({
      transactionRequest: data.route.transactionRequest,
      overrides
    })

    if (!data.bypassBalanceChecks) {
      await this.validateBalanceAndApproval({
        data: { ...data, overrides: gasData },
        params
      })
    }

    const tx = {
      to: target,
      data: txData,
      value,
      chainId: Number(params.fromChain.chainId),
      ...gasData
    }

    return await signer.sendTransaction(tx)
  }

  async validateBalance({ sender, params }) {
    const { fromAmount, fromIsNative, fromProvider, fromChain, fromTokenContract } = params
    const amount = BigInt(fromAmount)

    if (fromIsNative) {
      return await this.validateNativeBalance({
        fromProvider,
        sender,
        amount,
        fromChain
      })
    } else {
      return await this.validateTokenBalance({
        amount,
        fromTokenContract,
        fromChain,
        sender
      })
    }
  }

  async validateBalanceAndApproval({ data, params }) {
    const wallet = data.signer
    let address = wallet.address

    try {
      address = await wallet.getAddress()
    } catch (error) {
      // Fallback to wallet.address if getAddress fails
    }

    await this.validateBalance({
      sender: address,
      params
    })

    if (params.fromIsNative) {
      return true
    }

    const hasAllowance = await this.validateAllowance({
      fromTokenContract: params.fromTokenContract,
      sender: address,
      router: data.route.transactionRequest.target,
      amount: BigInt(params.fromAmount)
    })

    if (!hasAllowance) {
      await this.approveRoute({ data, params })
    }

    return true
  }

  async approveRoute({ data, params }) {
    const {
      route: { transactionRequest },
      executionSettings,
      overrides
    } = data
    const { target } = transactionRequest
    const { fromIsNative, fromAmount } = params
    const fromTokenContract = params.fromTokenContract

    if (fromIsNative) {
      return null
    }

    let amountToApprove = BigInt(uint256MaxValue)
    if (executionSettings?.infiniteApproval === false) {
      amountToApprove = BigInt(fromAmount)
    }

    const approveData = fromTokenContract.interface.encodeFunctionData('approve', [target, amountToApprove])

    return data.signer.sendTransaction({
      to: params.preHook ? params.preHook.fundToken : params.fromToken.address,
      data: approveData,
      chainId: Number(params.fromChain.chainId),
      ...overrides
    })
  }

  async isRouteApproved({ sender, target, params }) {
    const result = await this.validateBalance({ sender, params })

    if (params.fromIsNative) {
      return {
        isApproved: true,
        message: 'Not required for native token'
      }
    }

    const hasAllowance = await this.validateAllowance({
      fromTokenContract: params.fromTokenContract,
      sender,
      router: target,
      amount: BigInt(params.fromAmount)
    })

    if (!hasAllowance) {
      return {
        isApproved: false,
        message: 'Not enough allowance'
      }
    }

    return result
  }

  getRawTxHex({ nonce, route, overrides }) {
    const { target, data, value } = route.transactionRequest

    const gasData = this.getGasData({
      transactionRequest: route.transactionRequest,
      overrides
    })

    return ethersAdapter.serializeTransaction({
      chainId: parseInt(route.params.fromChain, 10),
      to: target,
      data,
      value,
      nonce,
      ...gasData
    })
  }

  async getBalances(evmTokens, userAddress, chainRpcUrls) {
    try {
      const [tokensNotSupportingMulticall, tokensSupportingMulticall] = evmTokens.reduce(
        (acc, token) => {
          acc[CHAINS_WITHOUT_MULTICALL.includes(Number(token.chainId)) ? 0 : 1].push(token)
          return acc
        },
        [[], []]
      )

      const tokensByChainId = tokensSupportingMulticall.reduce((groupedTokens, token) => {
        ;(groupedTokens[token.chainId] ??= []).push(token)
        return groupedTokens
      }, {})

      const tokensMulticall = []

      for (const [chainId, tokens] of Object.entries(tokensByChainId)) {
        const rpcUrl = chainRpcUrls[chainId]
        if (!rpcUrl) continue

        const tokensBalances = await this.getTokensBalanceSupportingMultiCall(tokens, rpcUrl, userAddress)
        tokensMulticall.push(...tokensBalances)
      }

      const tokensNotMultiCall = await this.getTokensBalanceWithoutMultiCall(
        tokensNotSupportingMulticall,
        userAddress,
        chainRpcUrls
      )

      return [...tokensMulticall, ...tokensNotMultiCall]
    } catch (error) {
      return []
    }
  }

  populateRouteParams(tokensChains, params, signer) {
    const { fromChain, toChain, fromToken, toToken, preHook } = params
    const _fromChain = tokensChains.getChainData(fromChain)
    const _toChain = tokensChains.getChainData(toChain)
    const _fromToken = tokensChains.getTokenData(fromToken, fromChain)
    const _toToken = tokensChains.getTokenData(toToken, toChain)

    const fromProvider = ethersAdapter.rpcProvider(_fromChain.rpc)
    const fromIsNative = _fromToken.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()

    let fromTokenContract
    if (!fromIsNative) {
      fromTokenContract = ethersAdapter.contract(
        preHook ? preHook.fundToken : _fromToken.address,
        erc20Abi,
        signer || fromProvider
      )
    }

    return {
      ...params,
      fromChain: _fromChain,
      toChain: _toChain,
      fromToken: _fromToken,
      toToken: _toToken,
      fromTokenContract,
      fromProvider,
      fromIsNative
    }
  }
}
