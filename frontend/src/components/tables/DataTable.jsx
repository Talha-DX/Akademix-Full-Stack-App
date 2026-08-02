import TableHeader from './TableHeader'
import TableRow from './TableRow'
import Pagination from '../common/Pagination'
import { useTable } from '../../hooks/useTable'

/**
 * Generic table used across every List page.
 * columns: [{ key, label, render?(row) }]
 */
export default function DataTable({ columns = [], rows = [], emptyLabel = 'No records yet' }) {
  const { page, setPage, pageCount, paginated } = useTable(rows)

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <TableHeader columns={columns} />
        <tbody className="divide-y divide-line">
          {paginated.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-ink-soft">
                {emptyLabel}
              </td>
            </tr>
          )}
          {paginated.map((row, i) => (
            <TableRow key={row.id ?? i} row={row} columns={columns} />
          ))}
        </tbody>
      </table>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
