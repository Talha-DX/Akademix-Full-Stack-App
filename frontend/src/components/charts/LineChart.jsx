/** data: [{ label, value }] — dependency-free SVG line chart. */
export default function LineChart({ data = [], width = 480, height = 160 }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const step = data.length > 1 ? width / (data.length - 1) : width
  const points = data.map((d, i) => `${i * step},${height - (d.value / max) * height}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <polyline fill="none" stroke="var(--brand-500, #5D3FD6)" strokeWidth="2" points={points} />
      {data.map((d, i) => (
        <circle key={d.label} cx={i * step} cy={height - (d.value / max) * height} r="3" fill="var(--brand-600, #4c2fc2)" />
      ))}
    </svg>
  )
}
