import { mainnet, bsc, arbitrum, avalanche, optimism, base, polygon } from 'viem/chains'

const roadmaps = [
  {
    icon: 'mvp.svg',
    period: '2025 Q1',
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
      'IXN Token & Presale'
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
  [bsc.id]: 'BNB Smart Chain',
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

export { roadmaps, useCases, features, logos, supportedChains, chainLogos }
