import { useMemo, useState } from 'react'
import { PAGE_SIZE } from '../utils/constants'

/**
 * Client-side pagination + sort for components/tables/DataTable.jsx.
 * Swap for server-side paging once the list endpoints are live.
 */
export function useTable(rows = [], pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const paginated = useMemo(
    () => rows.slice((page - 1) * pageSize, page * pageSize),
    [rows, page, pageSize]
  )

  return { page, setPage, pageCount, paginated }
}
