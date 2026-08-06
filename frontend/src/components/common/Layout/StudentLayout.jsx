import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, LogOut, X } from 'lucide-react'
import StudentSidebar from '../Sidebar/StudentSidebar'
import StudentNavbar from '../Navbar/StudentNavbar'
import { studentSidebar, flattenNav } from '../../../data/mockData'


/** Page frame for every student portal screen: sidebar + top bar + content. */
export default function StudentLayout({ active, onNavigate, userName, userMeta, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleNavigate = (key) => {
    onNavigate(key)
    setMobileOpen(false)
  }

  const handleRequestExpand = () => setCollapsed(false)

  const title = flattenNav(studentSidebar).find((n) => n.key === active)?.label ?? 'Overview'

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-[#221660] via-[#1c1240] to-[#120b2c] text-white shadow-xl shadow-brand-900/20 transition-[transform,width] duration-200 lg:static lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } ${collapsed ? 'w-72 lg:w-20' : 'w-72'}`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
            <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold text-white">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
                <GraduationCap size={16} />
              </span>
              {!collapsed && <span className="hidden lg:inline">Akademix</span>}
              <span className="lg:hidden">Akademix</span>
            </Link>
            <button className="text-white/70 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          {!collapsed && <p className="hidden px-6 pt-4 text-xs font-mono uppercase tracking-[0.14em] text-white/50 lg:block">Student portal</p>}
          <p className="px-6 pt-4 text-xs font-mono uppercase tracking-[0.14em] text-white/50 lg:hidden">Student portal</p>

          <StudentSidebar active={active} onNavigate={handleNavigate} collapsed={collapsed} onRequestExpand={handleRequestExpand} />

          <div className="shrink-0 border-t border-white/10 p-4">
            <Link
              to="/"
              title="Back to site"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white ${collapsed ? 'lg:justify-center' : ''}`}
            >
              <LogOut size={16} className="shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>Back to site</span>
            </Link>
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <StudentNavbar
            title={title}
            onOpenMenu={() => setMobileOpen(true)}
            onToggleCollapse={() => setCollapsed((v) => !v)}
            collapsed={collapsed}
            userName={userName}
            userMeta={userMeta}
            onNavigate={handleNavigate}
          />
          <main className="page-content flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}