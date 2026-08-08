import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import ProfileMenu from '../ProfileMenu'

/** Top header bar for the Teacher portal — menu toggle, sidebar collapse, page title, account menu. */
export default function TeacherNavbar({ title, onOpenMenu, onToggleCollapse, collapsed, userName, userMeta, onNavigate }) {
  return (
    <header className="relative z-50 flex h-16 items-center justify-between border-b border-white/70 bg-surface-raised/80 px-4 shadow-sm shadow-brand-900/5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onOpenMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <button
          className="hidden text-ink-soft transition hover:text-ink lg:block"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <p className="font-display text-sm font-semibold text-ink sm:text-base">{title}</p>
      </div>

      <div className="flex items-center gap-4 z-50">
        <ProfileMenu userName={userName} userMeta={userMeta} onNavigate={onNavigate} initialLetter="T" />
      </div>
    </header>
  )
}
