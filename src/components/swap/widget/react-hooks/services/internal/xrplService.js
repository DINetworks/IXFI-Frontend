import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec'
import { CHAIN_IDS } from '../../core/constants'
import { XrplNetwork } from '../../core/types/xrpl'

/**
 * Validates that a given address is a valid XRPL address.
 *
 * There are two types of address in XRPL:
 * - X-address (e.g XVfC9...pokKH)
 * - Classic address (e.g r4bA...WHCG)
 */
export function isXrplAddressValid(address) {
  if (!address) return false

  return isValidXAddress(address) || isValidClassicAddress(address)
}

export function buildXrplTrustSetTx({ amount, sourceAddress, token }) {
  const [currency, issuer] = token.address.split('.')

  return {
    TransactionType: 'TrustSet',
    Account: sourceAddress,
    LimitAmount: {
      currency,
      issuer,
      value: amount
    }
  }
}

export function getXrplNetwork(chainId) {
  switch (chainId) {
    case CHAIN_IDS.XRPL:
      return XrplNetwork.MAINNET
    case CHAIN_IDS.XRPL_TESTNET:
      return XrplNetwork.TESTNET
    default:
      return null
  }
}

export function parseXrplPaymentTx(data) {
  try {
    const asPaymentTx = data
    if (
      Array.isArray(asPaymentTx.Memos) &&
      isXrplAddressValid(asPaymentTx.Account) &&
      isXrplAddressValid(asPaymentTx.Destination)
    ) {
      return asPaymentTx
    }
    throw new Error('Could not parse payment transaction')
  } catch (error) {
    throw new Error('Could not parse payment transaction')
  }
}
