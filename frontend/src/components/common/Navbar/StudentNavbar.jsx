import { Bell, Menu } from 'lucide-react'

/** Top header bar for the Student portal — menu toggle, page title, notifications, avatar. */
export default function StudentNavbar({ title, onOpenMenu, userName, userMeta }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/70 bg-surface-raised/80 px-4 shadow-sm shadow-brand-900/5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onOpenMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <p className="font-display text-sm font-semibold text-ink sm:text-base">{title}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-ink-soft hover:text-ink" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-coral-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-cyan-400 text-xs font-semibold text-white shadow-sm shadow-brand-500/30">
            {userName?.[0] ?? 'S'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none text-ink">{userName}</p>
            <p className="mt-0.5 text-xs leading-none text-ink-soft">{userMeta}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
