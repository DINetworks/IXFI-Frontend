export const TransactionType = {
  BRIDGE: 'BRIDGE',
  BRIDGE_CALL: 'BRIDGE_CALL',
  CALL_BRIDGE: 'CALL_BRIDGE',
  CALL_BRIDGE_CALL: 'CALL_BRIDGE_CALL'
}

export const AxelarStatusResponseType = {
  GAS_PAID_NOT_ENOUGH_GAS: 'gas_paid_not_enough_gas',
  DESTINATION_EXECUTED: 'destination_executed',
  EXPRESS_EXECUTED: 'express_executed',
  CROSS_MULTICALL_EXECUTED: 'CrossMulticallExecuted',
  CROSS_MULTICALL_FAILED: 'CrossMulticallFailed',
  SRC_GATEWAY_CALLED: 'source_gateway_called',
  DEST_GATEWAY_APPROVED: 'destination_gateway_approved',
  DESTINATION_EXECUTE_ERROR: 'destination_execute_error',
  DESTINATION_EXECUTING: 'executing',
  UNKNOWN_ERROR: 'unknown_error',
  CANNOT_FETCH_STATUS: 'cannot_fetch_status',
  ERROR: 'error'
}

export const TransactionStatus = {
  // Submitted transaction, returned by squid axelar
  SUCCESS: 'success',
  NEEDS_GAS: 'needs_gas',
  ONGOING: 'ongoing',
  PARTIAL_SUCCESS: 'partial_success',
  NOT_FOUND: 'not_found',
  // Unsubmitted Transaction, can be status from wallet
  INITIAL_LOADING: 'initialLoading',
  GENERATING_DEPOSIT: 'generating_deposit',
  ERROR: 'error',
  WARNING: 'warning',
  PENDING: 'pending',
  REJECTED: 'rejected',
  // Coral refund
  REFUNDED: 'refunded'
}

export const SendTransactionStatus = {
  ONGOING: 0,
  SUCCESS: 1,
  ERROR: 2,
  0: 'ONGOING',
  1: 'SUCCESS',
  2: 'ERROR'
}
