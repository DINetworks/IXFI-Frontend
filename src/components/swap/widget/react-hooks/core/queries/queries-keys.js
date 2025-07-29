export const QueryKeys = {
  All: 'all',
  SquidInfo: 'squidInfo',
  Chains: 'chains',
  Tokens: 'tokens',
  Balances: 'balances',
  Balance: 'balance',
  AllTokensBalance: 'allTokensBalance',
  Transactions: 'transactions',
  Transaction: 'transaction',
  SwapTransactionStatus: 'swapTransactionStatus',
  SendTransactionStatus: 'sendTransactionStatus',
  RouteApproved: 'routeApproved',
  SendTransactionGas: 'sendTransactionGas',
  EnsData: 'ensData',
  EnsSearch: 'ensSearch',
  CoinGeckoPrices: 'coinGeckoPrices',
  CosmosAddress: 'cosmosAddress',
  HistoricalData: 'historicalData',
  TokensData: 'tokensData',
  TokenData: 'tokenData',
  FiatToCryptoQuote: 'fiatToCryptoQuote',
  FiatToCryptoStatus: 'fiatToCryptoStatus',
  FiatToCryptoConfig: 'fiatToCryptoConfig',
  Country: 'country',
  Xrpl: 'xrpl',
  XrplTrustLine: 'xrplTrustLine',
  IsXrplTrustLineApproved: 'isXrplTrustLineApproved',
  XrplAccountActivatedInfo: 'xrplAccountActivatedInfo',
  FiatToCryptoPaymentMethods: 'fiatToCryptoPaymentMethods'
}

export const keys = () => ({
  // ============
  // Base
  // ============
  all: QueryKeys.All,
  squidInfo: () => [QueryKeys.All, QueryKeys.SquidInfo],
  chains: () => [QueryKeys.All, QueryKeys.Chains],
  tokens: () => [QueryKeys.All, QueryKeys.Tokens],
  balances: () => [QueryKeys.All, QueryKeys.Balances],
  transactions: () => [QueryKeys.All, QueryKeys.Transactions],
  xrpl: () => [QueryKeys.All, QueryKeys.Xrpl],
  // ============
  // Tokens
  // ============
  coinGeckoPrices: coingeckoIds => [...keys().tokens(), QueryKeys.CoinGeckoPrices, coingeckoIds?.join(',')],
  // Token Historical Data
  historicalData: (coingeckoId, timeFrame) => [...keys().tokens(), QueryKeys.HistoricalData, coingeckoId, timeFrame],
  tokensData: tokens => [...keys().tokens(), QueryKeys.TokensData, tokens?.map(t => t.coingeckoId).join(',')],
  tokenData: token => [...keys().tokens(), QueryKeys.TokenData, token?.coingeckoId],
  // ============
  // Balances
  // ============
  balance: (chainId, tokenAddress, userAddress) => [
    ...keys().balances(),
    QueryKeys.Balance,
    chainId,
    tokenAddress,
    userAddress
  ],
  allTokensBalance: (address, chainType) => [...keys().balances(), QueryKeys.AllTokensBalance, address, chainType],
  // ============
  // Transactions
  // ============
  transaction: (
    fromChainId,
    toChainId,
    toTokenAddress,
    fromTokenAddress,
    price,
    slippage,
    getGasOnDestination,
    sourceUserAddress,
    degenMode,
    destinationAddress,
    fallbackAddress,
    quoteOnly,
    fromChainType,
    preHook,
    postHook
  ) => [
    ...keys().transactions(),
    QueryKeys.Transaction,
    fromChainId,
    toChainId,
    toTokenAddress,
    fromTokenAddress,
    price,
    slippage,
    getGasOnDestination,
    sourceUserAddress,
    degenMode,
    destinationAddress,
    fallbackAddress,
    quoteOnly,
    fromChainType,
    preHook,
    postHook
  ],
  swapTransactionStatus: transactionId => [...keys().transactions(), QueryKeys.SwapTransactionStatus, transactionId],
  fiatToCryptoStatus: transactionId => [QueryKeys.All, QueryKeys.FiatToCryptoStatus, transactionId],
  sendTransactionStatus: (txHash, chainId) => [
    ...keys().transactions(),
    QueryKeys.SendTransactionStatus,
    txHash,
    chainId
  ],
  allTransactionsStatus: transactions => [
    ...keys().transactions(),
    ...(transactions?.map(getHistoryTransactionId) ?? [])
  ],
  // ============
  // Approval
  // ============
  routeApproved: (routeData, allowanceInWei) => [
    ...keys().transactions(),
    QueryKeys.RouteApproved,
    routeData?.params.fromAddress,
    routeData?.params.fromChain,
    routeData?.params.fromToken,
    routeData?.params.fromAmount,
    allowanceInWei?.toString()
  ],
  sendTransactionGas: (chainId, tokenAddress, from) => [
    QueryKeys.All,
    QueryKeys.SendTransactionGas,
    chainId,
    tokenAddress,
    from
  ],
  // ============
  // ENS
  // ============
  ensData: address => [QueryKeys.EnsData, address],
  ensSearch: query => [QueryKeys.EnsSearch, query],
  // ============
  // Cosmos
  // ============
  cosmosAddress: chainId => [QueryKeys.All, QueryKeys.CosmosAddress, chainId],
  fiatToCryptoQuote: (fiatCurrency, cryptoCurrencyID, amount, region, paymentMethod) => [
    'fiat-to-crypto',
    'quote',
    fiatCurrency,
    cryptoCurrencyID,
    amount,
    region,
    paymentMethod
  ],
  fiatToCryptoConfig: () => ['fiat-to-crypto', 'config'],
  country: () => [QueryKeys.All, QueryKeys.Country],
  fiatToCryptoPaymentMethods: (fiatCurrency, cryptoCurrencyID, region) => [
    'fiat-to-crypto',
    'payment-methods',
    fiatCurrency,
    cryptoCurrencyID,
    region
  ],
  // ============
  // Xrpl
  // ============
  xrplTrustLine: (tokenAddress, chainId, address) => [
    ...keys().xrpl(),
    QueryKeys.XrplTrustLine,
    tokenAddress,
    chainId,
    address
  ],
  isXrplTrustLineApproved: (address, chainId, chainType, tokenAddress, trustLineLimit, amountToApprove) => [
    ...keys().xrpl(),
    QueryKeys.IsXrplTrustLineApproved,
    address,
    chainId,
    chainType,
    tokenAddress,
    trustLineLimit,
    amountToApprove?.toString()
  ],
  xrplAccountActivatedInfo: (destinationAddress, toChainId, toChainType) => [
    ...keys().xrpl(),
    QueryKeys.XrplAccountActivatedInfo,
    destinationAddress,
    toChainId,
    toChainType
  ]
})

export const getPrefixKey = key => {
  switch (key) {
    case QueryKeys.All:
      return [key]

    case QueryKeys.Balance:
    case QueryKeys.AllTokensBalance:
      return [...keys().balances(), key]

    case QueryKeys.Transaction:
    case QueryKeys.SwapTransactionStatus:
    case QueryKeys.FiatToCryptoStatus:
    case QueryKeys.SendTransactionStatus:
    case QueryKeys.Transactions:
    case QueryKeys.RouteApproved:
      return [...keys().transactions(), key]

    case QueryKeys.XrplTrustLine:
      return [...keys().xrpl(), key]

    default:
      return [QueryKeys.All, key]
  }
}
