import { useNotificationContext } from '../../context/NotificationContext'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

const ICONS = { success: CheckCircle2, error: TriangleAlert, info: Info }

/** Mount once near the root; reads from NotificationContext. */
export default function Toast() {
  const { notifications, dismiss } = useNotificationContext()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => {
        const Icon = ICONS[n.type] ?? Info
        return (
          <div key={n.id} className="card flex items-center gap-2 px-4 py-3 text-sm shadow-soft">
            <Icon size={16} className="text-brand-600" />
            <span className="text-ink">{n.message}</span>
            <button onClick={() => dismiss(n.id)} className="ml-2 text-ink-soft hover:text-ink" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
