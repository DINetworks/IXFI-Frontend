import axios from 'axios'
import { internalSquidApiBaseUrl } from '../../core/constants'

export class OnrampService {
  baseUrl = `${internalSquidApiBaseUrl}/fiat-to-crypto`

  async getQuote(params) {
    const { data } = await axios.get(`${this.baseUrl}/quotes`, {
      params: {
        fiatCurrency: params.fiatCurrency,
        cryptoCurrencyID: params.cryptoCurrencyID,
        amount: params.amount,
        region: params.region,
        paymentMethod: params.paymentMethod
      }
    })

    return data
  }

  async executeQuote(params) {
    const { data } = await axios.post(`${this.baseUrl}/execute`, params)

    return data
  }

  async getTransactionStatus(transactionId, walletAddress, providerId) {
    const { data } = await axios.get(`${this.baseUrl}/status/${transactionId}`, {
      params: {
        providerId,
        wallet: walletAddress
      }
    })

    return data
  }

  async getConfiguration({ chains, tokens }) {
    const { data } = await axios.get(`${this.baseUrl}/config`)
    // Filter supportedCryptos to only include tokens that match our provided tokens
    const filteredCryptos = data.supportedCryptos.filter(supportedCrypto =>
      tokens.some(
        token =>
          token.address.toLowerCase() === supportedCrypto.address.toLowerCase() &&
          token.chainId === supportedCrypto.chainId
      )
    )

    return {
      ...data,
      supportedCryptos: filteredCryptos
    }
  }

  async getPaymentTypes(fiatCurrency, cryptoCurrencyID, country) {
    const { data } = await axios.get(`${this.baseUrl}/payment-types`, {
      params: {
        fiat: fiatCurrency,
        crypto: cryptoCurrencyID,
        country
      }
    })

    return data
  }
}
