/** data: [{ label, value }] — dependency-free SVG/CSS bar chart.
 * Pass `horizontal` for a left-to-right layout (good for long labels like class names). */
export default function BarChart({ data = [], height = 160, horizontal = false, valueFormatter }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const format = valueFormatter || ((v) => v)

  if (!data.length) {
    return <div className="flex items-center justify-center text-sm text-ink-soft" style={{ height }}>No data yet</div>
  }

  if (horizontal) {
    return (
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs font-medium text-ink-soft" title={d.label}>
              {d.label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-tint">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-semibold text-ink">{format(d.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-ink">{format(d.value)}</span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 4 : 0 }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-xs text-ink-soft">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
