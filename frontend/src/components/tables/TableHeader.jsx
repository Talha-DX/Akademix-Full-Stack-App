export default function TableHeader({ columns = [] }) {
  return (
    <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
      <tr>
        {columns.map((col) => (
          <th key={col.key} className="px-5 py-3">{col.label}</th>
        ))}
      </tr>
    </thead>
  )
}
