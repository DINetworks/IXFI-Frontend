export class SuiRpcClient {
  /**
   * Native Sui coin object type in long format.
   * This is the format used by the Squid UI and API
   */
  suiNativeCoinObjectTypeLong = '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'

  /**
   * Native Sui coin object type in short format.
   * This is the format used by RPC providers
   */
  suiNativeCoinObjectTypeShort = '0x2::sui::SUI'
  rpcUrl
  constructor(rpcUrl) {
    this.rpcUrl = rpcUrl
  }

  /**
   * Fetches the balance of a single Sui token for a given address.
   */
  async getBalance(userAddress, tokenAddress) {
    const response = await this.call('suix_getBalance', [userAddress, this.toShortCoinObjectType(tokenAddress)])
    return {
      ...response,
      coinType: this.toLongCoinObjectType(response.coinType)
    }
  }

  /**
   * Fetches all Sui coin balances for a given address.
   */
  async getAllBalances(userAddress) {
    const response = await this.call('suix_getAllBalances', [userAddress])
    return response.map(balance => ({
      ...balance,
      coinType: this.toLongCoinObjectType(balance.coinType)
    }))
  }
  async call(method, params) {
    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    })
    const data = await response.json()
    if (data.error) {
      throw new Error(`RPC Error (${method}): ${data.error.message}`)
    }
    if (!data.result) {
      throw new Error(`Invalid response from RPC (${method})`)
    }
    return data.result
  }

  /**
   * Parse native coin object type from the long format to the short format.
   */
  toShortCoinObjectType(coinObjectType) {
    return coinObjectType === this.suiNativeCoinObjectTypeLong ? this.suiNativeCoinObjectTypeShort : coinObjectType
  }

  /**
   * Parse native coin object type from the short format to the long format.
   */
  toLongCoinObjectType(coinObjectType) {
    return coinObjectType === this.suiNativeCoinObjectTypeShort ? this.suiNativeCoinObjectTypeLong : coinObjectType
  }
}
