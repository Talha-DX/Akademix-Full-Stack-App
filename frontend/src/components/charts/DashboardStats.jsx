import StatCard from '../cards/StatCard'

/** items: [{ label, value, hint?, icon? }] — the top stat-card row on any dashboard. */
export default function DashboardStats({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  )
}
