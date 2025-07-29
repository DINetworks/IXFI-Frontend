import { XAMAN_API_URL } from '../../core/constants'
import { XamanXrplNetwork, XrplNetwork } from '../../core/types/xrpl'

/**
 * Client to interact with the Xaman backend through a Squid proxy.
 * Retrieves the QR code data for the following methods:
 * - sign in
 * - get user session
 * - send tx
 */
export class XamanClient {
  static baseUrl = XAMAN_API_URL

  static async signIn(signal) {
    return this.fetch('sign-in', undefined, signal)
  }

  static async userSession(payload, signal) {
    return this.fetch('user-session', { payload }, signal)
  }

  static async sendTx({ tx, signal, network }) {
    const xamanNetwork = this.getXamanNetwork(network)

    return this.fetch('send-tx', { tx, network: xamanNetwork }, signal)
  }

  static async fetch(endpoint, body, signal) {
    const url = new URL(endpoint, this.baseUrl)
    const res = await fetch(url.toString(), {
      method: 'POST',
      body: body != null ? JSON.stringify(body) : undefined,
      signal
    })

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    return res.json()
  }

  static getXamanNetwork(network) {
    switch (network) {
      case XrplNetwork.MAINNET:
        return XamanXrplNetwork.MAINNET
      case XrplNetwork.TESTNET:
        return XamanXrplNetwork.TESTNET
      default:
        throw new Error(`Network ${network} is not supported`)
    }
  }
}

export function isXamanXAppContext() {
  try {
    return !!navigator.userAgent.match(/xumm\/xapp/i) || !!navigator.userAgent.match(/xAppBuilder/i)
  } catch {
    return false
  }
}

let xummClient = null
// Xumm app ID, safe to expose on client-side
const xummAppId = '5f341f00-03c6-4f3e-a367-e69698ca8337'

/**
 * Initializes the Xumm sdk on client-side, if not already initialized.
 * Returns null on server-side.
 *
 * the Xumm constructor can run in 3 different environments: Server, Browser, and xApp (Xaman's embedded browser)
 * When running on the server, the constructor needs both App ID and API secret
 * When running in xApp or browser envs, the constructor only needs the App ID
 * We avoid initializing the Xumm instance on the server
 * as it would throw an error during SRR (API secret is required in server env).
 */
export async function getXummClient() {
  if (typeof window === 'undefined') {
    return null
  }

  if (xummClient) {
    return xummClient
  }

  const { Xumm } = await import('xumm')
  xummClient = new Xumm(xummAppId)

  return xummClient
}
