import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'
import { useNotificationContext } from '../../context/NotificationContext'
import { getApiErrorMessage } from '../../utils/adminPeople'

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

/**
 * "Account Setting" page reached from the profile dropdown on every portal.
 * Wired to the real POST /auth/change-password endpoint (authApi.changePassword) —
 * on success it signs the user out so they log back in with the new password.
 */
export default function AccountSettings() {
  const { user, logout } = useAuth()
  const { notify } = useNotificationContext()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const update = (field) => (e) => setForm((v) => ({ ...v, [field]: e.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    if (form.newPassword.length < 6) {
      notify('New password must be at least 6 characters.', 'error')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      notify('New password and confirmation do not match.', 'error')
      return
    }
    setSaving(true)
    try {
      await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      notify('Password updated. Please log in again.', 'success')
      setForm(EMPTY_FORM)
      await logout()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Could not update your password.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-50 p-2.5 text-brand-700">
            <KeyRound size={18} />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">Account Setting</h1>
            <p className="mt-0.5 text-sm text-ink-soft">Signed in as {user?.email}</p>
          </div>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <label className="text-sm text-ink">
            Current password
            <input
              required
              type="password"
              minLength={6}
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={update('currentPassword')}
              className="mt-1 w-full rounded-lg border border-line p-2"
            />
          </label>
          <label className="text-sm text-ink">
            New password
            <input
              required
              type="password"
              minLength={6}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={update('newPassword')}
              className="mt-1 w-full rounded-lg border border-line p-2"
            />
          </label>
          <label className="text-sm text-ink">
            Confirm new password
            <input
              required
              type="password"
              minLength={6}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              className="mt-1 w-full rounded-lg border border-line p-2"
            />
          </label>
          <button disabled={saving} className="w-fit rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
