import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

/**
 * Top-right account menu shared by Admin/Teacher/Student navbars.
 * - "Account Setting" and "Profile" call the real `onNavigate` handler each
 *   dashboard already uses for in-app section routing (updates the URL too).
 * - "Logout" calls the real AuthContext.logout() (hits POST /auth/logout,
 *   clears the stored token) and redirects to /login — not a fake link.
 */
export default function ProfileMenu({
  userName,
  userMeta,
  onNavigate,
  profileKey = 'profile',
  settingsKey = 'account-settings',
  initialLetter = '?',
}) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const go = (key) => {
    setOpen(false)
    onNavigate?.(key)
  }

  const handleLogout = async () => {
    setOpen(false)
    setLoggingOut(true)
    try {
      await logout()
    } finally {
      setLoggingOut(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 transition hover:bg-surface-tint sm:pr-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-cyan-400 text-xs font-semibold text-white shadow-sm shadow-brand-500/30">
          {userName?.[0]?.toUpperCase() ?? initialLetter}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-none text-ink">{userName}</p>
          <p className="mt-0.5 text-xs leading-none text-ink-soft">{userMeta}</p>
        </div>
        <ChevronDown size={14} className={`hidden shrink-0 text-ink-soft transition-transform sm:block ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-surface-raised py-1.5 shadow-lg shadow-brand-900/10"
        >
          <div className="border-b border-line px-3.5 py-2.5 sm:hidden">
            <p className="text-sm font-medium text-ink">{userName}</p>
            <p className="text-xs text-ink-soft">{userMeta}</p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => go(settingsKey)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink-soft transition hover:bg-surface-tint hover:text-ink"
          >
            <Settings size={15} className="shrink-0" />
            Account Setting
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => go(profileKey)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink-soft transition hover:bg-surface-tint hover:text-ink"
          >
            <User size={15} className="shrink-0" />
            Profile
          </button>

          <div className="my-1 border-t border-line" />

          <button
            type="button"
            role="menuitem"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-coral-600 transition hover:bg-coral-500/10 disabled:opacity-60"
          >
            <LogOut size={15} className="shrink-0" />
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  )
}
