import { useCallback, useState } from 'react'
import useDebounce from './useDebounce'

/**
 * Pagination + search + filter state for server-side tables.
 * Changing search or a filter always jumps back to page 1.
 */
export default function useTableQuery({ pageSize = 10, filters = {} } = {}) {
  const [page, setPage] = useState(1)
  const [search, setSearchValue] = useState('')
  const [filterState, setFilterState] = useState(filters)
  const debouncedSearch = useDebounce(search.trim())

  const setSearch = useCallback((value) => {
    setSearchValue(value)
    setPage(1)
  }, [])

  const setFilter = useCallback((key, value) => {
    setFilterState((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  return {
    page,
    setPage,
    limit: pageSize,
    search,
    setSearch,
    searchTerm: debouncedSearch || undefined,
    filters: filterState,
    setFilter,
  }
}
