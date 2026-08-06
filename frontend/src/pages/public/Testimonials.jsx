import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote, Star } from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const roles = ['All', 'Admin', 'Teacher', 'Student']

const testimonials = [
  { name: 'Dr. Ayesha Khan', role: 'Admin', title: 'School Director · Karachi, PK', quote: 'Akademix has streamlined our school operations, from attendance tracking to exam reporting. It is reliable, intuitive, and has significantly improved our efficiency.' },
  { name: 'Maheshwari Jain', role: 'Admin', title: 'School Head · London, UK', quote: 'Our team adopted it in days. We now have one reliable view of every school activity, instead of five different tools.' },
  { name: 'Jamie Flegg', role: 'Teacher', title: 'Class Teacher · Bangkok, TH', quote: 'Simple, thoughtful tools that free us up to focus on our students instead of paperwork.' },
  { name: 'Carlos Mendes', role: 'Teacher', title: 'Subject Teacher · Lisbon, PT', quote: 'Marking attendance and entering exam results used to eat up my evenings. Now it takes minutes between classes.' },
  { name: 'Fatima Noor', role: 'Admin', title: 'Vice Principal · Lahore, PK', quote: 'Fee collection and invoicing went from a monthly headache to something our office handles without thinking twice.' },
  { name: 'Aiden Cole', role: 'Student', title: 'Grade 11 Student · Toronto, CA', quote: 'I can check my timetable, homework and results from one place instead of asking around. It just makes school life easier.' },
  { name: 'Priya Raman', role: 'Teacher', title: 'Homeroom Teacher · Chennai, IN', quote: 'Sending an announcement to just my class instead of the whole school group chat is such a small thing that saves so much noise.' },
  { name: 'Noah Williams', role: 'Student', title: 'Grade 9 Student · Manchester, UK', quote: 'The homework reminders and live class links landing in one dashboard means I never have to dig through emails.' },
  { name: 'Dr. Grace Obi', role: 'Admin', title: 'School Director · Lagos, NG', quote: 'We evaluated four platforms before choosing Akademix. It was the only one that felt built by people who understood how a school actually runs.' },
]

const stats = [
  ['125,000+', 'Schools onboard'],
  ['4.9 / 5', 'Average rating'],
  ['40+', 'Countries'],
  ['99.9%', 'Platform uptime'],
]

function initials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('')
}

function Hero() {
  return (
    <section className="border-b border-line bg-surface-tint py-20">
      <div className="container-page text-center">
        <span className="eyebrow mx-auto">Loved by schools everywhere</span>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          What admins, teachers and students say
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">
          Real feedback from the people using Akademix every day to run admissions, attendance, fees and exams.
        </p>

        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-2xl font-bold text-brand-600 sm:text-3xl">{value}</dd>
              <p className="mt-1 text-xs text-ink-soft sm:text-sm">{label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function TestimonialGrid() {
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? testimonials : testimonials.filter((t) => t.role === filter)

  return (
    <section className="py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFilter(role)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === role ? 'bg-brand-500 text-white' : 'border border-line text-ink-soft hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => (
            <figure key={t.name} className="card flex h-full flex-col p-7">
              <div className="flex items-center gap-1 text-coral-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <Quote size={24} className="mt-3 text-brand-200" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.title}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 py-16">
      <div className="container-page flex flex-col items-center gap-6 text-center text-white">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Join the schools already running on Akademix</h2>
        <p className="max-w-md text-sm text-white/80">Start free — no credit card, no setup fees.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-soft transition hover:-translate-y-0.5"
        >
          Get started today <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

export default function Testimonials() {
  return (
    <PublicLayout>
      <Hero />
      <TestimonialGrid />
      <CTA />
    </PublicLayout>
  )
}
