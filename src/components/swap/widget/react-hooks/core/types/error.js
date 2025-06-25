export const TransactionErrorType = {
  REJECTED_BY_USER: 0,
  CALL_EXCEPTION: 1,
  UNKNOWN: 2,
  WARNING: 3
}

export const SquidStatusErrorType = {
  NotFoundError: 'NotFoundError'
}

export class QrCodeGenerationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'QrCodeGenerationError'
  }
}
