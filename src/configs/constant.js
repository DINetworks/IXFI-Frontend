import { mainnet, bsc, arbitrum, avalanche, optimism, base, polygon } from 'viem/chains'

const roadmaps = [
  {
    icon: 'mvp.svg',
    period: '2025 Q1',
    active: true,
    title: 'MVP Development',
    items: ['Develop Gas Abstraction Layer', 'Develop Relayer Node System', 'Develop IXFI Token & GMP']
  },
  {
    icon: 'development.svg',
    period: '2025 Q2',
    title: 'Development & Test',
    items: [
      'Improve & Update MVP Version',
      'Develop Cross Chain Aggregator',
      'Develop Cross Chain Bridge',
      'IXN Token & Community, Marketing'
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
  },
  {
    title: 'Cross-Chain Messaging',
    description:
      'Cross-chain messaging enables seamless communication between different blockchain networks, allowing smart contracts and applications to share data, execute transactions, and interact beyond a single chain’s limitations.',
    image: 'tab1.webp'
  }
]

const features = [
  {
    icon: 'gasless.svg',
    title: 'Gas-Less Transactions For Multiple Chains',
    description:
      'Gas fees are a significant barrier to seamless blockchain interactions, often requiring users to hold native tokens for each network they interact with. The IXFI Protocol introduces a gas-less transaction system, enabling frictionless cross-chain interactions without requiring users to manage gas tokens for multiple chains.'
  },
  {
    icon: 'evm.svg',
    title: 'Supports All EVM Networks',
    description:
      'The IXFI Protocol is designed to operate seamlessly across all EVM-compatible blockchains, ensuring maximum interoperability and accessibility for users. By supporting a wide range of networks, IXFI enables truly borderless transactions, liquidity aggregation, and smart contract interactions across multiple ecosystems.'
  },
  {
    icon: 'cross-chain.svg',
    title: 'The foundation for cross-chain DApps',
    description:
      'The IXFI Protocol is more than just a cross-chain swap solution—it serves as the core infrastructure for the next wave of DApps. By enabling seamless interoperability, gas-less transactions, and liquidity aggregation across multiple chains, IXFI empowers developers and users to unlock the full potential of blockchain technology.'
  }
]

const teamMembers = [
  {
    name: 'Yew Hoong Poon',
    role: 'Co-founder, Product Owner',
    position: 'Protocol Architect',
    photo: '/images/team/wayne.jpg',
    socials: { in: 'wayne-poon1', x: 'wayne_poon3' }
  },
  {
    name: 'Cha Sui Soon',
    role: 'Co-founder',
    position: 'Tech Lead, Backend, DevOps',
    photo: '/images/team/sui.jpg',
    socials: { in: 'bertrandchua', x: 'sui_soon918' }
  },
  {
    name: 'Yew Hoong Poon',
    role: 'Co-founder',
    position: 'Frontend, Web3',
    photo: '/images/team/Ilyasa.jpg',
    socials: { in: 'ilyasasazali' }
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

const supportedChains = {
  4157: 'CrossFi',
  [mainnet.id]: 'Ethereum',
  [bsc.id]: 'BNB SC',
  [polygon.id]: 'Polygon PoS',
  [optimism.id]: 'Optimism',
  [arbitrum.id]: 'Arbitrum',
  [avalanche.id]: 'Avalanche',
  [base.id]: 'Base'
}

const chainLogos = {
  4157: 'crossfi',
  [mainnet.id]: 'ethereum',
  [bsc.id]: 'bsc',
  [polygon.id]: 'polygon',
  [optimism.id]: 'optimism',
  [arbitrum.id]: 'arbitrum',
  [avalanche.id]: 'avalanche',
  [base.id]: 'base'
}

const stepsForGasless = [
  {
    icon: 'gasless.svg',
    title: 'Deposit XFI for Gas Fees',
    description:
      'Deposit XFI or IXFI on any supported chain to cover future transaction fees seamlessly. If your gas balance runs low, you can top up at any time to continue using gasless transactions without interruptions.'
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

const CROSSFI_CHAINID = 4157
const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
const GATEWAY_CROSSFI = '0x24acE36D6565Fc3A27e2Bb9F2f0Fa164d3F2adf6'
const GASRELAYER_CROSSFI = '0xFC4C231D2293180a30eCd10Ce9A84bDBF27B3967'
const IXFI_CROSSFI = '0x0ebf472aa078bbfce4f154fdef3abe3d9fa5c5ec'

export {
  roadmaps,
  useCases,
  features,
  logos,
  stepsForGasless,
  teamMembers,
  supportedChains,
  chainLogos,
  CROSSFI_CHAINID,
  MAX_UINT256,
  GATEWAY_CROSSFI,
  GASRELAYER_CROSSFI,
  IXFI_CROSSFI
}
