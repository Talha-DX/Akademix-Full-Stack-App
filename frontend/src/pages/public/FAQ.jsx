import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LifeBuoy, Mail } from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const categories = [
  {
    title: 'Getting started',
    items: [
      ['How do I set up my school on Akademix?', 'Sign up for a free account, and we automatically create your school workspace with you as the admin. From there you can add classes, staff and students from the admin dashboard, or import them in bulk from a spreadsheet.'],
      ['Can I import my existing student and staff records?', 'Yes. The admin dashboard supports bulk import so you can bring across existing student and staff lists instead of entering them one by one.'],
      ['Do I need to install anything?', 'No. Akademix runs entirely in the browser for admins and teachers, and students can use it on desktop or mobile without installing an app.'],
    ],
  },
  {
    title: 'Plans & billing',
    items: [
      ['Is there a free plan?', 'Yes — Starter is free forever for a single school with up to 150 students, no credit card required. See the full breakdown on the Pricing page.'],
      ['What happens if I outgrow the free plan?', 'You can upgrade to Growth at any time. Your existing students, staff, classes and records carry over automatically — nothing needs to be re-entered.'],
      ['Can I cancel at any time?', 'Yes, there are no long-term contracts. You can downgrade or cancel a paid plan whenever you need to.'],
    ],
  },
  {
    title: 'Data & security',
    items: [
      ['Who owns the data we put into Akademix?', 'Your school does. Student, staff and financial records belong to your institution, and you can export them at any time.'],
      ['Is student data kept private between schools?', 'Yes. Every school is a fully separate workspace — admins, teachers and students only ever see data that belongs to their own school.'],
      ['Do you offer backups?', 'Data is backed up regularly as part of the platform, so day-to-day work isn\u2019t dependent on any one device or browser tab.'],
    ],
  },
  {
    title: 'Using the platform',
    items: [
      ['Can teachers only see their own classes?', 'Yes. Teacher accounts are scoped to the classes and subjects assigned to them — attendance, marks entry and homework only show what\u2019s relevant to them.'],
      ['Can parents access Akademix?', 'Parents can view their child\u2019s attendance, results, homework and fee status through the student portal, using access shared by the school.'],
      ['Can I run more than one school on one account?', 'A single admin account manages one school workspace. For multiple campuses or branches, our Enterprise plan supports multi-campus setups — reach out and we\u2019ll help you configure it.'],
    ],
  },
]

function FaqItem({ question, answer, open, onToggle }) {
  return (
    <div className="card overflow-hidden p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-sm font-semibold text-ink">{question}</span>
        <ChevronDown size={18} className={`shrink-0 text-brand-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-line px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-ink-soft">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openKey, setOpenKey] = useState('Getting started-0')

  return (
    <PublicLayout>
      <section className="border-b border-line bg-surface-tint py-20">
        <div className="container-page max-w-2xl text-center mx-auto">
          <span className="eyebrow mx-auto">Frequently asked questions</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Everything you might want to know
          </h1>
          <p className="mt-4 text-base text-ink-soft">
            Can&apos;t find what you&apos;re looking for? Reach out and we&apos;ll get back to you directly.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_2fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.title}>
                  <a
                    href={`#${category.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-600"
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="card mt-6 flex items-start gap-3 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <LifeBuoy size={18} />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink">Still stuck?</p>
                <Link to="/contact" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                  <Mail size={14} /> Contact support
                </Link>
              </div>
            </div>
          </aside>

          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.title} id={category.title.replace(/\s+/g, '-').toLowerCase()}>
                <h2 className="font-display text-xl font-bold text-ink">{category.title}</h2>
                <div className="mt-5 space-y-3">
                  {category.items.map(([question, answer], index) => {
                    const key = `${category.title}-${index}`
                    return (
                      <FaqItem
                        key={key}
                        question={question}
                        answer={answer}
                        open={openKey === key}
                        onToggle={() => setOpenKey((prev) => (prev === key ? null : key))}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
