import { MulticallWrapper } from 'ethers-multicall-provider'
import { ethers } from 'ethers'
import { NATIVE_EVM_TOKEN_ADDRESS, MULTICALL_ADDRESS, multicallAbi } from '../../constants'

export class Utils {
  getGasData({ transactionRequest, overrides }) {
    const { gasLimit, gasPrice, maxPriorityFeePerGas, maxFeePerGas, setGasPrice = false } = transactionRequest

    let gasParams = { gasLimit }

    if (setGasPrice) {
      gasParams = maxPriorityFeePerGas ? { gasLimit, maxPriorityFeePerGas, maxFeePerGas } : { gasLimit, gasPrice }
    }

    return overrides ? { ...gasParams, ...overrides } : gasParams
  }

  async validateNativeBalance({ fromProvider, sender, amount, fromChain }) {
    const balance = await fromProvider.getBalance(sender)
    if (amount > balance) {
      throw new Error(`Insufficient funds for account: ${sender} on chain ${fromChain.chainId}`)
    }
    return {
      isApproved: true,
      message: `User has the expected balance ${amount} of ${fromChain.nativeCurrency.symbol}`
    }
  }

  async validateTokenBalance({ amount, fromTokenContract, sender, fromChain }) {
    const balance = await fromTokenContract.balanceOf(sender)
    if (amount > balance) {
      throw new Error(`Insufficient funds for account: ${sender} on chain ${fromChain.chainId}`)
    }

    let tokenSymbol
    try {
      tokenSymbol = await fromTokenContract.symbol()
    } catch (error) {
      console.error('Failed to get token symbol')
    }

    return {
      isApproved: true,
      message: tokenSymbol
        ? `User has the expected balance ${amount} of ${tokenSymbol}`
        : `User has the expected balance ${amount}`
    }
  }

  async validateAllowance({ amount, fromTokenContract, sender, router }) {
    const allowance = await fromTokenContract.allowance(sender, router)
    return amount <= allowance
  }

  async getTokensBalanceSupportingMultiCall(tokens, chainRpcUrl, userAddress) {
    if (!userAddress) return []

    const multicallProvider = MulticallWrapper.wrap(new ethers.JsonRpcProvider(chainRpcUrl))

    const tokenBalances = tokens.map(async token => {
      const isNativeToken = token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()

      const contract = new ethers.Contract(
        isNativeToken ? MULTICALL_ADDRESS : token.address,
        isNativeToken
          ? multicallAbi
          : [
              {
                name: 'balanceOf',
                type: 'function',
                inputs: [{ name: '_owner', type: 'address' }],
                outputs: [{ name: 'balance', type: 'uint256' }],
                stateMutability: 'view'
              }
            ],
        multicallProvider
      )

      try {
        const balanceInWei = await contract[isNativeToken ? 'getEthBalance' : 'balanceOf'](userAddress)
        return {
          balance: balanceInWei.toString(),
          symbol: token.symbol,
          address: token.address,
          decimals: token.decimals,
          chainId: token.chainId
        }
      } catch (error) {
        return {
          balance: '0',
          symbol: token.symbol,
          address: token.address,
          decimals: token.decimals,
          chainId: token.chainId
        }
      }
    })

    try {
      return await Promise.all(tokenBalances)
    } catch (error) {
      return []
    }
  }

  async getTokensBalanceWithoutMultiCall(tokens, userAddress, rpcUrlsPerChain) {
    const balances = await Promise.all(
      tokens.map(async token => {
        try {
          return await this.fetchBalance({
            token,
            userAddress,
            rpcUrl: rpcUrlsPerChain[token.chainId]
          })
        } catch (error) {
          return null
        }
      })
    )

    return balances.filter(Boolean)
  }

  async fetchBalance({ token, userAddress, rpcUrl }) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl)
      const tokenAbi = ['function balanceOf(address) view returns (uint256)']
      const tokenContract = new ethers.Contract(token.address ?? '', tokenAbi, provider)
      const balance = (await tokenContract.balanceOf(userAddress)) ?? '0'

      if (!token) return null

      return {
        address: token.address,
        balance: parseInt(balance, 16).toString(),
        decimals: token.decimals,
        symbol: token.symbol,
        chainId: token.chainId
      }
    } catch (error) {
      return null
    }
  }
}
