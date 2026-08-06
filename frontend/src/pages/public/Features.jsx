import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  Clock3,
  FileBadge,
  Layers,
  MessageSquareText,
  Sparkles,
  UsersRound,
  Video,
  Wallet,
} from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const modules = [
  {
    icon: UsersRound,
    title: 'Admissions & Students',
    body: 'Capture enquiries, enroll students and keep every profile — contact details, documents, class history — in one record.',
    points: ['Guided enrollment forms', 'Bulk import from spreadsheets', 'Full student & guardian profiles'],
  },
  {
    icon: CalendarCheck,
    title: 'Attendance',
    body: 'Mark attendance in seconds, for a whole class or an individual, and see patterns before they become problems.',
    points: ['Daily & period-wise marking', 'Automatic absence alerts', 'Monthly attendance reports'],
  },
  {
    icon: Wallet,
    title: 'Fees & Invoicing',
    body: 'Build fee structures once, generate invoices automatically and track every payment without a spreadsheet in sight.',
    points: ['Flexible fee structures per class', 'Online & manual payment tracking', 'Auto-generated receipts'],
  },
  {
    icon: Award,
    title: 'Exams & Results',
    body: 'Schedule exams, enter marks, and publish report cards the moment results are finalized.',
    points: ['Configurable exam terms', 'Bulk marks entry', 'Auto-calculated grades & report cards'],
  },
  {
    icon: Clock3,
    title: 'Timetable',
    body: 'Build a conflict-free weekly timetable for every class and teacher, and let each portal show only what matters to them.',
    points: ['Drag-and-drop period builder', 'Clash detection', 'Personal view for every teacher'],
  },
  {
    icon: MessageSquareText,
    title: 'Announcements',
    body: 'Send one announcement to the right audience — everyone, just staff, just a class — instead of five different group chats.',
    points: ['Audience targeting', 'Instant in-portal delivery', 'Full announcement history'],
  },
  {
    icon: FileBadge,
    title: 'Certificates & ID Cards',
    body: 'Generate certificates and student ID cards from templates in a few clicks, ready to print or download as PDF.',
    points: ['Reusable templates', 'Bulk generation', 'Downloadable PDFs'],
  },
  {
    icon: Video,
    title: 'Live Classes',
    body: 'Schedule and run live classes for a section, with every session logged against the class timetable.',
    points: ['Scheduled class links', 'Class-wise session history', 'Visible on student & teacher dashboards'],
  },
  {
    icon: Layers,
    title: 'Reports & Analytics',
    body: 'Academic, financial and attendance reports that pull from live data — no exporting and stitching spreadsheets together.',
    points: ['Academic performance reports', 'Financial summaries', 'Exportable, shareable reports'],
  },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#221660] via-[#1c1240] to-[#120b2c] py-20 text-white sm:py-24">
      <div className="animated-orb pointer-events-none absolute -top-32 right-[-8%] h-[380px] w-[380px] rounded-full bg-brand-500/30 blur-3xl" />
      <div className="animated-orb pointer-events-none absolute bottom-[-18%] left-[-6%] h-[300px] w-[300px] rounded-full bg-coral-500/20 blur-3xl" />
      <div className="container-page relative max-w-2xl">
        <span className="eyebrow border-white/20 bg-white/10 text-white">
          <Sparkles size={14} /> Everything you need, nothing you don't
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
          One platform for every part of running a school
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
          From the first enquiry to the final report card, Akademix keeps admissions, attendance, fees, exams
          and communication in one connected system — with a portal built for admins, teachers and students.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get started, it&apos;s free <ArrowRight size={18} />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  )
}

function ModuleGrid() {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Every module, connected</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
            Built around how schools <span className="text-brand-600">actually work</span>
          </h2>
          <p className="mt-4 text-base text-ink-soft">
            Each module shares the same student, staff and class data — so nothing needs to be entered twice,
            and every portal stays in sync automatically.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ icon: Icon, title, body, points }) => (
            <div key={title} className="card flex flex-col p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-ink-soft">
                    <BadgeCheck size={15} className="mt-0.5 shrink-0 text-brand-500" /> {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PortalsSection() {
  const portals = [
    ['Admin', 'Full control over the school — students, staff, classes, fees, results and settings, all in one dashboard.'],
    ['Teacher', 'Attendance, marks entry, homework and timetable for exactly the classes they teach.'],
    ['Student', 'Homework, results, fees, timetable and certificates, always up to date.'],
  ]
  return (
    <section className="bg-surface-tint py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">One system, three portals</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">A dashboard shaped for every role</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {portals.map(([title, body]) => (
            <div key={title} className="card p-6 text-center">
              <p className="font-display text-lg font-semibold text-brand-600">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
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
        <h2 className="font-display text-2xl font-bold sm:text-3xl">See it running with your own data</h2>
        <p className="max-w-md text-sm text-white/80">
          Create a free account and set up your first class in under five minutes.
        </p>
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

export default function Features() {
  return (
    <PublicLayout>
      <Hero />
      <ModuleGrid />
      <PortalsSection />
      <CTA />
    </PublicLayout>
  )
}
