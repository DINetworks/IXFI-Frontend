import { ChainType } from '@0xsquid/squid-types'
import { accessProperty } from '../services/internal/walletService'
import { KeplrConnector, PhantomConnector, UnisatConnector } from './connectors/bitcoin'
import { CrossmarkConnector } from './connectors/xrpl/CrossMark'
import { XrplWalletConnect } from './connectors/xrpl/WalletConnect'
import { XrplMetamaskSnapConnector } from './connectors/xrpl/XrplMetamaskSnap'
import { WC_METADATA, WALLETCONNECT_PROJECT_ID, WALLETCONNECT_WALLET_IDS } from './constants'
import { WindowWalletFlag } from './types/wallet'

export const walletIconBaseUrl = 'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/wallets'

const bitcoinWallets = [
  {
    name: 'Unisat',
    type: ChainType.BTC,
    connectorId: 'unisat',
    isMobile: true,
    icon: `${walletIconBaseUrl}/unisat.webp`,
    connectorName: 'Unisat',
    windowFlag: WindowWalletFlag.Unisat,
    connector: new UnisatConnector()
  }
]

export const xrplWallets = [
  {
    type: ChainType.XRPL,
    name: 'XRPL Metamask Snap',
    isInstalled() {
      // we need to check if the snap is installed
      return false
    },
    skipInstallCheck: true,
    connector: new XrplMetamaskSnapConnector(),
    connectorId: 'xrpl-metamask-snap',
    connectorName: 'XRPL Metamask Snap',
    windowFlag: WindowWalletFlag.XrpLedgerMetamaskSnap,
    icon: `${walletIconBaseUrl}/metamask-xrpl-snap.webp`
  },
  {
    type: ChainType.XRPL,
    name: 'Crossmark',
    windowFlag: WindowWalletFlag.Crossmark,
    connector: new CrossmarkConnector(),
    connectorId: 'crossmark',
    connectorName: 'Crossmark',
    icon: `${walletIconBaseUrl}/crossmark.webp`
  },
  {
    type: ChainType.XRPL,
    name: 'Joey',
    windowFlag: WindowWalletFlag.XrplJoey,
    connector: new XrplWalletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        url: WC_METADATA.url,
        name: WC_METADATA.name,
        icons: [WC_METADATA.icon],
        description: WC_METADATA.description
      },
      recommendedWalletId: WALLETCONNECT_WALLET_IDS.joey
    }),
    isInstalled: () => false,
    skipInstallCheck: true,
    isMobile: true,
    connectorId: 'joey',
    connectorName: 'Joey',
    icon: `${walletIconBaseUrl}/joey.webp`
  },
  {
    type: ChainType.XRPL,
    name: 'Girin',
    windowFlag: WindowWalletFlag.XrplGirin,
    connector: new XrplWalletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        url: WC_METADATA.url,
        name: WC_METADATA.name,
        icons: [WC_METADATA.icon],
        description: WC_METADATA.description
      },
      recommendedWalletId: WALLETCONNECT_WALLET_IDS.girin
    }),
    isInstalled: () => false,
    skipInstallCheck: true,
    isMobile: true,
    connectorId: 'girin',
    connectorName: 'Girin',
    icon: `${walletIconBaseUrl}/girin.webp`
  },
  {
    type: ChainType.XRPL,
    name: 'Bifrost',
    windowFlag: WindowWalletFlag.XrplBifrost,
    connector: new XrplWalletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        url: WC_METADATA.url,
        name: WC_METADATA.name,
        icons: [WC_METADATA.icon],
        description: WC_METADATA.description
      },
      recommendedWalletId: WALLETCONNECT_WALLET_IDS.bifrost
    }),
    isInstalled: () => false,
    skipInstallCheck: true,
    isMobile: true,
    connectorId: 'bifrost',
    connectorName: 'Bifrost',
    icon: `${walletIconBaseUrl}/bifrost.webp`
  }
]

export const multiChainWallets = [
  {
    isMultiChain: true,
    name: 'Leap',
    windowFlag: WindowWalletFlag.Leap,
    icon: `${walletIconBaseUrl}/leap.webp`,
    connectorId: 'leap',
    connectorName: 'Leap',
    isMobile: true,
    supportedNetworks: [
      {
        chainType: ChainType.COSMOS,
        connector: () => ({
          id: 'leap',
          name: 'Leap',
          provider: accessProperty(window, 'leap')
        })
      }
    ]
  },
  {
    isMultiChain: true,
    name: 'Keplr',
    connectorId: 'keplr',
    connectorName: 'Keplr',
    windowFlag: WindowWalletFlag.Keplr,
    icon: `${walletIconBaseUrl}/keplr.webp`,
    isMobile: true,
    supportedNetworks: [
      {
        chainType: ChainType.COSMOS,
        connector: () => ({
          id: 'keplr',
          name: 'Keplr',
          provider: accessProperty(window, 'keplr')
        })
      },
      {
        chainType: ChainType.BTC,
        connector: new KeplrConnector()
      }
    ]
  },
  {
    isMultiChain: true,
    name: 'Phantom',
    connectorId: 'phantom',
    connectorName: 'Phantom',
    windowFlag: WindowWalletFlag.Phantom,
    icon: `${walletIconBaseUrl}/phantom.webp`,
    isMobile: true,
    supportedNetworks: [
      {
        chainType: ChainType.BTC,
        connector: new PhantomConnector()
      }
    ]
  },
  {
    isMultiChain: true,
    name: 'Ctrl Wallet',
    connectorId: 'ctrl',
    connectorName: 'Ctrl',
    windowFlag: WindowWalletFlag.Ctrl,
    icon: `${walletIconBaseUrl}/ctrl.webp`,
    supportedNetworks: [
      {
        chainType: ChainType.COSMOS,
        connector: () => ({
          id: 'ctrl',
          name: 'Ctrl',
          provider: accessProperty(window, 'xfi.keplr')
        })
      }
    ]
  },
  {
    isMultiChain: true,
    name: 'Cosmostation',
    connectorId: 'cosmostation',
    connectorName: 'Cosmostation',
    windowFlag: WindowWalletFlag.Cosmostation,
    icon: `${walletIconBaseUrl}/cosmostation.webp`,
    isMobile: true,
    supportedNetworks: [
      {
        chainType: ChainType.COSMOS,
        connector: () => ({
          id: 'cosmostation',
          name: 'Cosmostation',
          provider: accessProperty(window, 'cosmostation.providers.keplr')
        })
      }
    ]
  }
]

export const singleChainWallets = [...bitcoinWallets]

export const walletStoreLinks = {
  leap: {
    chrome: 'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    firefox: ''
  },
  keplr: {
    chrome: 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/keplr/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search'
  },
  coinbase: {
    chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search'
  },
  walletConnect: {
    chrome: '',
    firefox: ''
  },
  blockchaindotcom: {
    chrome: '',
    firefox: ''
  },
  metamask: {
    chrome: 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    firefox: ''
  },
  cosmostation: {
    chrome: 'https://chrome.google.com/webstore/detail/cosmostation-wallet/fpkhgmpbidmiogeglndfbkegfdlnajnf',
    firefox: ''
  },
  ctrl: {
    chrome: 'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    firefox: ''
  },
  bitget: {
    chrome: 'https://chrome.google.com/webstore/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak',
    firefox: ''
  },
  trustwallet: {
    chrome: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
    firefox: ''
  },
  coin98: {
    chrome: 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    firefox: ''
  },
  rabby: {
    chrome: 'https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    firefox: ''
  },
  okx: {
    chrome: 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    firefox: ''
  },
  injected: {
    chrome: '',
    firefox: ''
  },
  zerion: {
    chrome: 'https://chrome.google.com/webstore/detail/zerion-wallet-for-web3-nf/klghhnkeealcohjjanjjdaeeggmfmlpl',
    firefox: ''
  },
  deficonnect: {
    chrome: 'https://chrome.google.com/webstore/detail/cryptocom-wallet-extensio/hifafgmccdpekplomjjkcfgodnhcellj',
    firefox: ''
  },
  exodus: {
    chrome: 'https://chromewebstore.google.com/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    firefox: ''
  },
  rainbow: {
    chrome: 'https://chromewebstore.google.com/detail/rainbow/opfgelmcmbiajamepnmloijbpoleiama',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/rainbow-extension'
  },
  phantom: {
    chrome: 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/phantom-app/'
  },
  unisat: {
    chrome: 'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo',
    firefox: ''
  },
  backpack: {
    chrome: 'https://chromewebstore.google.com/detail/backpack/aflkmfhebedbjioipglgcbcmnbpgliof',
    firefox: ''
  },
  'xrpl-metamask-snap': {
    chrome: 'https://snaps.metamask.io/snap/npm/xrpl-snap/',
    firefox: 'https://snaps.metamask.io/snap/npm/xrpl-snap/'
  },
  crossmark: {
    chrome: 'https://chromewebstore.google.com/detail/crossmark-wallet/canipghmckojpianfgiklhbgpfmhjkjg',
    firefox: ''
  },
  'xaman-qr': {
    chrome: '',
    firefox: ''
  },
  'xaman-xapp': {
    chrome: '',
    firefox: ''
  },
  joey: {
    chrome: '',
    firefox: ''
  },
  girin: {
    chrome: '',
    firefox: ''
  },
  bifrost: {
    chrome: '',
    firefox: ''
  },
  brave: {
    chrome: '',
    firefox: ''
  },
  cryptodotcom: {
    chrome: '',
    firefox: ''
  },
  nightly: {
    chrome: 'https://chromewebstore.google.com/detail/nightly/fiikommddbeccaoicoejoniammnalkfa',
    firefox: ''
  },
  tokenpocket: {
    chrome: 'https://chromewebstore.google.com/detail/tokenpocket-web3-crypto-w/mfgccjchihfkkindfppnaooecgfneiii',
    firefox: ''
  }
}
