import { useState } from 'react'
import {
  ChevronDown, LayoutDashboard, Settings, GraduationCap, CalendarCheck,
  CalendarDays, BookMarked, ClipboardList, Wallet, Award,
} from 'lucide-react'
import { studentSidebar } from '../../../data/mockData'

const ICONS = {
  LayoutDashboard, Settings, GraduationCap, CalendarCheck, CalendarDays,
  BookMarked, ClipboardList, Wallet, Award,
}

function NavIcon({ name }) {
  const Icon = ICONS[name]
  return Icon ? <Icon size={17} className="shrink-0" /> : null
}

/** Nav list for the Student portal — flat items plus a few expandable groups. */
export default function StudentSidebar({ active, onNavigate }) {
  const [openGroups, setOpenGroups] = useState(() =>
    new Set(studentSidebar.filter((n) => n.children?.some((c) => c.key === active)).map((n) => n.key))
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
      {studentSidebar.map((item) => {
        const hasChildren = !!item.children?.length
        const isGroupOpen = openGroups.has(item.key)
        const isActiveParent = active === item.key || item.children?.some((c) => c.key === active)

        return (
          <div key={item.key}>
            <button
              onClick={() => (hasChildren ? toggleGroup(item.key) : onNavigate(item.key))}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isActiveParent && !hasChildren
                  ? 'bg-brand-50 text-brand-700'
                  : isActiveParent
                    ? 'text-ink'
                    : 'text-ink-soft hover:bg-surface-tint hover:text-ink'
              }`}
              aria-expanded={hasChildren ? isGroupOpen : undefined}
            >
              <NavIcon name={item.icon} />
              <span className="flex-1">{item.label}</span>
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
