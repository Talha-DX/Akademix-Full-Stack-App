import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BarChart3,
  CalendarCheck,
  CirclePlay,
  Clock3,
  Lightbulb,
  MessageSquareText,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Wallet,
} from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const stats = [
  { label: 'Schools onboard', value: '125k+' },
  { label: 'Educator rating', value: '4.9/5' },
  { label: 'Platform uptime', value: '99.9%' },
]

function DashboardPreview() {
  return (
    <div className="card relative mx-auto max-w-md p-5" aria-label="Akademix dashboard preview">
      <div className="flex items-center gap-1.5 border-b border-line pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-coral-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-auto font-display text-xs font-semibold text-brand-600">akademix</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="col-span-1 rounded-lg bg-brand-500 p-3 text-white">
          <UsersRound size={16} />
          <p className="mt-2 text-lg font-bold leading-none">1,740</p>
          <p className="mt-1 text-[11px] text-brand-100">Total students</p>
        </div>
        <div className="rounded-lg bg-surface-tint p-3">
          <p className="text-lg font-bold leading-none text-ink">38</p>
          <p className="mt-1 text-[11px] text-ink-soft">Staff members</p>
        </div>
        <div className="rounded-lg bg-surface-tint p-3">
          <p className="text-lg font-bold leading-none text-ink">$136k</p>
          <p className="mt-1 text-[11px] text-ink-soft">Revenue</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-3">
        <div className="rounded-lg border border-line p-3">
          <p className="text-[11px] font-medium text-ink-soft">Academic progress</p>
          <svg viewBox="0 0 260 90" className="mt-2 h-16 w-full" role="img" aria-hidden="true">
            <path
              d="M4 76 C35 14 52 68 86 44 S120 80 150 30 S190 60 220 34 S250 60 256 12"
              fill="none"
              stroke="#5D3FD6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="grid place-items-center rounded-lg border border-line p-3 text-center">
          <div className="h-12 w-12 rounded-full border-[6px] border-brand-100 border-t-brand-500" />
          <p className="mt-2 text-xs font-semibold text-ink">
            75%
            <span className="block text-[10px] font-normal text-ink-soft">Attendance</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#221660] via-[#1c1240] to-[#120b2c] py-20 text-white sm:py-28">
      <div className="animated-orb pointer-events-none absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-500/30 blur-3xl" />
      <div className="animated-orb pointer-events-none absolute bottom-[-18%] left-[-6%] h-[340px] w-[340px] rounded-full bg-coral-500/20 blur-3xl" />

      <div className="container-page relative grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="page-content">
          <span className="eyebrow border-white/20 bg-white/10 text-white">
            <Sparkles size={14} /> #1 all-in-one school platform
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.3rem]">
            Run your school on one <span className="gradient-title bg-gradient-to-r from-white via-brand-100 to-white bg-clip-text">connected</span> platform
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            Akademix brings admissions, attendance, fees, exams and communication into a single, easy-to-use
            dashboard — free to get started, no credit card required.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Get started, it&apos;s free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-3 text-sm font-medium text-white/80 transition hover:text-white">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
                <CirclePlay size={20} />
              </span>
              See how it works
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-6 text-sm text-white/70">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-bold text-white">{stat.value}</dd>
                {stat.label}
              </div>
            ))}
          </dl>
        </div>

        <div className="page-content">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}

function TrustBar() {
  return (
    <section className="border-b border-line bg-white py-6">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldCheck size={18} className="text-brand-500" /> Built for modern education teams
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ink-soft">
          <span><b className="text-ink">125k+</b> schools trust us</span>
          <span><b className="text-ink">24/7</b> reliable support</span>
          <span><b className="text-ink">4.9/5</b> educator rating</span>
        </div>
      </div>
    </section>
  )
}

const features = [
  [UsersRound, 'Admissions & Students', 'Manage enrollments, student records and class assignments from one place.'],
  [CalendarCheck, 'Attendance', 'Mark and track attendance for every class, with reports that update in real time.'],
  [Wallet, 'Fees & Invoicing', 'Generate invoices, record payments and manage fee structures without spreadsheets.'],
  [Award, 'Exams & Results', 'Enter marks, generate report cards and analyze results as soon as exams end.'],
  [Clock3, 'Timetable', 'Build conflict-free timetables for classes and teachers in minutes, not hours.'],
  [MessageSquareText, 'Communication', 'Share announcements and updates with staff, students and parents instantly.'],
]

function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Everything in one platform</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
            One dashboard for your <span className="text-brand-600">entire school</span>
          </h2>
          <p className="mt-4 text-base text-ink-soft">
            Akademix replaces scattered spreadsheets and paperwork with a single, easy-to-use system your whole
            team can rely on.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([Icon, title, text]) => (
            <div key={title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const reasons = [
  [Lightbulb, 'Innovation at our core', 'Akademix brings together powerful school-management tools and modern technology to make administration effortless.'],
  [Target, 'Simplifying complexity', 'Clear dashboards and practical reports turn complex academic data into insights every educator can understand.'],
  [BarChart3, 'Built to grow with you', 'Automated workflows, real-time analytics and simple communication give your institution room to grow.'],
]

function WhyUs() {
  return (
    <section id="why-us" className="bg-surface-tint py-20">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-5">
          <div className="card flex flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="font-display text-3xl font-bold text-brand-600">99.8%</p>
            <p className="text-sm text-ink-soft">User satisfaction</p>
          </div>
          <div className="card mt-8 flex flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="font-display text-3xl font-bold text-brand-600">78%</p>
            <p className="text-sm text-ink-soft">Avg. efficiency gain reported by schools</p>
          </div>
          <div className="card col-span-2 flex items-center gap-3 p-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral-500/10 text-coral-500">
              <ShieldCheck size={18} />
            </span>
            <p className="text-sm text-ink-soft">Free forever for a single school — no hidden limits.</p>
          </div>
        </div>

        <div>
          <span className="eyebrow">Why choose us?</span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Akademix is a <span className="text-brand-600">revolution</span> in education management
          </h2>
          <div className="mt-8 space-y-6">
            {reasons.map(([Icon, title, text]) => (
              <div key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  ['Dr. Ayesha Khan', 'School Director · Karachi, PK', 'Akademix has streamlined our school operations, from attendance tracking to exam reporting. It is reliable, intuitive, and has significantly improved our efficiency.'],
  ['Maheshwari Jain', 'School Head · London, UK', 'Our team adopted it in days. We now have one reliable view of every school activity, instead of five different tools.'],
  ['Jamie Flegg', 'Class Teacher · Bangkok, TH', 'Simple, thoughtful tools that free us up to focus on our students instead of paperwork.'],
]

function initials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('')
}

function Testimonials() {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">What our clients say about us</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map(([name, role, quote]) => (
            <figure key={name} className="card flex h-full flex-col p-7">
              <Quote size={26} className="text-brand-200" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                  {initials(name)}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{name}</p>
                  <p className="text-xs text-ink-soft">{role}</p>
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
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to modernize your school?</h2>
        <p className="max-w-md text-sm text-white/80">
          Join thousands of schools already running admissions, attendance, fees and results on Akademix.
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

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <TrustBar />
      <Features />
      <WhyUs />
      <Testimonials />
      <CTA />
    </PublicLayout>
  )
}
