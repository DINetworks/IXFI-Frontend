import { nativeXrplTokenAddress } from '../../core/constants'
import { XrplTxStatus } from '../../core/types/xrpl'
import { formatBNToReadable } from '../internal/numberService'

export class XrplRpcClient {
  rpcUrl

  constructor(rpcUrl) {
    this.rpcUrl = rpcUrl
  }

  async getBalance(address, tokenAddress) {
    if (tokenAddress.toLowerCase() === nativeXrplTokenAddress.toLowerCase()) {
      return this.getNativeBalance(address)
    }

    return this.getIssuedCurrencyBalance(address, tokenAddress)
  }

  async getAllBalances(address) {
    const [nativeBalance, trustLineBalances] = await Promise.all([
      this.getNativeBalance(address),
      this.getTrustLines(address)
    ])

    return [
      {
        balance: nativeBalance,
        address: nativeXrplTokenAddress
      },
      ...trustLineBalances.lines.map(line => ({
        balance: line.balance,
        address: `${line.currency}.${line.account}`
      }))
    ]
  }

  async getTrustLines(address, issuer) {
    return this.call('account_lines', [
      {
        account: address,
        ledger_index: 'validated',
        peer: issuer
      }
    ])
  }

  async getTrustLine(address, issuer, currency) {
    const response = await this.getTrustLines(address, issuer)
    const trustLine = response.lines.find(line => line.currency === currency)

    return trustLine ?? null
  }

  async accountActivatedInfo(address) {
    const serverState = await this.getServerState()
    const reserveBaseBn = BigInt(serverState.state.validated_ledger.reserve_base)
    try {
      const accountInfo = await this.getAccountInfo(address)
      const balanceBn = BigInt(accountInfo.account_data.Balance)

      return {
        isActivated: balanceBn >= reserveBaseBn,
        reserveBaseBn
      }
    } catch (error) {
      if (error.message?.includes('actNotFound')) {
        return { isActivated: false, reserveBaseBn }
      }

      throw error
    }
  }

  /**
   * Waits for a transaction to be validated and returns its final status.
   * Resolves to 'success' or throws an error with the failed status.
   */
  async waitForTransaction(txHash, { interval = 2_000, timeout = 20_000 } = {}) {
    const startTime = Date.now()

    while (true) {
      try {
        const response = await this.call('tx', [
          {
            transaction: txHash,
            binary: false
          }
        ])

        if (!response.validated) {
          if (Date.now() - startTime > timeout) {
            throw new Error(`Transaction ${txHash} not validated within timeout`)
          }

          await new Promise(res => setTimeout(res, interval))
          continue
        }

        const status = response.meta?.TransactionResult
        if (status === XrplTxStatus.SUCCESS) {
          return status
        } else {
          throw new Error(`Transaction failed with status: ${status}`)
        }
      } catch (error) {
        // txnNotFound = still pending or non-existent
        if (error?.message?.includes('txnNotFound')) {
          if (Date.now() - startTime > timeout) {
            throw new Error(`Transaction ${txHash} not found within timeout`)
          }

          await new Promise(res => setTimeout(res, interval))
          continue
        }

        throw error
      }
    }
  }
  async getServerState() {
    return this.call('server_state', [{}])
  }

  async getAccountInfo(address) {
    return this.call('account_info', [
      {
        account: address,
        ledger_index: 'validated'
      }
    ])
  }

  /**
   * Returns the balance of the user in the native XRP token
   * formatted as a string
   */
  async getNativeBalance(address) {
    const [accountInfo, serverState] = await Promise.all([this.getAccountInfo(address), this.getServerState()])

    const balance = BigInt(accountInfo.account_data.Balance)
    const ownerCount = BigInt(accountInfo.account_data.OwnerCount)
    const reserveBase = BigInt(serverState.state.validated_ledger.reserve_base)
    const reserveIncrement = BigInt(serverState.state.validated_ledger.reserve_inc)
    const reserveBalance = reserveBase + ownerCount * reserveIncrement
    const spendableBalance = balance - reserveBalance

    return formatBNToReadable(spendableBalance, 6)
  }

  /**
   * Returns the balance of the user in the given issued currency (e.g. RLUSD)
   * formatted as a string
   */
  async getIssuedCurrencyBalance(address, tokenAddress) {
    const response = await this.getTrustLines(address)
    const tokenBalance = response.lines.find(line => `${line.currency}.${line.account}` === tokenAddress)

    return tokenBalance?.balance || '0'
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
    if (!data.result) {
      throw new Error(`Invalid response from RPC (${method})`)
    }

    if ('error' in data.result) {
      throw new Error(`Error from RPC (${method}): ${data.result.error}`)
    }

    return data.result
  }
}
