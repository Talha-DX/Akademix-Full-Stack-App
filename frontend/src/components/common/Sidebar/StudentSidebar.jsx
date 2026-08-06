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

/**
 * Nav list for the Student portal — flat items plus a few expandable groups.
 * When `collapsed` is true (desktop minimize), items render icon-only;
 * clicking a group with children asks the layout to re-expand first.
 */
export default function StudentSidebar({ active, onNavigate, collapsed = false, onRequestExpand }) {
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
    <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-3 pb-4">
      {studentSidebar.map((item) => {
        const hasChildren = !!item.children?.length
        const isGroupOpen = !collapsed && openGroups.has(item.key)
        const isActiveParent = active === item.key || item.children?.some((c) => c.key === active)

        return (
          <div key={item.key}>
            <button
              title={collapsed ? item.label : undefined}
              onClick={() => {
                if (collapsed && hasChildren) {
                  onRequestExpand?.(item.key)
                  return
                }
                hasChildren ? toggleGroup(item.key) : onNavigate(item.key)
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                collapsed ? 'justify-center' : ''
              } ${
                isActiveParent && !hasChildren
                  ? 'bg-white/15 text-white'
                  : isActiveParent
                    ? 'text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              aria-expanded={hasChildren ? isGroupOpen : undefined}
            >
              <NavIcon name={item.icon} />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && hasChildren && (
                <ChevronDown size={15} className={`text-white/50 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {!collapsed && hasChildren && isGroupOpen && (
              <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-4">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    onClick={() => onNavigate(child.key)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                      active === child.key
                        ? 'bg-white/15 font-medium text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
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