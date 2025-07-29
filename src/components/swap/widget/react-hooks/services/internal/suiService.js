import { ChainType } from '@0xsquid/squid-types'
import { SUI_MAINNET_CHAIN, SUI_TESTNET_CHAIN } from '@mysten/wallet-standard'
import { CHAIN_IDS } from '../../core/constants'
import { walletIconBaseUrl } from '../../core/wallets'
import { isStandardWalletWithCustomFeatures, standardWalletOverrides } from './walletStandardService'

const SUI_FEATURES = ['sui:signTransaction']

function isSuiStandardWallet(wallet) {
  return isStandardWalletWithCustomFeatures(wallet, SUI_FEATURES)
}

export function filterSuiWallets(standardWallets) {
  // Filter out all non-Sui standard wallets
  return standardWallets.filter(isSuiStandardWallet).map(formatSuiWallet)
}

function isHex(value) {
  return /^(0x|0X)?[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0
}

function getHexByteLength(value) {
  return /^(0x|0X)/.test(value) ? (value.length - 2) / 2 : value.length / 2
}

const SUI_ADDRESS_LENGTH = 32
// Ref. https://github.com/MystenLabs/ts-sdks/blob/31dd6c73d7aab9819bd545323273f733cfcc5a01/packages/typescript/src/utils/sui-types.ts#L24-L27
export function isSuiAddressValid(address) {
  return isHex(address) && getHexByteLength(address) === SUI_ADDRESS_LENGTH
}

export const slushWebWalletData = {
  icon: `${walletIconBaseUrl}/slush-web.webp`,
  id: 'slush-web-wallet',
  name: 'Slush Web Wallet'
}

/**
 * Format a Sui standard wallet into a Squid Wallet
 */
function formatSuiWallet(wallet) {
  const { icon, name: defaultName, features, id } = wallet
  const standardWalletId = id || defaultName
  const walletOverrides = standardWalletOverrides[standardWalletId]
  const walletIcon = walletOverrides?.icon || icon
  const name = walletOverrides?.name || defaultName
  const connectorId = walletOverrides?.connectorId || standardWalletId
  const isSlushWebWallet = connectorId === slushWebWalletData.id
  return {
    connectorId,
    name,
    connectorName: name,
    type: ChainType.SUI,
    icon: walletIcon,
    windowFlag: name,
    isMobile: false,
    // Slush (web) is a social wallet so it cannot be installed
    // and works similar to WalletConnect
    isInstalled: isSlushWebWallet ? undefined : () => true,
    skipInstallCheck: isSlushWebWallet,
    connector: {
      signTransaction: features['sui:signTransaction'].signTransaction,
      connect: async params => {
        const { accounts } = await features['standard:connect'].connect(params)
        if (!accounts.length) {
          throw new Error('No accounts returned from wallet')
        }
        return {
          account: accounts[0]
        }
      },
      disconnect: async () => {
        await features['standard:disconnect']?.disconnect()
      },
      on: features['standard:events'].on
    }
  }
}

export function getSuiChain(chainId) {
  switch (chainId) {
    case CHAIN_IDS.SUI:
      return SUI_MAINNET_CHAIN
    case CHAIN_IDS.SUI_TESTNET:
      return SUI_TESTNET_CHAIN
    default:
      return null
  }
}
