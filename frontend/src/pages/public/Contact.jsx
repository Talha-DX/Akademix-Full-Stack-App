import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const channels = [
  [Mail, 'Email us', 'support@akademix.app', 'mailto:support@akademix.app'],
  [Phone, 'Call us', '+44 (740) 407 4252', 'tel:+447404074252'],
  [MessageCircle, 'Live chat', 'Available in your dashboard', null],
]

const miniFaq = [
  ['How quickly will I hear back?', 'Our team typically replies within one business day.'],
  ['Can I get a walkthrough before signing up?', 'Yes — mention that in your message and we\u2019ll set up a live walkthrough of the admin, teacher and student portals.'],
  ['I\u2019m already a customer with a support issue.', 'Use the live chat inside your dashboard for the fastest response, or email us directly.'],
]

function Hero() {
  return (
    <section className="border-b border-line py-20">
      <div className="container-page max-w-2xl">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">Let&apos;s talk about your school</h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
          Tell us a bit about your institute and we&apos;ll set up a walkthrough of the admin, teacher,
          and student portals.
        </p>
      </div>
    </section>
  )
}

function ChannelCards() {
  return (
    <section className="border-b border-line bg-surface-tint py-12">
      <div className="container-page grid gap-5 sm:grid-cols-3">
        {channels.map(([Icon, title, value, href]) => {
          const content = (
            <div className="card flex h-full items-start gap-3 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon size={18} />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1 text-sm text-ink-soft">{value}</p>
              </div>
            </div>
          )
          return href ? (
            <a key={title} href={href} className="block transition hover:-translate-y-0.5">
              {content}
            </a>
          ) : (
            <div key={title}>{content}</div>
          )
        })}
      </div>
    </section>
  )
}

function ContactMain() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-24">
      <div className="container-page grid gap-16 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Why reach out</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink">A few reasons people write to us</h2>

          <ul className="mt-6 space-y-4 text-sm text-ink-soft">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-500" />
              Setting up Akademix for a new school and want a guided walkthrough.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-500" />
              Comparing plans for a multi-campus institution or district.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-500" />
              Migrating student, staff and fee records from another system.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-500" />
              Reporting an issue with your existing school workspace.
            </li>
          </ul>

          <div className="mt-10 space-y-5 text-sm text-ink-soft">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-brand-600" /> Remote-first, serving schools everywhere
            </div>
            <div className="flex items-center gap-3">
              <Clock3 size={18} className="text-brand-600" /> Replies within one business day
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
              <CheckCircle2 size={24} />
            </span>
            <p className="font-display text-lg font-semibold text-ink">Message sent</p>
            <p className="text-sm text-ink-soft">Thanks for reaching out — our team will get back to you within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="name">Name</label>
              <input id="name" required className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="email">Email</label>
              <input id="email" type="email" required className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="school">School name</label>
              <input id="school" className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="message">Message</label>
              <textarea id="message" rows={4} required className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Send message</button>
          </form>
        )}
      </div>
    </section>
  )
}

function MiniFaq() {
  return (
    <section className="border-t border-line bg-surface-tint py-20">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow mx-auto">Before you write in</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink">Quick answers</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {miniFaq.map(([q, a]) => (
            <div key={q} className="card p-5">
              <p className="font-display text-sm font-semibold text-ink">{q}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-ink-soft">
          More questions? See the full{' '}
          <Link to="/faq" className="font-semibold text-brand-600 hover:text-brand-700">FAQ page</Link>.
        </p>
      </div>
    </section>
  )
}

export default function Contact() {
  return (
    <PublicLayout>
      <Hero />
      <ChannelCards />
      <ContactMain />
      <MiniFaq />
    </PublicLayout>
  )
}
