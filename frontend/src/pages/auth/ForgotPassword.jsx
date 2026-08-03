import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Input from '../../components/forms/Input'
import { authApi } from '../../api/authApi'
import { useNotificationContext } from '../../context/NotificationContext'
import { getApiErrorMessage } from '../../utils/adminPeople'

export default function ForgotPassword() {
  const { notify } = useNotificationContext()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setResetSent(false)
    try {
      const res = await authApi.forgotPassword({ email })
      setResetSent(true)
      notify('If an account exists, password reset instructions have been sent.', 'success')
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to request password reset.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-700 mb-3">
            <Mail size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Forgot Password?</h1>
          <p className="mt-1 text-sm text-ink-soft">Enter your account email to receive password reset instructions.</p>
        </div>

        {resetSent && (
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-700 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} /> Check your inbox
            </div>
            <p>If an account exists for {email}, instructions have been sent.</p>
            <div className="pt-2">
              <Link to="/reset-password" className="text-xs font-semibold text-brand-700 underline hover:text-brand-800">
                Go to Reset Password screen &rarr;
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@school.com"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Sending instructions…' : 'Send Reset Link'}
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
