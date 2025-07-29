import axios from 'axios'

export const getQueryHeaders = (integratorId, requestId) => {
  return {
    ...(integratorId ? { 'X-Integrator-Id': integratorId } : {}),
    ...(requestId ? { 'X-Request-Id': requestId } : {})
  }
}

export const getStatusCode = error => {
  if (axios.isAxiosError(error)) {
    return error.response?.status
  }
  return undefined
}

export const is404Error = error => {
  const statusCode = getStatusCode(error)
  if (statusCode === 404) {
    return true
  }
  return false
}
