import { CHAIN_IDS } from 'src/components/swap/widget/react-hooks'
import { darkTheme } from '@0xsquid/ui'
import { squidApiBaseUrl } from './externalLinks'

export const maxPriceImpact = 30
export const limitTradeSizeUsd = 10000000
export const DEFAULT_INTEGRATOR_ID = 'squid-widget-studio'

// by setting slippage to undefined, it's set to "auto"
export const defaultSlippage = undefined
export const slippageWarning = 3

export const MAX_SLIPPAGE = {
  DEFAULT: 5,
  ADVANCED: 99
}

export const TOOLTIP_DISPLAY_DELAY_MS = {
  HELP: 0,
  DEFAULT: 1000
}

export const DEFAULT_ROUTE_REFETCH_INTERVAL = 30000

export const defaultValues = {
  config: {
    integratorId: DEFAULT_INTEGRATOR_ID,
    theme: darkTheme,
    themeType: 'dark',
    slippage: defaultSlippage,
    apiUrl: squidApiBaseUrl,
    mainLogoUrl: undefined,
    tabs: {
      swap: true,
      buy: true,
      send: false
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5
    }
  }
}

export const GENERIC_ERROR_MESSAGE = 'Oops! something went wrong. Try again later'

export const POPULAR_CHAINS_IDS = [
  CHAIN_IDS.ETHEREUM,
  CHAIN_IDS.BITCOIN,
  CHAIN_IDS.SOLANA,
  CHAIN_IDS.ARBITRUM,
  CHAIN_IDS.OPTIMISM,
  CHAIN_IDS.BASE,
  CHAIN_IDS.BSC,
  CHAIN_IDS.OSMOSIS
]

export const CHAINFLIP_BRIDGE_CHAIN_IDS = [CHAIN_IDS.BITCOIN, CHAIN_IDS.SOLANA]

// Chains that only support routing via Coral (no DEXs)
export const CORAL_ONLY_CHAIN_IDS = [
  CHAIN_IDS.BERACHAIN,
  CHAIN_IDS.XRPL_EVM,
  CHAIN_IDS.GNOSIS,
  CHAIN_IDS.SONIC,
  CHAIN_IDS.HYPER_EVM,
  CHAIN_IDS.SONEIUM,
  CHAIN_IDS.PEAQ
]

// Chains that support routing via Coral (may also support DEXs)
export const CORAL_CHAIN_IDS = [
  ...CORAL_ONLY_CHAIN_IDS,
  CHAIN_IDS.POLYGON,
  CHAIN_IDS.AVALANCHE,
  CHAIN_IDS.ETHEREUM,
  CHAIN_IDS.OPTIMISM,
  CHAIN_IDS.BASE,
  CHAIN_IDS.ARBITRUM,
  CHAIN_IDS.BSC,
  CHAIN_IDS.LINEA,
  CHAIN_IDS.BLAST,
  CHAIN_IDS.CELO,
  CHAIN_IDS.XRPL
]
