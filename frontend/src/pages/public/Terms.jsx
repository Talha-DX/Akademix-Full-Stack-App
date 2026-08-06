import { Link } from 'react-router-dom'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const sections = [
  {
    title: '1. Using Akademix',
    body: 'By creating an account, you agree to use Akademix to manage genuine school activity — admissions, attendance, fees, exams and related communication — and to keep your login credentials secure.',
  },
  {
    title: '2. Accounts & roles',
    body: 'The person who registers a school becomes its Admin and is responsible for creating and managing Teacher and Student accounts within that school, and for the accuracy of the data entered.',
  },
  {
    title: '3. School data',
    body: 'Data entered into a school\u2019s workspace — student records, results, fee records and files — belongs to that school. Akademix acts as the platform that stores and displays it; schools remain responsible for the accuracy and lawful use of the data they upload.',
  },
  {
    title: '4. Acceptable use',
    body: 'Akademix may not be used to store or share unlawful content, to misrepresent a school\u2019s identity, or to attempt to access another school\u2019s workspace or data.',
  },
  {
    title: '5. Plans & billing',
    body: 'The Starter plan is free, with limits described on the Pricing page. Paid plans are billed on the cycle chosen at signup and can be changed or cancelled at any time; charges already incurred are not refunded except where required by law.',
  },
  {
    title: '6. Availability',
    body: 'We aim to keep Akademix available and reliable, but scheduled maintenance and unplanned downtime can occasionally occur. We\u2019ll communicate significant planned maintenance in advance where possible.',
  },
  {
    title: '7. Changes to these terms',
    body: 'These terms may be updated from time to time as the platform evolves. Continued use of Akademix after an update means you accept the revised terms.',
  },
]

export default function Terms() {
  return (
    <PublicLayout>
      <section className="border-b border-line py-20">
        <div className="container-page max-w-2xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink">Terms of Service</h1>
          <p className="mt-4 text-sm text-ink-soft">Last updated: August 2026</p>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            These terms cover how schools, admins, teachers and students may use Akademix. They work alongside
            our <Link to="/privacy" className="font-semibold text-brand-600 hover:text-brand-700">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="border-b border-line pb-8 last:border-0 last:pb-0">
              <h2 className="font-display text-lg font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{section.body}</p>
            </div>
          ))}

          <p className="text-sm text-ink-soft">
            Questions about these terms? Reach out on our{' '}
            <Link to="/contact" className="font-semibold text-brand-600 hover:text-brand-700">contact page</Link>.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
