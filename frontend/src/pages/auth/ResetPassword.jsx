import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react'
import Input from '../../components/forms/Input'
import { authApi } from '../../api/authApi'
import { useNotificationContext } from '../../context/NotificationContext'
import { getApiErrorMessage } from '../../utils/adminPeople'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { notify } = useNotificationContext()
  const [token, setToken] = useState(() => searchParams.get('token') || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      notify('Passwords do not match.', 'error')
      return
    }
    setSubmitting(true)
    try {
      await authApi.resetPassword({ token, newPassword })
      notify('Password reset successfully! You can now log in.', 'success')
      navigate('/login')
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to reset password. Check your token.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-700 mb-3">
            <KeyRound size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Set New Password</h1>
          <p className="mt-1 text-sm text-ink-soft">Enter your reset token and your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            minLength={8}
            placeholder="Paste reset token here"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Resetting password…' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
