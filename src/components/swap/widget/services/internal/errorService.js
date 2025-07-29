import { GENERIC_ERROR_MESSAGE } from '../../core/constants'

// --------------------
// SQUID ROUTE ERRORS
// --------------------
const squidRouteErrorMapping = {
  Unknown: GENERIC_ERROR_MESSAGE,
  UnknownError: GENERIC_ERROR_MESSAGE,
  SquidServiceError: GENERIC_ERROR_MESSAGE,
  BAD_REQUEST: GENERIC_ERROR_MESSAGE
}

/**
 * Check if the error is an Squid route error
 * Because Typescript supports casting but that's only for compilation time,
 * We need it at runtime since we're getting the error object from the wallet
 * @param error
 * @returns boolean
 */
export const isSwapRouteError = error => {
  try {
    const castedError = error
    return (
      castedError &&
      (typeof castedError.message === 'string' ||
        typeof castedError.type === 'string' ||
        typeof castedError.statusCode === 'number')
    )
  } catch (error) {
    return false
  }
}

export const isStatusError = error => {
  return error && typeof error.errorType === 'string'
}

/**
 * Tries to parse as SquidRouteError Type & Return the error from Record entries
 * @param error
 * @returns string error message
 */
export const getSquidRouteErrorMessage = error => {
  if (isSwapRouteError(error)) {
    // Try to get the error message from backend
    if (error.message) return error.message
    // Try to get the error message from the error type
    const routeError = error.type ? squidRouteErrorMapping[error.type] : undefined
    if (routeError) return routeError
  }

  return squidRouteErrorMapping.Unknown
}
