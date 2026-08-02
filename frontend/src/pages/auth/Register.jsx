import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import AuthShowcase from '../../components/auth/AuthShowcase'

// Registration is admin-only. Creating an account here creates a brand
// new school, and the admin becomes its sole owner/manager — they add
// students and staff themselves after logging in (Students → Add
// Student, Staff → Add Staff). There is no self-signup for anyone else.
const passwordsMatch = (password, confirmPassword) => password.length > 0 && password === confirmPassword

// The backend's validate() middleware responds to a 400 with
// { message: 'Validation failed', errors: { field: [msg, ...] } }.
// Surfacing the specific field is the only way to actually see why a
// registration was rejected — the generic message alone hides it.
function describeError(requestError) {
  const fieldErrors = requestError.response?.data?.errors
  if (fieldErrors) {
    const [field, messages] = Object.entries(fieldErrors)[0]
    return `${field}: ${messages[0]}`
  }
  return requestError.response?.data?.message ?? 'Unable to create your account. Please check the details and try again.'
}

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!passwordsMatch(form.password, form.confirmPassword)) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const user = await register(form)
      navigate(`/${user.role.toLowerCase()}`, { replace: true })
    } catch (requestError) {
      setError(describeError(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white">
              <GraduationCap size={20} />
            </span>
            Akademix
          </Link>

          <h1 className="mt-8 font-display text-2xl font-bold text-ink">Register your school ✨</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Create your admin account and we&apos;ll set up your school. You can add students and staff, and edit
            everything else, right after you log in.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">Email address</span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5">
                <Mail size={17} className="shrink-0 text-ink-soft" />
                <input
                  aria-label="Email address"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@school.edu"
                  autoComplete="email"
                  className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-0"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">Password</span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5">
                <LockKeyhole size={17} className="shrink-0 text-ink-soft" />
                <input
                  aria-label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-ink-soft transition hover:text-brand-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">Confirm password</span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5">
                <LockKeyhole size={17} className="shrink-0 text-ink-soft" />
                <input
                  aria-label="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-0"
                  required
                />
              </span>
              {form.confirmPassword && !passwordsMatch(form.password, form.confirmPassword) && (
                <span className="mt-1.5 block text-xs text-coral-600">Passwords do not match.</span>
              )}
            </label>

            {error && (
              <p className="flex items-start gap-2 rounded-lg bg-coral-500/10 px-3.5 py-2.5 text-sm text-coral-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create admin account'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-soft/80">
            Registration is for school admins only. Once you&apos;re in, add your students and employees from the
            dashboard — they don&apos;t sign up themselves.
          </p>

          <p className="mt-4 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </section>

      <AuthShowcase mode="signup" />
    </main>
  )
}
