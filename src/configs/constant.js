import { mainnet, bsc, arbitrum, avalanche, optimism, base, polygon, scroll, hardhat, fantom, linea } from 'viem/chains'

const roadmaps = [
  {
    icon: 'mvp.svg',
    period: '2025 Q1',
    active: true,
    title: 'MVP Development',
    items: ['Develop Gas Abstraction Layer', 'Develop Relayer Node System', 'Develop DI Token']
  },
  {
    icon: 'development.svg',
    period: '2025 Q2',
    title: 'Development & Test',
    items: [
      'Improve & Update MVP Version',
      'Develop Cross Chain Aggregator',
      'Develop Cross Chain Bridge',
      'DI Token & Community, Marketing'
    ]
  },
  {
    icon: 'launch.svg',
    period: '2025 Q3',
    title: 'Mainnet Launch',
    items: ['Integration Test', 'Conduct Security Audit', 'Mainnet Lunch', 'Token Presale']
  },
  {
    icon: 'strategy.svg',
    period: '2025 Q4',
    title: 'Development Network & Strategies',
    items: ['Develop Governance', 'Develop Staking', 'Incentive for Network Users', 'Development API & SDK']
  },
  {
    icon: 'staking.svg',
    period: '2026 Q1',
    title: 'Launch Staking & Governance',
    items: ['Security Audit for Governance & Staking', 'Incentive for Network Users', 'Partnerships with 3rd parties']
  },
  {
    icon: 'further.svg',
    period: '2026 Q2',
    title: 'Further Development & Maintenance',
    items: ['...', '...', '...']
  }
]

const useCases = [
  {
    title: 'DEX Aggregators & Swap',
    description:
      'A Cross-Chain DEX Aggregator enables users to swap assets across multiple blockchain networks seamlessly by aggregating liquidity from different DEXs. This ensures optimal trade execution, lower slippage, and enhanced price discovery, regardless of the network.',
    image: 'tab1.webp'
  },
  {
    title: 'Lending & Borrowing Platform',
    description:
      'This allows users to lend and borrow assets across multiple blockchain networks, eliminating liquidity fragmentation and enabling seamless capital efficiency in DeFi. By leveraging cross-chain interoperability, users can supply assets on one chain and borrow against them on another without relying on centralized intermediaries.',
    image: 'tab2.webp'
  },
  {
    title: 'Multi-Chain Liquidity Provisioning',
    description:
      'Multi-chain liquidity provisioning is a system that enables users to supply liquidity across multiple blockchain networks, ensuring efficient token swaps, lending, and yield farming opportunities. It allows liquidity providers (LPs) to earn rewards while enhancing cross-chain DeFi efficiency.',
    image: 'tab3.webp'
  }
]

const features = [
  {
    icon: 'gasless.svg',
    title: 'Gas-Less Transactions For Multiple Chains',
    description:
      'Gas fees are a significant barrier to seamless blockchain interactions, often requiring users to hold native tokens for each network they interact with. The DI Protocol introduces a gas-less transaction system, enabling frictionless cross-chain interactions without requiring users to manage gas tokens for multiple chains.'
  },
  {
    icon: 'evm.svg',
    title: 'Supports All EVM Networks',
    description:
      'The DI Protocol is designed to operate seamlessly across all EVM-compatible blockchains, ensuring maximum interoperability and accessibility for users. By supporting a wide range of networks, DI enables truly gasless transactions, liquidity aggregation, and smart contract interactions across multiple ecosystems.'
  },
  {
    icon: 'cross-chain.svg',
    title: 'The foundation for cross-chain DApps',
    description:
      'The DI Protocol is more than just a cross-chain swap solution—it serves as the core infrastructure for the next wave of DApps. By enabling seamless interoperability, gas-less transactions, and liquidity aggregation across multiple chains, DI empowers developers and users to unlock the full potential of blockchain technology.'
  }
]

const BUY_STEPS = [
  {
    icon: 'gasless.svg',
    title: 'Connect to wallet',
    description:
      'Connect with your preferable crypto wallet, we offer options: MetaMask, Wallet Connect with more than 170+ wallets available!'
  },
  {
    icon: 'evm.svg',
    title: 'Choose payable token',
    description:
      'You can participate on ArtiCoin pre-sale from Ethereum and Binance Smart Chain by using tokens like: BNB, ETH, USDT, USDC, BUSD and more.'
  },

  {
    icon: 'cross-chain.svg',
    title: 'Receive tokens',
    description:
      'DI tokens are locked in the smart contract after the purchase, tokens will be released at 2025 Q3-Q4, once v2 will be released.'
  }
]

const ALLOCATION_CATEGORIES = [
  {
    category: 'Presale',
    value: 15
  },
  {
    category: 'Marketing',
    value: 10
  },
  {
    category: 'Tresury',
    value: 15
  },
  {
    category: 'Ecosystem',
    value: 30
  },
  {
    category: 'Liquidity',
    value: 15
  },
  {
    category: 'Airdrop',
    value: 5
  },
  {
    category: 'Team',
    value: 10
  }
]

const presaleTokens = [
  {
    address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/99d7ad96-73fd-44aa-9067-6acde2345f1a.png'
  },
  {
    address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/0xsquid/assets/main/images/chains/binance.svg'
  }
]

const logos = [
  'walletconnect.svg',
  'trade-republic.svg',
  'robinhood.svg',
  'metamask.svg',
  'kucoin.svg',
  'fidelity.svg',
  'degiro.svg',
  'crypto.svg',
  'coinbase.svg',
  'binance.svg',
  'ameritrade.svg'
]

/////////////////////////////////// about /////////////////////////////////////////////////////////
const TOP_CHAINS = [
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/chains/ethereum.webp',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/chains/bitcoin.webp',
  'https://raw.githubusercontent.com/0xsquid/assets/refs/heads/main/images/webp128/chains/solana.webp',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/chains/arbitrum.webp',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/chains/optimism.webp',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/chains/base.svg',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/chains/binance.svg',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/chains/osmosis.webp',
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/chains/polygon.svg'
]

const SWAP_FEATURES = [
  { icon: 'tabler:presentation', content: 'Superior price guaranteed' },
  { icon: 'tabler:presentation-off', content: 'Lowest possible slippage' },
  { icon: 'tabler:clock-check', content: 'Save time & effort' }
]

const NETWORK_FEATURES = [
  {
    icon: 'ri:exchange-funds-fill',
    title: 'Swap',
    users: 'traders',
    content:
      'Swap tokens instantly at the best rates, with the best UX. Liquidity is aggregated from multiple DEX protocols.'
  },
  {
    icon: 'ri:charging-pile-fill',
    title: 'Gasless',
    users: 'traders',
    content: 'Transfer and swap without native gas tokens on multiple chains, but only need DI tokens.'
  },
  {
    icon: 'hugeicons:money-bag-02',
    title: 'Earn',
    users: 'liquidity providers',
    content: 'Transfer and swap without native gas tokens on multiple chains, but only need DI tokens.'
  },
  {
    icon: 'tabler:social',
    title: 'Govern',
    users: 'DI holders',
    content: 'Stake DI tokens to vote on governance proposals and earn rewards from trading fees.'
  }
]

const PARTNERS = [
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/23eac15b93cdba6f0212e83020db3276040dfeee-291x290.png',
    name: 'Osmosis'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/441277c403c0c4ef6e711f7b5c9969ad8e499cea-368x368.png',
    name: 'Sushi'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/711751e74adcfc818c836e5b88c19ec274f6143f-300x300.png',
    name: 'PancakeSwap'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/5c12628ab9e02e20a0725189463ad18e392be994-404x404.png',
    name: 'Hyperliquid'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/0f55900e7f36a862bd564717b3cb46fff0b61fc6-300x300.png',
    name: 'dYdX'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/7aad87cb2c104961ca8c9596d7f3d5c29ee9176a-300x300.png',
    name: 'Kado'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/67df21a0a5d7c8b508506fb3b19e85b4fc944243-305x299.png',
    name: 'Chainflip'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/1f67bee28bed95169df01b371bb0428ee48a85fa-433x433.png',
    name: 'Vertex'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/ad439a28daaa79621b1c025db8ff39348ca1904e-300x300.png',
    name: 'Ondo'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/0ae2be2d54000eebff9bed854d6eca3e7e4483dd-267x300.png',
    name: 'Trustwallet'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/a67d30fc4b9aa4347032c7b2714374ea81db30d5-600x600.png',
    name: 'Exodus'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/bb6fbf5f107824b21f813cdcb9159619ce43a38b-276x276.png',
    name: 'Safe'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/e54d136fc1241b5688fcfbfdd9598466553afdd0-300x300.png',
    name: 'Lido'
  },
  {
    logo: 'https://cdn.sanity.io/images/qbdchj8q/production/1714797c4046651df31d95b2ec3ac4b0344326b5-300x297.png',
    name: 'Blockchain.com'
  }
]

/////////////////////////////////// about /////////////////////////////////////////////////////////\

const SUPPORT_CHAINS = {
  [hardhat.id]: 'Hardhat',
  [mainnet.id]: 'Ethereum',
  [bsc.id]: 'BNB Chain',
  [polygon.id]: 'Polygon PoS',
  [optimism.id]: 'Optimism',
  [arbitrum.id]: 'Arbitrum',
  [avalanche.id]: 'Avalanche',
  [base.id]: 'Base'
}

const CHAIN_LOGOS = {
  [hardhat.id]: '/images/icons/chains/crossfi.png',
  [mainnet.id]: '/images/icons/chains/ethereum.png',
  [bsc.id]: '/images/icons/chains/bsc.png',
  [polygon.id]: '/images/icons/chains/polygon.png',
  [optimism.id]: '/images/icons/chains/optimism.png',
  [arbitrum.id]: '/images/icons/chains/arbitrum.png',
  [avalanche.id]: '/images/icons/chains/avalanche.png',
  [base.id]: '/images/icons/chains/base.png',
  [scroll.id]: '/images/icons/chains/scroll.png',
  [fantom.id]: '/images/icons/chains/fantom.png',
  [linea.id]: '/images/icons/chains/linea.png'
}

const EARN_CHAINS = [mainnet.id, bsc.id, polygon.id, optimism.id, arbitrum.id, avalanche.id, base.id]

const STEPS_GASLESS = [
  {
    icon: 'gasless.svg',
    title: 'Deposit DI for Gas Fees',
    description:
      'Deposit DI or IDI on any supported chain to cover future transaction fees seamlessly. If your gas balance runs low, you can top up at any time to continue using gasless transactions without interruptions.'
  },
  {
    icon: 'evm.svg',
    title: 'Approve Tokens',
    description:
      'Grant approval for your preferred tokens, enabling smooth and gasless transactions without repeated confirmations. If needed, you can modify your token approvals at any time by adding or removing tokens.'
  },
  {
    icon: 'cross-chain.svg',
    title: 'Start Transactions',
    description:
      'You’re all set! It’s time to go. Execute cross-chain transactions effortlessly without worrying about gas fees using our gasless meta-transaction system.'
  }
]

const boostCardData = [
  {
    name: 'Gold Crystal Tier',
    color: '#f92',
    multiplier: 2.5,
    image: '/images/tokens/din-gold.png',
    condition: ['Point: 5,000,000', 'Referral: 100']
  },
  {
    name: 'Ruby Tier',
    color: '#e400ff',
    multiplier: 2,
    image: '/images/tokens/din-ruby.png',
    condition: ['Point: 2,000,000', 'Referral: 50']
  },
  {
    name: 'Emerald Tier',
    color: '#74b11a',
    multiplier: 1.6,
    image: '/images/tokens/din-emerald.png',
    condition: ['Point: 1,000,000', 'Referral: 20']
  },
  {
    name: 'Jade Tier',
    color: '#8bb7da',
    multiplier: 1.25,
    image: '/images/tokens/din-jade.png',
    condition: ['Point: 500,000', 'Referral: 10']
  },
  {
    name: 'Iron Tier',
    color: '#cfd1d2',
    multiplier: 1.1,
    image: '/images/tokens/din-iron.png',
    condition: ['Point: 200,000', 'Referral: 5']
  },
  {
    name: 'Basic Tier',
    multiplier: 1,
    image: '/images/tokens/din-basic.png',
    condition: ['Point: 100,000', 'Referral: --']
  }
]

const EARN_PAGES = [
  {
    icon: 'icon-park-outline:recycling-pool',
    title: 'Liquidity Pools',
    description: 'Explore and instantly add liquidity to high-APY pools the easy way with Zap Technology.',
    button: 'Explore Pools',
    link: '/earn/pools'
  },
  {
    icon: 'iconoir:position',
    title: 'Liquidity Positions',
    description: 'Track, adjust, and optimize your positions to stay in control of your DeFi journey.',
    button: 'My Positions',
    link: '/earn/positions'
  }
]

const EARN_TAGS = [
  {
    tag: '',
    title: 'All Pools'
  },
  {
    tag: 'highlighted_pool',
    title: 'Highlighted Pools',
    icon: {
      name: 'hugeicons:fire-02',
      color: '#ff0090'
    }
  },
  {
    tag: 'high_apr',
    title: 'High APR',
    icon: {
      name: 'hugeicons:rocket-01',
      color: '#00ff90'
    }
  },
  {
    tag: 'solid_earning',
    title: 'Solid Earning',
    icon: {
      name: 'tabler:rollercoaster',
      color: '#0090ff'
    }
  },
  {
    tag: 'low_volatility',
    title: 'Low Volatility',
    icon: {
      name: 'tabler:rosette-discount-check',
      color: '#ccff00'
    }
  }
]

const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
const META_CONTRACT = '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1'
const GAS_CREDIT_VAUT = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'
const IDI_CROSSFI = '0x0ebf472aa078bbfce4f154fdef3abe3d9fa5c5ec'

const PRESALE_START = new Date(1754038800000) // 2025-08-01 + 3600_000 * 9
const PRESALE_END = new Date(1766912400000) // 2025-12-28 + 3600_000 * 9
const AIRDROP_START = new Date(1752656400000) // 2025-07-16 + 3600_000 * 9
const AIRDROP_EXPIRY = new Date(1757926800000) // 2026-01-15 + 3600_000 * 9
const AIRDROP_DISTRIBUTE = new Date(1758531600000) // 2025-09-22
const STAKING_INITIAL_START = new Date(1751360400000) // 2025-07-01
const STAKING_INITIAL_END = new Date(1814432400000) // 2027-07-01
const STAKING_ECOSYSTEM = new Date(1775034000000) // 2026-04-01

const TOKEN_CHAIN = hardhat

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const TOKEN_ADDRESSES = {
  TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  AIRDROP: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  PRESALE: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  STAKING: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
}

const AIRDROP_STAGE = {
  NONE: 0,
  STARTED: 1,
  EXPIRED: 2,
  DISTRIBUTE: 3
}

const STAKING_STAGE = {
  INITIAL: 0,
  ECOSYSTEM: 1
}

const STAKING_DURATION = ['No Lockup', '3 Months', 'Half Year', 'A year']

export {
  roadmaps,
  useCases,
  features,
  logos,
  STEPS_GASLESS,
  presaleTokens,
  BUY_STEPS,
  EARN_PAGES,
  EARN_TAGS,
  EARN_CHAINS,
  ALLOCATION_CATEGORIES,
  SUPPORT_CHAINS,
  boostCardData,
  CHAIN_LOGOS,
  PARTNERS,
  TOP_CHAINS,
  SWAP_FEATURES,
  NETWORK_FEATURES,
  MAX_UINT256,
  META_CONTRACT,
  GAS_CREDIT_VAUT,
  IDI_CROSSFI,
  ZERO_ADDRESS,
  TOKEN_CHAIN,
  TOKEN_ADDRESSES,
  PRESALE_START,
  PRESALE_END,
  AIRDROP_STAGE,
  AIRDROP_START,
  AIRDROP_EXPIRY,
  AIRDROP_DISTRIBUTE,
  STAKING_STAGE,
  STAKING_DURATION,
  STAKING_INITIAL_START,
  STAKING_INITIAL_END,
  STAKING_ECOSYSTEM
}
