/** data: [{ label, value }] — dependency-free SVG bar chart. */
export default function BarChart({ data = [], height = 160 }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-brand-400"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-xs text-ink-soft">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
