import PublicLayout from '../../components/common/Layout/PublicLayout'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <PublicLayout>
      <section className="py-24">
        <div className="container-page grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Let's talk about your school</h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
              Tell us a bit about your institute and we'll set up a walkthrough of the admin, teacher,
              and student portals.
            </p>

            <div className="mt-10 space-y-5 text-sm text-ink-soft">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-600" /> Contact your school administrator
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-600" /> +92 300 0000000
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-600" /> Remote-first, serving schools everywhere
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="name">Name</label>
              <input id="name" className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="school">School name</label>
              <input id="school" className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft" htmlFor="message">Message</label>
              <textarea id="message" rows={4} className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
            </div>
            <button type="submit" className="btn-primary w-full">Send message</button>
          </form>
        </div>
      </section>
    </PublicLayout>
  )
}
