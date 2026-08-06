import { Link } from 'react-router-dom'
import { ArrowRight, Compass, GraduationCap, HeartHandshake, Rocket, Target, Users } from 'lucide-react'
import PublicLayout from '../../components/common/Layout/PublicLayout'

const values = [
  { icon: Target, title: 'Built around real school workflows', body: 'Every module mirrors how admissions, attendance and fee collection actually happen day to day, not a generic CRUD template.' },
  { icon: Users, title: 'One system, four audiences', body: 'Admins, teachers, students and parents all work from the same data, each through a portal shaped for their role.' },
  { icon: GraduationCap, title: 'Academics first', body: 'The product decisions all trace back to one question: does this make running a school easier?' },
]

const stats = [
  ['125,000+', 'Schools onboard'],
  ['40+', 'Countries'],
  ['4.9 / 5', 'Educator rating'],
  ['99.9%', 'Platform uptime'],
]

const timeline = [
  ['The problem', 'We kept seeing the same thing: schools running admissions in one spreadsheet, attendance on paper registers, and fee tracking in a notebook — none of it talking to each other.'],
  ['The first version', 'Akademix started as a single admin dashboard for attendance and fees at one school, built directly alongside the office staff using it every day.'],
  ['Growing with feedback', 'Timetables, exams, certificates and live classes were added because schools asked for them — each module shaped by how teachers and admins actually work, not by what looked good in a demo.'],
  ['Today', 'Akademix now runs admissions, attendance, fees, exams, timetables and communication for schools across more than 40 countries, with a portal for every role in the building.'],
]

const team = [
  { initials: 'AK', role: 'Product & Engineering', body: 'Designs and builds every module directly with feedback from schools using the platform day to day.' },
  { initials: 'SU', role: 'Customer Success', body: 'Helps new schools get their students, staff and classes set up and running in their first week.' },
  { initials: 'DS', role: 'Trust & Security', body: 'Keeps every school\u2019s data isolated, backed up and handled with the care school records deserve.' },
]

function Hero() {
  return (
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
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get started, it&apos;s free <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Talk to our team
          </Link>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="border-b border-line bg-surface-tint py-14">
      <div className="container-page grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="text-center">
            <p className="font-display text-3xl font-bold text-brand-600">{value}</p>
            <p className="mt-1 text-sm text-ink-soft">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Values() {
  return (
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
  )
}

function Story() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mx-auto">Our story</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">How Akademix came to be</h2>
        </div>

        <div className="mt-14 space-y-10 border-l border-line pl-8 sm:mx-auto sm:max-w-2xl">
          {timeline.map(([title, body]) => (
            <div key={title} className="relative">
              <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-brand-500 bg-white" />
              <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MissionVision() {
  return (
    <section className="bg-surface-tint py-24">
      <div className="container-page grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Compass size={22} />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">Our mission</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Give every school, regardless of size or budget, the same quality of software that large
            institutions can afford to build in-house — so staff can spend their time on students, not paperwork.
          </p>
        </div>
        <div className="card p-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Rocket size={22} />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">Our vision</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            A world where no school runs critical records — attendance, results, fees — on paper or in
            disconnected spreadsheets, and every teacher, student and parent has one reliable place to look.
          </p>
        </div>
      </div>
    </section>
  )
}

function Team() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mx-auto">Behind Akademix</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">A small team, close to our schools</h2>
          <p className="mt-4 text-base text-ink-soft">
            We stay small on purpose so every feature we ship has come from a real conversation with a real school.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.role} className="card p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-base font-semibold text-white">
                {member.initials}
              </span>
              <p className="mt-4 font-display text-base font-semibold text-ink">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{member.body}</p>
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
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15">
          <HeartHandshake size={22} />
        </span>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Want to see it running for your school?</h2>
        <p className="max-w-md text-sm text-white/80">Create a free account, or talk to us first — either way, we&apos;re happy to help.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-soft transition hover:-translate-y-0.5"
          >
            Get started free <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <PublicLayout>
      <Hero />
      <Stats />
      <Values />
      <Story />
      <MissionVision />
      <Team />
      <CTA />
    </PublicLayout>
  )
}
