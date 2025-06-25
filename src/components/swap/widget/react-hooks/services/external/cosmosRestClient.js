export class CosmosRestClient {
  restUrl

  constructor(restUrl) {
    this.restUrl = restUrl
  }

  /**
   * Fetches the balance of a single Cosmos token for the given address
   */
  async getBalance(address, denom) {
    try {
      const data = await this.fetch(`cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`)
      return data.balance || null
    } catch (error) {
      console.error('Error fetching Cosmos single balance:', error)
      return null
    }
  }

  /**
   * Fetches all balances for the given address
   */
  async getAllBalances(address) {
    try {
      const data = await this.fetch(`cosmos/bank/v1beta1/balances/${address}`)
      return data.balances || []
    } catch (error) {
      console.error('Error fetching Cosmos balances:', error)
      return []
    }
  }

  async fetch(path) {
    // Add trailing slash to the base URL if it's missing
    const base = this.restUrl.endsWith('/') ? this.restUrl : this.restUrl.concat('/')

    const url = base + path
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Cosmos client HTTP error: ${response.status}`)
    }

    return response.json()
  }
}
