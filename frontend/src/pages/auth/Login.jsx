import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import AuthShowcase from '../../components/auth/AuthShowcase'

// The three portals the backend actually knows about (Prisma `Role` enum).
// Selecting one is sent to POST /auth/login and cross-checked server-side —
// picking the wrong tab for an account gets a clear rejection, not a silent
// login into the wrong dashboard.
const ROLES = [
  { value: 'ADMIN', label: 'Admin', icon: ShieldCheck },
  { value: 'TEACHER', label: 'Teacher', icon: Users },
  { value: 'STUDENT', label: 'Student', icon: GraduationCap },
]

// See Register.jsx — surfaces which field the backend rejected instead
// of a generic "Validation failed".
function describeError(requestError) {
  const fieldErrors = requestError.response?.data?.errors
  if (fieldErrors) {
    const [field, messages] = Object.entries(fieldErrors)[0]
    return `${field}: ${messages[0]}`
  }
  return requestError.response?.data?.message ?? 'Unable to sign in. Please try again.'
}

export default function Login() {
  const [role, setRole] = useState('ADMIN')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login({ email, password, role }, remember)
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

          <h1 className="mt-8 font-display text-2xl font-bold text-ink">Welcome back 👋</h1>
          <p className="mt-2 text-sm text-ink-soft">Please choose your role and enter your credentials to continue.</p>

          <fieldset className="mt-6">
            <legend className="mb-2.5 text-xs font-medium text-ink-soft">You're signing in as</legend>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map(({ value, label, icon: Icon }) => {
                const active = role === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                      active
                        ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                        : 'border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full ${
                        active ? 'bg-white/20' : 'bg-brand-50 text-brand-500'
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">Email address</span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5 focus-within:border-brand-400">
                <Mail size={17} className="shrink-0 text-ink-soft" />
                <input
                  aria-label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@school.edu"
                  className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-0"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">Password</span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5 focus-within:border-brand-400">
                <LockKeyhole size={17} className="shrink-0 text-ink-soft" />
                <input
                  aria-label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={remember}
                onClick={() => setRemember((prev) => !prev)}
                className="inline-flex items-center gap-2.5 text-ink-soft"
              >
                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${remember ? 'bg-brand-500' : 'bg-line'}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                      remember ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </span>
                Remember me
              </button>
              <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-lg bg-coral-500/10 px-3.5 py-2.5 text-sm text-coral-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign up
            </Link>
          </p>
        </div>
      </section>

      <AuthShowcase mode="login" />
    </main>
  )
}
