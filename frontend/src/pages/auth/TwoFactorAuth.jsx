import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Input from '../../components/forms/Input'
import { useNotificationContext } from '../../context/NotificationContext'

export default function TwoFactorAuth() {
  const { notify } = useNotificationContext()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    notify('Two-factor authentication has not been configured for this account.', 'error')
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-700 mb-3">
            <ShieldCheck size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Two-Factor Authentication</h1>
          <p className="mt-1 text-sm text-ink-soft">Two-factor authentication requires server-side TOTP enrollment before it can be used.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            placeholder="123456"
            className="text-center letter-spacing-2 font-mono text-lg"
          />
          <button
            type="submit"
            disabled={submitting || code.length < 6}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Checking…' : 'Not configured'}
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
