import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/** items: [{ label, href? }] — last item renders as plain text (current page). */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-ink-soft" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-ink-soft/60" />}
          {item.href && i < items.length - 1 ? (
            <Link to={item.href} className="hover:text-ink">{item.label}</Link>
          ) : (
            <span className="font-medium text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
