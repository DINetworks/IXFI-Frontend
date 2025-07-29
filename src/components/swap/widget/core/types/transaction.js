export const SwapState = {
  CONFIRM: 0,

  // transaction is ongoing
  PROGRESS: 1,

  // transaction is successful
  COMPLETED: 2,

  // transaction failed
  ERROR: 3,

  // transaction failed halfway and user received fallback tokens
  PARTIAL_SUCCESS: 4,

  // user hasn't signed the transaction in their wallet after some time
  CONFIRMATION_TOO_LONG: 5,

  // user rejected the transaction in their wallet
  CONFIRMATION_REJECTED: 6,

  // user needs to add gas to the transaction to complete its execution
  NEEDS_GAS: 7
}
