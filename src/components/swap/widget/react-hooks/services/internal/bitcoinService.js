import { address as btcAddressLib } from 'bitcoinjs-lib'
import { KeplrConnector, PhantomConnector, UnisatConnector } from '../../core/connectors/bitcoin/wallets'

export const connectBitcoinWallet = async wallet => {
  switch (wallet.connectorId) {
    case 'phantom': {
      const phantom = new PhantomConnector()
      const { address } = await phantom.requestAccount()
      return {
        address,
        wallet
      }
    }
    case 'unisat': {
      const unisat = new UnisatConnector()
      const { address } = await unisat.requestAccount()
      return {
        address,
        wallet
      }
    }
    case 'keplr': {
      const keplr = new KeplrConnector()
      const { address } = await keplr.requestAccount()
      return {
        address,
        wallet
      }
    }
    default:
      throw new Error('Invalid Bitcoin wallet')
  }
}

// Validation taken from Squid API repo
export const isBitcoinAddressValid = address => {
  try {
    if (address.startsWith('bc1p')) {
      // this is a bitcoin taproot address type, it has different encoding than other 3 address types
      // and requires different validation logic
      const decoded = btcAddressLib.fromBech32(address)
      return decoded.prefix === 'bc' && decoded.version === 1
    } else {
      btcAddressLib.toOutputScript(address)
      return true
    }
  } catch (e) {
    return false
  }
}
