/**
 * Dependency-free SVG line chart.
 *
 * Two ways to call it:
 *  - single series (legacy): <LineChart data={[{ label, value }]} />
 *  - multi series: <LineChart series={[{ name, color, data: [{ label, value }] }]} legend />
 */
export default function LineChart({ data, series, width = 640, height = 220, legend = false, valueFormatter }) {
  const resolvedSeries = series?.length ? series : [{ name: 'Value', color: 'var(--brand-500, #5D3FD6)', data: data || [] }]
  const labels = resolvedSeries[0]?.data.map((d) => d.label) || []
  const allValues = resolvedSeries.flatMap((s) => s.data.map((d) => d.value))
  const max = Math.max(1, ...allValues)

  const padding = { top: 16, right: 12, bottom: 28, left: 12 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const step = labels.length > 1 ? innerW / (labels.length - 1) : innerW
  const format = valueFormatter || ((v) => v)

  const pointsFor = (points) =>
    points
      .map((d, i) => `${padding.left + i * step},${padding.top + innerH - (d.value / max) * innerH}`)
      .join(' ')

  const hasData = allValues.some((v) => v > 0)

  return (
    <div>
      {legend && (
        <div className="mb-3 flex flex-wrap items-center gap-4">
          {resolvedSeries.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        {/* horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * t}
            y2={padding.top + innerH * t}
            stroke="var(--line, #E5E1F5)"
            strokeWidth="1"
          />
        ))}

        {!hasData && (
          <text x={width / 2} y={height / 2} textAnchor="middle" className="fill-current text-ink-soft" fontSize="12">
            No data for this period yet
          </text>
        )}

        {hasData &&
          resolvedSeries.map((s) => (
            <g key={s.name}>
              <polyline fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsFor(s.data)} />
              {s.data.map((d, i) => (
                <circle
                  key={d.label}
                  cx={padding.left + i * step}
                  cy={padding.top + innerH - (d.value / max) * innerH}
                  r="3.5"
                  fill={s.color}
                >
                  <title>{`${s.name} — ${d.label}: ${format(d.value)}`}</title>
                </circle>
              ))}
            </g>
          ))}

        {/* x-axis labels */}
        {labels.map((label, i) => (
          <text
            key={label}
            x={padding.left + i * step}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            className="fill-current text-ink-soft"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}
