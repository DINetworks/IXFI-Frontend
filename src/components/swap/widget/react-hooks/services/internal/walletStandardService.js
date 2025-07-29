import { walletIconBaseUrl } from '../../core/wallets'

const STANDARD_FEATURES = ['standard:connect', 'standard:events']

/**
 * Validates that a given standard wallet has all the required standard features
 * and additional custom features
 */
export function isStandardWalletWithCustomFeatures(wallet, customFeatures) {
  return [...STANDARD_FEATURES, ...customFeatures].every(feature => feature in wallet.features)
}

function withAliases(aliases, data) {
  return Object.fromEntries(aliases.map(alias => [alias, data]))
}

/**
 * Mapping of an ID and custom wallet overrides
 * Used to unify wallets with different IDs into a single wallet
 * These IDs can come from different wallet providers, e.g. EIP6963, wallets-standard, etc.
 *
 * @example Unify Metamask (EVM) and Metamask (Solana) to have the same icon, name, and ID
 */
export const standardWalletOverrides = {
  'Surf Wallet': {
    icon: `${walletIconBaseUrl}/surf.webp`
  },
  Suiet: {
    icon: `${walletIconBaseUrl}/suiet.webp`
  },
  'com.mystenlabs.suiwallet': {
    icon: `${walletIconBaseUrl}/slush.webp`,
    name: 'Slush Wallet'
  },
  injected: {
    name: 'Browser Extension',
    icon: `${walletIconBaseUrl}/wallet_icon.webp`
  },
  walletConnect: {
    icon: `${walletIconBaseUrl}/walletConnect.webp`
  },
  'io.rabby': {
    name: 'Rabby',
    icon: `${walletIconBaseUrl}/rabby.webp`,
    connectorId: 'rabby'
  },
  'me.rainbow': {
    name: 'Rainbow',
    icon: `${walletIconBaseUrl}/rainbow.webp`,
    connectorId: 'rainbow'
  },
  'app.keplr': {
    name: 'Keplr',
    icon: `${walletIconBaseUrl}/keplr.webp`,
    connectorId: 'keplr'
  },
  ...withAliases(['io.leapwallet.LeapWallet', 'Leap Wallet'], {
    name: 'Leap',
    icon: `${walletIconBaseUrl}/leap.webp`,
    connectorId: 'leap'
  }),
  ...withAliases(['com.crypto.wallet', 'Crypto.com Onchain'], {
    name: 'Crypto.com',
    connectorId: 'cryptodotcom'
  }),
  ...withAliases(['app.nightly', 'Nightly'], {
    connectorId: 'nightly'
  }),
  ...withAliases(['com.coinbase.wallet', 'coinbaseWalletSDK'], {
    name: 'Coinbase Wallet',
    icon: `${walletIconBaseUrl}/coinbase.webp`,
    connectorId: 'coinbase'
  }),
  ...withAliases(['io.metamask', 'metaMaskSDK', 'MetaMask'], {
    name: 'MetaMask',
    icon: `${walletIconBaseUrl}/metamask.webp`,
    connectorId: 'metamask'
  }),
  ...withAliases(['app.backpack', 'Backpack'], {
    name: 'Backpack',
    icon: `${walletIconBaseUrl}/backpack.webp`,
    connectorId: 'backpack'
  }),
  ...withAliases(['io.cosmostation', 'Cosmostation Wallet'], {
    name: 'Cosmostation',
    icon: `${walletIconBaseUrl}/cosmostation.webp`,
    connectorId: 'cosmostation'
  }),
  ...withAliases(['com.trustwallet.app', 'Trust'], {
    name: 'Trust Wallet',
    icon: `${walletIconBaseUrl}/trustwallet.webp`,
    connectorId: 'trustwallet'
  }),
  ...withAliases(['io.xdefi', 'Ctrl Wallet'], {
    name: 'Ctrl Wallet',
    icon: `${walletIconBaseUrl}/ctrl.webp`,
    connectorId: 'ctrl'
  }),
  ...withAliases(['com.bitget.web3', 'Bitget Wallet'], {
    name: 'Bitget Wallet',
    icon: `${walletIconBaseUrl}/bitget.webp`,
    connectorId: 'bitget'
  }),
  ...withAliases(['com.exodus.web3-wallet', 'Exodus'], {
    name: 'Exodus',
    icon: `${walletIconBaseUrl}/exodus.webp`,
    connectorId: 'exodus'
  }),
  ...withAliases(['com.okex.wallet', 'OKX Wallet'], {
    name: 'OKX Wallet',
    icon: `${walletIconBaseUrl}/okx.webp`,
    connectorId: 'okx'
  }),
  ...withAliases(['com.brave.wallet', 'Brave Wallet'], {
    name: 'Brave Wallet',
    icon: `${walletIconBaseUrl}/brave.webp`,
    connectorId: 'brave'
  }),
  ...withAliases(['app.phantom', 'Phantom'], {
    name: 'Phantom',
    icon: `${walletIconBaseUrl}/phantom.webp`,
    connectorId: 'phantom'
  }),
  ...withAliases(['TokenPocket', 'https://www.tokenpocket.pro/en/download/app'], {
    name: 'TokenPocket',
    connectorId: 'tokenpocket'
  })
}
