/** data: [{ label, value, color }] — dependency-free SVG pie chart. */
export default function PieChart({ data = [], size = 160 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const radius = size / 2
  let cumulative = 0

  const slices = data.map((d) => {
    const start = (cumulative / total) * 2 * Math.PI
    cumulative += d.value
    const end = (cumulative / total) * 2 * Math.PI
    const x1 = radius + radius * Math.sin(start)
    const y1 = radius - radius * Math.cos(start)
    const x2 = radius + radius * Math.sin(end)
    const y2 = radius - radius * Math.cos(end)
    const largeArc = end - start > Math.PI ? 1 : 0
    return {
      path: `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`,
      color: d.color ?? '#5D3FD6',
      label: d.label,
    }
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {slices.map((s) => (
        <path key={s.label} d={s.path} fill={s.color} />
      ))}
    </svg>
  )
}
