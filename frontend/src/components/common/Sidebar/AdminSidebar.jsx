import { useState } from 'react'
import {
  ChevronDown, Lock, LayoutDashboard, Settings, LayoutGrid, BookOpen,
  GraduationCap, Briefcase, Landmark, Wallet, Banknote, CalendarCheck,
  CalendarDays, BookMarked, Sparkles, ShoppingCart, MessageCircle,
  MessagesSquare, MessageSquareText, Video, FileText, ClipboardList,
  ClipboardCheck, BarChart3, Award,
} from 'lucide-react'
import { adminSidebar } from '../../../data/mockData'

const ICONS = {
  LayoutDashboard, Settings, LayoutGrid, BookOpen, GraduationCap, Briefcase,
  Landmark, Wallet, Banknote, CalendarCheck, CalendarDays, BookMarked,
  Sparkles, ShoppingCart, MessageCircle, MessagesSquare, MessageSquareText,
  Video, FileText, ClipboardList, ClipboardCheck, BarChart3, Award,
}

function NavIcon({ name }) {
  const Icon = ICONS[name]
  return Icon ? <Icon size={17} className="shrink-0" /> : null
}

/** Full nested module list (22 modules + submodules), used by AdminLayout. */
export default function AdminSidebar({ active, onNavigate }) {
  const [openGroups, setOpenGroups] = useState(() =>
    new Set(adminSidebar.filter((n) => n.children?.some((c) => c.key === active)).map((n) => n.key))
  )

  const toggleGroup = (key) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
      {adminSidebar.map((item) => {
        const hasChildren = !!item.children?.length
        const isGroupOpen = openGroups.has(item.key)
        const isActiveParent = active === item.key || item.children?.some((c) => c.key === active)

        return (
          <div key={item.key}>
            <button
              onClick={() => {
                if (item.locked) return
                hasChildren ? toggleGroup(item.key) : onNavigate(item.key)
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isActiveParent && !hasChildren
                  ? 'bg-brand-50 text-brand-700'
                  : isActiveParent
                    ? 'text-ink'
                    : 'text-ink-soft hover:bg-surface-tint hover:text-ink'
              } ${item.locked ? 'cursor-not-allowed opacity-60' : ''}`}
              aria-expanded={hasChildren ? isGroupOpen : undefined}
            >
              <NavIcon name={item.icon} />
              <span className="flex-1">{item.label}</span>
              {item.locked && <Lock size={13} className="text-ink-soft" />}
              {hasChildren && (
                <ChevronDown size={15} className={`text-ink-soft transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {hasChildren && isGroupOpen && (
              <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-line pl-4">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    onClick={() => onNavigate(child.key)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                      active === child.key
                        ? 'bg-brand-50 font-medium text-brand-700'
                        : 'text-ink-soft hover:bg-surface-tint hover:text-ink'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
