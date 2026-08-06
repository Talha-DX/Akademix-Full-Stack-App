import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Crown, Rocket, Sparkles } from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const plans = [
  {
    icon: Sparkles,
    name: 'Starter',
    tagline: 'For a single school getting off spreadsheets',
    monthly: 0,
    annual: 0,
    cta: { label: 'Get started free', to: '/register' },
    features: [
      'Up to 150 students',
      'Admissions & attendance',
      'Fees & invoicing',
      'Exams & report cards',
      'Admin, teacher & student portals',
      'Email support',
    ],
  },
  {
    icon: Rocket,
    name: 'Growth',
    tagline: 'For growing schools that need more room',
    monthly: 29,
    annual: 24,
    highlighted: true,
    cta: { label: 'Start free trial', to: '/register' },
    features: [
      'Unlimited students',
      'Everything in Starter',
      'Timetable builder',
      'Live classes',
      'Certificates & ID cards',
      'Priority support',
    ],
  },
  {
    icon: Crown,
    name: 'Enterprise',
    tagline: 'For multi-campus institutions & districts',
    monthly: null,
    annual: null,
    cta: { label: 'Talk to sales', to: '/contact' },
    features: [
      'Everything in Growth',
      'Multiple campuses / branches',
      'Custom roles & permissions',
      'Dedicated onboarding',
      'Custom integrations',
      '24/7 priority support',
    ],
  },
]

const faqs = [
  ['Is the free plan really free?', 'Yes — Starter is free forever for a single school with up to 150 students, no credit card required.'],
  ['Can I switch plans later?', 'Yes, you can move between plans at any time as your school grows. Your data stays exactly as it is.'],
  ['Do you offer discounts for annual billing?', 'Annual billing saves you the equivalent of roughly two months compared to paying monthly.'],
]

function formatPrice(value) {
  if (value === null) return 'Custom'
  if (value === 0) return '$0'
  return `$${value}`
}

function Hero({ annual, setAnnual }) {
  return (
    <section className="border-b border-line bg-surface-tint py-20">
      <div className="container-page text-center">
        <span className="eyebrow mx-auto">Simple, transparent pricing</span>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Pricing that grows with your school
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">
          Start free. Upgrade only when your school needs more — no setup fees, no long-term contracts.
        </p>

        <div className="mx-auto mt-8 inline-flex items-center gap-1 rounded-full border border-line bg-white p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !annual ? 'bg-brand-500 text-white' : 'text-ink-soft'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              annual ? 'bg-brand-500 text-white' : 'text-ink-soft'
            }`}
          >
            Annual <span className="opacity-80">· save ~15%</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function PlanCard({ plan, annual }) {
  const price = annual ? plan.annual : plan.monthly
  return (
    <div
      className={`card relative flex flex-col p-7 ${
        plan.highlighted ? 'border-2 border-brand-500 shadow-card lg:-translate-y-3' : ''
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      )}
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <plan.icon size={22} />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">{plan.name}</h3>
      <p className="mt-1 text-sm text-ink-soft">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-ink">{formatPrice(price)}</span>
        {price !== null && <span className="text-sm text-ink-soft">/ school / month</span>}
      </div>

      <Link
        to={plan.cta.to}
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
          plan.highlighted ? 'btn-primary justify-center' : 'border border-line text-ink hover:border-brand-300 hover:text-brand-600'
        }`}
      >
        {plan.cta.label} <ArrowRight size={16} />
      </Link>

      <ul className="mt-7 space-y-3 border-t border-line pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
            <Check size={16} className="mt-0.5 shrink-0 text-brand-500" /> {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlansGrid({ annual }) {
  return (
    <section className="py-20">
      <div className="container-page grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} annual={annual} />
        ))}
      </div>
    </section>
  )
}

function PricingFaq() {
  return (
    <section className="bg-surface-tint py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div>
          <span className="eyebrow">Questions</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">Pricing questions</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Have something more specific to ask?{' '}
            <Link to="/contact" className="font-semibold text-brand-600 hover:text-brand-700">Talk to us</Link> or read
            the full <Link to="/faq" className="font-semibold text-brand-600 hover:text-brand-700">FAQ</Link>.
          </p>
        </div>
        <div className="grid gap-4">
          {faqs.map(([q, a]) => (
            <div key={q} className="card p-5">
              <p className="font-display text-sm font-semibold text-ink">{q}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  return (
    <PublicLayout>
      <Hero annual={annual} setAnnual={setAnnual} />
      <PlansGrid annual={annual} />
      <PricingFaq />
    </PublicLayout>
  )
}
