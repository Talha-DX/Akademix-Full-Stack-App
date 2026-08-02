export default function TableRow({ row, columns = [] }) {
  return (
    <tr>
      {columns.map((col) => (
        <td key={col.key} className="px-5 py-3.5 text-sm text-ink-soft">
          {col.render ? col.render(row) : row[col.key]}
        </td>
      ))}
    </tr>
  )
}
