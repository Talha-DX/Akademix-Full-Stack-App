import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, LogOut, X } from 'lucide-react'
import AdminSidebar from '../Sidebar/AdminSidebar'
import AdminNavbar from '../Navbar/AdminNavbar'
import { adminSidebar } from '../../../data/mockData'
import { flattenNav } from '../../../data/mockData'

/** Page frame for every admin portal screen: sidebar + top bar + content. */
export default function AdminLayout({ active, onNavigate, userName, userMeta, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (key) => {
    onNavigate(key)
    setMobileOpen(false)
  }

  const title = flattenNav(adminSidebar).find((n) => n.key === active)?.label ?? 'Overview'

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-white/70 bg-surface-raised/90 shadow-xl shadow-brand-900/5 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
            <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white">
                <GraduationCap size={16} />
              </span>
              Akademix
            </Link>
            <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <p className="px-6 pt-4 text-xs font-mono uppercase tracking-[0.14em] text-ink-soft">Admin portal</p>

          <AdminSidebar active={active} onNavigate={handleNavigate} />

          <div className="shrink-0 border-t border-line p-4">
            <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">
              <LogOut size={16} />
              Back to site
            </Link>
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <AdminNavbar
            title={title}
            onOpenMenu={() => setMobileOpen(true)}
            userName={userName}
            userMeta={userMeta}
          />
          <main className="page-content flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
