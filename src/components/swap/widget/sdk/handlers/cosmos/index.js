import { stargate } from '@cosmjs/stargate'
import { toUtf8, toBech32, fromBech32 } from '@cosmjs/encoding'
import { CCTP_TYPE, IBC_TRANSFER_TYPE, WASM_TYPE, ChainType } from '../../types'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { MsgDepositForBurn } from './cctpProto'
import Long from 'long'

export * from './cctpProto'

export class CosmosHandler {
  async validateBalance({ data, params }) {
    const { signerAddress } = data
    const signer = data.signer

    const coin = {
      denom: params.fromToken.address,
      amount: params.fromAmount
    }

    if (!signerAddress) {
      throw new Error('signerAddress not provided')
    }

    const signerCoinBalance = await signer.getBalance(signerAddress, coin.denom)
    const currentBalance = BigInt(signerCoinBalance.amount)
    const transferAmount = BigInt(coin.amount)

    if (transferAmount > currentBalance) {
      throw `Insufficient funds for account: ${signerAddress} on chain ${params.fromChain.chainId}`
    }

    return true
  }

  async executeRoute({ data, params }) {
    await this.validateBalance({ data, params })

    const { route } = data
    const transactionRequest = route.transactionRequest
    const signerAddress = data.signerAddress
    const signer = data.signer
    const msgs = []
    const cosmosMsg = JSON.parse(transactionRequest?.data)

    switch (cosmosMsg.typeUrl) {
      case CCTP_TYPE: {
        signer.registry.register(CCTP_TYPE, MsgDepositForBurn)
        cosmosMsg.value.mintRecipient = new Uint8Array(Buffer.from(cosmosMsg.value.mintRecipient, 'base64'))
        msgs.push(cosmosMsg)
        break
      }
      case IBC_TRANSFER_TYPE:
        cosmosMsg.value.timeoutTimestamp = Long.fromValue(cosmosMsg.value.timeoutTimestamp).toNumber()
        msgs.push(cosmosMsg)
        break
      case WASM_TYPE:
        signer.registry.register(WASM_TYPE, MsgExecuteContract)
        cosmosMsg.value.msg = toUtf8(cosmosMsg.value.msg)
        msgs.push(cosmosMsg)
        break
      default:
        throw new Error(`Cosmos message ${cosmosMsg.typeUrl} not supported`)
    }

    let memo = ''
    if (transactionRequest?.requestId) {
      memo = JSON.stringify({
        squidRequestId: transactionRequest?.requestId
      })
    }

    const estimatedGas = await signer.simulate(signerAddress, msgs, memo)
    const gasMultiplier = Number(transactionRequest?.maxFeePerGas) || 1.5
    const gasPrice = transactionRequest?.gasPrice

    return signer.sign(
      signerAddress,
      msgs,
      stargate.calculateFee(Math.trunc(estimatedGas * gasMultiplier), stargate.GasPrice.fromString(gasPrice)),
      memo
    )
  }

  async getBalances({ addresses, cosmosChains }) {
    const cosmosBalances = []

    for (const chain of cosmosChains) {
      if (chain.chainType !== ChainType.COSMOS) continue

      const addressData = addresses.find(address => address.coinType === chain.coinType)
      if (!addressData) continue

      const cosmosAddress = this.deriveCosmosAddress(chain.bech32Config.bech32PrefixAccAddr, addressData.address)

      try {
        const client = await stargate.StargateClient.connect(chain.rpc)
        const balances = (await client.getAllBalances(cosmosAddress)) ?? []

        if (balances.length === 0) continue

        balances.forEach(balance => {
          const { amount, denom } = balance
          const decimals = chain.currencies.find(currency => currency.coinDenom === denom)?.coinDecimals ?? 6

          cosmosBalances.push({
            balance: amount,
            denom,
            chainId: String(chain.chainId),
            decimals
          })
        })
      } catch (error) {
        // Silently handle errors
      }
    }

    return cosmosBalances
  }

  deriveCosmosAddress(chainPrefix, address) {
    return toBech32(chainPrefix, fromBech32(address).data)
  }

  populateRouteParams(tokensChains, params) {
    const { fromChain, toChain, fromToken, toToken } = params
    const _fromChain = tokensChains.getChainData(fromChain)
    const _toChain = tokensChains.getChainData(toChain)
    const _fromToken = tokensChains.getTokenData(fromToken, fromChain)
    const _toToken = tokensChains.getTokenData(toToken, toChain)

    return {
      ...params,
      fromChain: _fromChain,
      toChain: _toChain,
      fromToken: _fromToken,
      toToken: _toToken
    }
  }
}
