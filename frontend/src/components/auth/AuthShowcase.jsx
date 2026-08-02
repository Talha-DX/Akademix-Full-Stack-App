import { BookOpen, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'

const copy = {
  login: {
    kicker: 'Continue your journey',
    title: 'Continue managing your school',
    body: "Pick up right where you left off — sign in to the fast, easy, and free school management platform.",
  },
  signup: {
    kicker: 'Create your account',
    title: 'Start managing smarter',
    body: 'Set up your school workspace and bring your whole learning community together, in minutes.',
  },
}

const highlights = [
  [GraduationCap, '125,000+ schools', 'already run on Akademix'],
  [ShieldCheck, 'Secure by default', 'Role-based access for every account'],
  [BookOpen, 'Free forever', 'No credit card, no hidden limits'],
]

export default function AuthShowcase({ mode = 'login' }) {
  const { kicker, title, body } = copy[mode === 'signup' ? 'signup' : 'login']

  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-b from-[#221660] via-[#1c1240] to-[#120b2c] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-center">
      <div className="animated-orb pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="animated-orb pointer-events-none absolute bottom-[-15%] left-[-10%] h-64 w-64 rounded-full bg-coral-500/20 blur-3xl" />

      <div className="relative">
        <span className="eyebrow border-white/20 bg-white/10 text-white">
          <Sparkles size={14} /> {kicker}
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight">{title}</h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{body}</p>

        <div className="mt-10 grid gap-4">
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
