import PublicLayout from '../../components/common/Layout/PublicLayout'
import { GraduationCap, Target, Users } from 'lucide-react'

const values = [
  { icon: Target, title: 'Built around real school workflows', body: 'Every module mirrors how admissions, attendance and fee collection actually happen day to day, not a generic CRUD template.' },
  { icon: Users, title: 'One system, four audiences', body: 'Admins, teachers, students and parents all work from the same data, each through a portal shaped for their role.' },
  { icon: GraduationCap, title: 'Academics first', body: 'The product decisions all trace back to one question: does this make running a school easier?' },
]

export default function About() {
  return (
    <PublicLayout>
      <section className="border-b border-line py-24">
        <div className="container-page max-w-2xl">
          <p className="eyebrow">About Akademix</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            A school management system built for how schools actually run.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            Akademix started from a simple observation: most schools run on a patchwork of paper
            registers, spreadsheets, and group chats — each holding a piece of the picture, none of
            them talking to each other. Akademix brings admissions, attendance, timetables, exams,
            fees and communication into one shared system, with a portal for every role.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-surface-raised py-24">
        <div className="container-page grid gap-8 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <v.icon size={20} />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-ink">{v.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
