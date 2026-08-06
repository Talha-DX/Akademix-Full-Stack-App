import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../../components/common/Layout/AdminLayout'
import ModulePlaceholder from '../../../components/common/ModulePlaceholder'
import { adminSidebar, flattenNav } from '../../../data/mockData'
import DashboardStats from '../../../components/charts/DashboardStats'
import LineChart from '../../../components/charts/LineChart'
import BarChart from '../../../components/charts/BarChart'
import RadialProgress from '../../../components/charts/RadialProgress'
import {
  Users,
  GraduationCap,
  Wallet,
  TrendingUp,
  UserCheck,
  UserX,
  Sparkles,
  PiggyBank,
} from 'lucide-react'
import { dashboardApi } from '../../../api/dashboardApi'
import { useAuth } from '../../../hooks/useAuth'
import { formatCurrency, formatPercent } from '../../../utils/formatters'
import { fileUrl } from '../../../utils/fileUrl'

import InstituteSettings from '../Institute/InstituteSettings'
import InstituteProfile from '../Institute/InstituteProfile'
import UserManagement from '../Users/UserManagement'
import StudentList from '../Students/StudentList'
import AddStudent from '../Students/AddStudent'
import StudentProfile from '../Students/StudentProfile'
import EditStudent from '../Students/EditStudent'
import StaffList from '../Staff/StaffList'
import AddStaff from '../Staff/AddStaff'
import StaffProfile from '../Staff/StaffProfile'
import EditStaff from '../Staff/EditStaff'
import ClassList from '../Classes/ClassList'
import AddClass from '../Classes/AddClass'
import SubjectList from '../Subjects/SubjectList'
import AttendanceReport from '../Attendance/AttendanceReport'
import StaffAttendance from '../Attendance/StaffAttendance'
import TimetableManager from '../Timetable/TimetableManager'
import TeacherTimetable from '../Timetable/TeacherTimetable'
import HomeworkManager from '../Homework/HomeworkManager'
import ExamSchedule from '../Exams/ExamSchedule'
import MarksEntry from '../Results/MarksEntry'
import ResultsList from '../Results/ResultsList'
import FeeStructure from '../Fees/FeeStructure'
import FeeCollection from '../Fees/FeeCollection'
import FeeReport from '../Fees/FeeReport'
import AnnouncementList from '../Announcements/AnnouncementList'
import TemplatesManager from '../Certificates/TemplatesManager'
import CertificateGenerator from '../Certificates/CertificateGenerator'
import IDCardGenerator from '../Certificates/IDCardGenerator'
import FinancialReports from '../Reports/FinancialReports'
import AcademicReports from '../Reports/AcademicReports'
import LiveClassManager from '../LiveClass/LiveClassManager'
import BehaviourSkills from '../Behaviour/BehaviourSkills'
import AdminProfile from '../Profile/AdminProfile'
import AccountSettings from '../../../components/common/AccountSettings'

/** Small avatar-or-initials pill used in the "today" lists below. */
function PersonRow({ name, meta, avatar }) {
  const initials = (name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="flex items-center gap-3 py-2.5">
      {avatar ? (
        <img src={fileUrl(avatar)} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          {initials}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{name}</p>
        {meta && <p className="truncate text-xs text-ink-soft">{meta}</p>}
      </div>
    </div>
  )
}

function EmptyState({ text }) {
  return <p className="py-8 text-center text-sm text-ink-soft">{text}</p>
}

function ProgressRow({ label, pct, marked, markedLabel = 'Not marked yet' }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-semibold text-ink">{marked ? formatPercent(pct) : markedLabel}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-tint">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
          style={{ width: `${marked ? pct : 0}%` }}
        />
      </div>
    </div>
  )
}

function Overview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi.stats().then(({ data }) => setStats(data)).catch(() => setError('Dashboard data could not be loaded.'))
  }, [])

  if (error) return <div className="card p-6 text-sm text-coral-600">{error}</div>
  if (!stats) return <div className="card p-6 text-sm text-ink-soft">Loading dashboard…</div>

  const {
    studentCount = 0,
    staffCount = 0,
    newStudentsThisMonth = 0,
    newStaffThisMonth = 0,
    revenue = { total: 0, thisMonth: 0 },
    outstandingFees = { total: 0, thisMonth: 0 },
    feeStatus = { estimation: 0, collected: 0, remaining: 0 },
    feeCollectionPct = 0,
    revenueTrend = [],
    classWiseStrength = [],
    attendanceToday = {},
    absentStudentsToday = [],
    presentStaffToday = [],
    newAdmissions = [],
  } = stats

  return (
    <div className="space-y-8">
      <DashboardStats
        items={[
          { label: 'Total students', value: studentCount, hint: `This month: +${newStudentsThisMonth}`, icon: GraduationCap },
          { label: 'Total employees', value: staffCount, hint: `This month: +${newStaffThisMonth}`, icon: Users },
          { label: 'Revenue', value: formatCurrency(revenue.total), hint: `This month: ${formatCurrency(revenue.thisMonth)}`, icon: Wallet },
          { label: 'Outstanding fees', value: formatCurrency(outstandingFees.total), hint: `Due this month: ${formatCurrency(outstandingFees.thisMonth)}`, icon: PiggyBank },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-600" />
            <p className="font-display text-base font-semibold text-ink">Fee collections vs billed</p>
          </div>
          <p className="text-xs text-ink-soft">Last 6 months</p>
          <div className="mt-4">
            <LineChart
              legend
              valueFormatter={formatCurrency}
              series={[
                { name: 'Collected', color: '#5D3FD6', data: revenueTrend.map((m) => ({ label: m.label, value: m.collected })) },
                { name: 'Billed', color: '#FF7A45', data: revenueTrend.map((m) => ({ label: m.label, value: m.billed })) },
              ]}
            />
          </div>
        </div>

        <div className="card flex flex-col items-center p-6">
          <p className="self-start font-display text-base font-semibold text-ink">Fee status</p>
          <p className="self-start text-xs text-ink-soft">Estimated vs collected this month</p>
          <div className="mt-4">
            <RadialProgress value={feeCollectionPct} color="#5D3FD6">
              <span className="font-display text-xl font-bold text-ink">{formatPercent(feeCollectionPct)}</span>
              <span className="text-[11px] text-ink-soft">collected</span>
            </RadialProgress>
          </div>
          <div className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-xs text-ink-soft">Estimation</p>
              <p className="font-display text-sm font-semibold text-ink">{formatCurrency(feeStatus.estimation)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-soft">Collected</p>
              <p className="font-display text-sm font-semibold text-brand-600">{formatCurrency(feeStatus.collected)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-ink-soft">Remaining</p>
              <p className="font-display text-sm font-semibold text-coral-600">{formatCurrency(feeStatus.remaining)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <p className="font-display text-base font-semibold text-ink">Class-wise student strength</p>
          <p className="text-xs text-ink-soft">Distribution across classes</p>
          <div className="mt-5">
            <BarChart horizontal data={classWiseStrength} />
          </div>
        </div>

        <div className="card space-y-5 p-6">
          <p className="font-display text-base font-semibold text-ink">Key progress</p>
          <ProgressRow label="Students present today" pct={attendanceToday.studentsPresentPct} marked={attendanceToday.studentsMarked} />
          <ProgressRow label="Staff present today" pct={attendanceToday.staffPresentPct} marked={attendanceToday.staffMarked} />
          <ProgressRow label="This month's fee collection" pct={feeCollectionPct} marked={feeStatus.estimation > 0} markedLabel="No fees due yet" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <UserX size={16} className="text-coral-600" />
            <p className="font-display text-sm font-semibold text-ink">Absent students</p>
          </div>
          <p className="text-xs text-ink-soft">Today</p>
          <div className="mt-2 divide-y divide-line">
            {absentStudentsToday.length
              ? absentStudentsToday.map((s) => <PersonRow key={s.id} name={s.name} meta={s.class} avatar={s.avatar} />)
              : <EmptyState text={attendanceToday.studentsMarked ? 'No absences recorded today.' : 'Attendance not marked yet!'} />}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-brand-600" />
            <p className="font-display text-sm font-semibold text-ink">Present staff</p>
          </div>
          <p className="text-xs text-ink-soft">Today</p>
          <div className="mt-2 divide-y divide-line">
            {presentStaffToday.length
              ? presentStaffToday.map((s) => <PersonRow key={s.id} name={s.name} avatar={s.avatar} />)
              : <EmptyState text={attendanceToday.staffMarked ? 'No staff marked present today.' : 'Attendance not marked yet!'} />}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-600" />
            <p className="font-display text-sm font-semibold text-ink">New admissions</p>
          </div>
          <p className="text-xs text-ink-soft">This month's new students</p>
          <div className="mt-2 divide-y divide-line">
            {newAdmissions.length
              ? newAdmissions.map((s) => <PersonRow key={s.id} name={s.name} meta={`${s.class} · ${s.admissionNo}`} avatar={s.avatar} />)
              : <EmptyState text="No new admissions this month" />}
          </div>
        </div>
      </div>
    </div>
  )
}

const adminNavFlat = flattenNav(adminSidebar)

// module/submodule key -> real page component, mapped onto the new
// pages/admin/<Module>/<File>.jsx structure.
const sections = {
  overview: <Overview />,

  'settings-profile': <InstituteProfile />,
  'settings-roles': <UserManagement />,

  // Personal account menu (top-right profile dropdown) — separate from the
  // Institute Profile above, which edits the school's own record.
  profile: <AdminProfile />,
  'account-settings': <AccountSettings />,

  'classes-list': <ClassList />,
  'classes-add': <AddClass />,

  'subjects-list': <SubjectList />,

  'students-list': <StudentList />,
  'students-add': <AddStudent />,
  'students-admissions': <StudentProfile />,
  'students-promote': <EditStudent />,
  'students-id-cards': <IDCardGenerator />,

  'employees-list': <StaffList />,
  'employees-add': <AddStaff />,
  'employees-departments': <StaffProfile />,
  'employees-designations': <EditStaff />,

  'fees-structure': <FeeStructure />,
  'fees-collection': <FeeCollection />,
  'fees-reports': <FeeReport />,

  'attendance-students': <AttendanceReport />,
  'attendance-staff': <StaffAttendance />,

  'timetable-class': <TimetableManager />,
  'timetable-teacher': <TeacherTimetable />,

  homework: <HomeworkManager />,
  behaviour: <BehaviourSkills />,

  messaging: <AnnouncementList />,

  'live-class': <LiveClassManager />,

  'exams-schedule': <ExamSchedule />,
  'exams-marks': <MarksEntry />,
  'exams-results': <ResultsList />,

  'reports-attendance': <AttendanceReport />,
  'reports-fee': <FinancialReports />,
  'reports-exam': <AcademicReports />,

  'certificates-templates': <TemplatesManager />,
  'certificates-generate': <CertificateGenerator />,
}

export default function AdminDashboard() {
  const { section } = useParams()
  const navigate = useNavigate()
  const [active, setActive] = useState(section || 'overview')
  const { user } = useAuth()
  useEffect(() => { setActive(section || 'overview') }, [section])
  const handleNavigate = (nextSection) => {
    setActive(nextSection)
    navigate(nextSection === 'overview' ? '/admin' : `/admin/${nextSection}`)
  }

  return (
    <AdminLayout
      active={active}
      onNavigate={handleNavigate}
      userName={user?.name ?? ''}
      userMeta="School Administrator"
    >
      {sections[active] ?? (
        <ModulePlaceholder
          title={adminNavFlat.find((n) => n.key === active)?.label ?? 'Coming soon'}
          description="This module is wired into the navigation and ready for its data screens."
        />
      )}
    </AdminLayout>
  )
}
