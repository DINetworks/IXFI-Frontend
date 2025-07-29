'use client'
import { ChainType } from '@0xsquid/squid-types'
import { zeroAddress as evmZeroAddress } from 'viem'
import { squidApiBaseUrl } from './externalLinks'

export const WALLETCONNECT_PROJECT_ID = 'db6a4f6ff58e4172b2fd52f01360bc49'
export const WALLETCONNECT_WALLET_IDS = {
  joey: 'd9f5432e932c6fad8e19a0cea9d4a3372a84aed16e98a52e6655dd2821a63404',
  girin: '994824d1e0b935f48ec3570c9d51fe5af9bbd9246b6f57210906f8b853ad2196',
  bifrost: '37a686ab6223cd42e2886ed6e5477fce100a4fb565dcd57ed4f81f7c12e93053'
}

export const DEFAULT_LOCALE = 'en-US'
export const WC_METADATA = {
  name: 'Squid',
  url: 'https://app.squidrouter.com',
  icon: 'https://squidrouter.com/favicon.ico',
  description: 'Swap, send, and bridge across chains.'
}

const btcZeroAddress = 'bc1qcdyjau30xhw26h2egcfklwyyyskafhp9x8qtg2'
const cosmosZeroAddress = 'osmo1awrua7e2kj69d7vn5qt5tccrhavmj9xa6y8hhu'
const solanaZeroAddress = 'AuF3k2X5CsXJiXo7YKL5jxDG3gmf9MjaVK8hqt7Kfes1'
const suiZeroAddress = '0x0000000000000000000000000000000000000000'
const xrplZeroAddress = 'rrrrrrrrrrrrrrrrrrrrrhoLvTp'

export const chainTypeToZeroAddressMap = {
  [ChainType.EVM]: evmZeroAddress,
  [ChainType.COSMOS]: cosmosZeroAddress,
  [ChainType.BTC]: btcZeroAddress,
  [ChainType.SOLANA]: solanaZeroAddress,
  [ChainType.SUI]: suiZeroAddress,
  [ChainType.XRPL]: xrplZeroAddress
}

export const nativeEvmTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const nativeCosmosTokenAddress = 'uosmo'
export const nativeSolanaTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const nativeBitcoinTokenAddress = 'satoshi'
export const nativeSuiTokenAddress = '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
export const nativeXrplTokenAddress = 'xrp'
export const maxPriceImpact = 30
export const limitTradeSizeUsd = 10000000
// by setting slippage to undefined, it's set to "auto"
export const defaultSlippage = undefined
export const destinationAddressResetValue = 'null'
export const fallbackAddressResetValue = 'null'
export const gasRefundMultiplier = 25
export const internalSquidApiBaseUrl = 'https://app.squidrouter.com/api'
export const XAMAN_API_URL = `${internalSquidApiBaseUrl}/xaman/`
export const TOKEN_PRICE_API_URL = `${internalSquidApiBaseUrl}/coingecko`
export const SOLANA_RPC_URL = 'https://meredith-ute2ko-fast-mainnet.helius-rpc.com'
export const INTEGRATOR_ID = 'squid-widget-playground-local-cd33cba6-7e12-4fcc-8d5d-35e286f655ea'
export const DEFAULT_COUNTRY_CODE = 'US'

export const CHAIN_IDS = {
  // Cosmos
  OSMOSIS: 'osmosis-1',
  INJECTIVE: 'injective-1',
  SECRET: 'secret-4',
  ARCHWAY: 'archway-1',
  XION: 'xion-mainnet-1',
  NOBLE: 'noble-1',
  AGORIC: 'agoric-3',
  // EVM
  ETHEREUM: '1',
  ETHEREUM_SEPOLIA: '11155111',
  ARBITRUM: '42161',
  BSC: '56',
  BASE: '8453',
  OPTIMISM: '10',
  LINEA: '59144',
  BLAST: '81457',
  CELO: '42220',
  POLYGON: '137',
  AVALANCHE: '43114',
  IMMUTABLE: '13371',
  SCROLL: '534352',
  MOONBEAM: '1284',
  MANTLE: '5000',
  FANTOM: '250',
  KAVA: '2222',
  FILECOIN: '314',
  BERACHAIN: '80094',
  SAGA_EVM: '5464',
  XRPL_EVM: '1440000',
  XRPL_EVM_TESTNET: '1449000',
  GNOSIS: '100',
  SONIC: '146',
  HYPER_EVM: '999',
  SONEIUM: '1868',
  PEAQ: '3338',
  // others
  BITCOIN: 'bitcoin',
  SOLANA: 'solana-mainnet-beta',
  SUI: 'sui-mainnet',
  SUI_TESTNET: 'sui-testnet',
  XRPL: 'xrpl-mainnet',
  XRPL_TESTNET: 'xrpl-testnet'
}

export const chainTypeToDefaultChainIdMap = {
  [ChainType.EVM]: CHAIN_IDS.ETHEREUM,
  [ChainType.COSMOS]: CHAIN_IDS.OSMOSIS,
  [ChainType.BTC]: CHAIN_IDS.BITCOIN,
  [ChainType.SOLANA]: CHAIN_IDS.SOLANA,
  [ChainType.SUI]: CHAIN_IDS.SUI,
  [ChainType.XRPL]: CHAIN_IDS.XRPL
}

export const chainTypeToNativeTokenAddressMap = {
  [ChainType.EVM]: nativeEvmTokenAddress,
  [ChainType.COSMOS]: nativeCosmosTokenAddress,
  [ChainType.BTC]: nativeBitcoinTokenAddress,
  [ChainType.SOLANA]: nativeSolanaTokenAddress,
  [ChainType.SUI]: nativeSuiTokenAddress,
  [ChainType.XRPL]: nativeXrplTokenAddress
}

export const defaultConfigValues = {
  integratorId: INTEGRATOR_ID,
  slippage: defaultSlippage,
  apiUrl: squidApiBaseUrl,
  priceImpactWarnings: {
    warning: 3,
    critical: 5
  }
}
export const EvmPriorityConnectors = {
  Safe: 'safe',
  LedgerLive: 'ledgerLive'
}

// Success
const cctpSuccessStatuses = ['complete']
const chainflipSuccessStatuses = ['COMPLETE']
const solanaSameChainSuccessStatuses = ['finalized']

const axelarSuccessStatuses = ['destination_executed', 'executed', 'express_executed', 'success']

// Error
const axelarErrorStatuses = ['error_fetching_status', 'error', 'failed_on_destination']
const chainflipErrorStatuses = ['BROADCAST_ABORTED']

// Refunded
export const transactionRefundedStatuses = ['refunded']

export const transactionErrorStatuses = [...axelarErrorStatuses, ...chainflipErrorStatuses]

export const transactionSuccessStatuses = [
  ...cctpSuccessStatuses,
  ...axelarSuccessStatuses,
  ...chainflipSuccessStatuses,
  ...solanaSameChainSuccessStatuses
]

export const transactionEndStatuses = [
  ...transactionSuccessStatuses,
  ...transactionRefundedStatuses,
  ...transactionErrorStatuses
]
