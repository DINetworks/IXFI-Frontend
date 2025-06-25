import { useEffect } from 'react'
import { WidgetEvents } from '../../services/'

/**
 * Dispatches a `searchEmpty` event when the search query has no results
 */
export function useTrackSearchEmpty({ searchQuery, resultsLength, context, debounceMs = 500 }) {
  useEffect(() => {
    const isSearchEmpty = resultsLength <= 0 && searchQuery.length >= 3
    if (!isSearchEmpty) return

    const timeout = setTimeout(() => {
      WidgetEvents.getInstance().dispatchSearchEmpty({
        searchQuery,
        context
      })
    }, debounceMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [context, debounceMs, resultsLength, searchQuery])
}
