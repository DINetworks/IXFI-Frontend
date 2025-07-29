export const XrplNetwork = {
  MAINNET: 0,
  TESTNET: 1
}

/**
 * Transaction statuses as defined in the XRPL documentation.
 * @see https://xrpl.org/docs/references/protocol/transactions/transaction-results#transaction-results
 */
export const XrplTxStatus = {
  SUCCESS: 'tesSUCCESS'
}

export const XamanXrplNetwork = {
  MAINNET: 'MAINNET',
  TESTNET: 'TESTNET',
  DEVNET: 'DEVNET'
}

/**
 * @see https://chainagnostic.org/CAIPs/caip-2
 */
export const XrplCAIP2ChainId = {
  MAINNET: 'xrpl:0',
  TESTNET: 'xrpl:1'
}

export const XRPL_METHOD = {
  SIGN_TRANSACTION: 'xrpl_signTransaction'
}
