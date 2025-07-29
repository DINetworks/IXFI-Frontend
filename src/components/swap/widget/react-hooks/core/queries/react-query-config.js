// Prevent fetching too soon after the first successful request.
export const DEFAULT_STALE_TIME = 8000

export const defaultOptions = {
  queries: {
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false
  }
}
