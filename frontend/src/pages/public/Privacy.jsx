import { Link } from 'react-router-dom'
import { Database, Eye, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const sections = [
  {
    icon: Database,
    title: '1. What we collect',
    body: 'When a school signs up, we collect the information needed to run the platform: admin, teacher and student account details, attendance records, exam results, fee and invoice records, and any files uploaded through the platform (such as homework attachments or profile photos).',
  },
  {
    icon: Eye,
    title: '2. How we use it',
    body: 'Data is used only to operate the features you use — displaying dashboards, generating report cards and invoices, sending the notifications a school configures, and improving reliability. We do not sell school or student data, and we do not use it for advertising.',
  },
  {
    icon: ShieldCheck,
    title: '3. Who can see it',
    body: 'Every school is a separate, isolated workspace. Admins, teachers and students only ever see the data that belongs to their own school and, within it, only what their role is permitted to access — for example, a teacher sees only the classes assigned to them.',
  },
  {
    icon: Lock,
    title: '4. How it is protected',
    body: 'Passwords are stored using industry-standard hashing, connections are encrypted in transit, and access to production data is limited to what is required to operate and support the platform.',
  },
  {
    icon: UserCheck,
    title: '5. Your rights',
    body: 'School admins can export or delete their school\u2019s data at any time from the dashboard. If you are a teacher, student, or parent and have a request about your personal data, ask your school administrator, or contact us directly and we\u2019ll help route the request.',
  },
  {
    icon: Mail,
    title: '6. Contact',
    body: 'Questions about this policy or how your school\u2019s data is handled can be sent to our support team at any time — see the contact details below.',
  },
]

export default function Privacy() {
  return (
    <PublicLayout>
      <section className="border-b border-line py-20">
        <div className="container-page max-w-2xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink">Privacy Policy</h1>
          <p className="mt-4 text-sm text-ink-soft">Last updated: August 2026</p>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            This policy explains what information Akademix collects when a school uses the platform, how it is
            used, and the choices available to schools, staff and students. It is written in plain language on
            purpose — reach out any time if something isn&apos;t clear.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {sections.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon size={18} />
              </span>
              <h2 className="mt-4 font-display text-base font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>

        <div className="container-page mt-10">
          <p className="text-sm text-ink-soft">
            Read this alongside our{' '}
            <Link to="/terms" className="font-semibold text-brand-600 hover:text-brand-700">Terms of Service</Link>. For anything
            else, our{' '}
            <Link to="/contact" className="font-semibold text-brand-600 hover:text-brand-700">contact page</Link> reaches the right
            team.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
