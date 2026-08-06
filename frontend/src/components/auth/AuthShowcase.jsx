import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Lock, Server, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'

const copy = {
  login: {
    kicker: 'Continue your journey',
    title: 'Continue managing your school',
    body: "Pick up right where you left off — sign in to the fast, easy, and free school management platform.",
    cta: { to: '/register', label: 'Sign up' },
  },
  signup: {
    kicker: 'Create your account',
    title: 'Start managing smarter',
    body: 'Set up your school workspace and bring your whole learning community together, in minutes.',
    cta: { to: '/login', label: 'Log in' },
  },
}

const highlights = [
  [GraduationCap, '125,000+ schools', 'already run on Akademix'],
  [ShieldCheck, 'Secure by default', 'Role-based access for every account'],
  [BookOpen, 'Free forever', 'No credit card, no hidden limits'],
]

export default function AuthShowcase({ mode = 'login' }) {
  const { kicker, title, body, cta } = copy[mode === 'signup' ? 'signup' : 'login']

  return (
    // <aside className="relative hidden overflow-hidden bg-gradient-to-b from-[#221660] via-[#1c1240] to-[#120b2c] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-center">
    <aside className="relative hidden overflow-hidden bg-gradient-to-b from-[#221660] via-[#1c1240] to-[#120b2c] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-center">
      <div className="animated-orb pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="animated-orb pointer-events-none absolute bottom-[-15%] left-[-10%] h-64 w-64 rounded-full bg-coral-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[length:22px_22px] opacity-[0.15]" />

      <Link
        to={cta.to}
        className="absolute right-10 top-10 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25"
      >
        <UserPlus size={14} /> {cta.label}
      </Link>

      <div className="relative">
        <span className="eyebrow border-white/20 bg-white/10 text-white">
          <Sparkles size={14} /> {kicker}
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight">{title}</h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{body}</p>

        <div className="relative mt-10 grid h-48 place-items-center">
          <div className="absolute h-40 w-40 rotate-6 rounded-3xl bg-white/10" />
          <div className="relative grid h-24 w-24 place-items-center rounded-2xl bg-white/15 shadow-card backdrop-blur">
            <GraduationCap size={44} className="text-white" />
          </div>
          <span className="absolute left-2 top-2 grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-[#1c1240] shadow-card">
            <ShieldCheck size={20} className="text-brand-300" />
          </span>
          <span className="absolute bottom-1 right-2 grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-[#1c1240] shadow-card">
            <Lock size={18} className="text-coral-400" />
          </span>
          <span className="absolute bottom-6 left-0 grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-[#1c1240] shadow-card">
            <Server size={16} className="text-white/80" />
          </span>
        </div>

        <div className="mt-8 grid gap-4">
          {highlights.map(([Icon, heading, sub]) => (
            <div key={heading} className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/15">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold">{heading}</p>
                <p className="text-xs text-white/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
