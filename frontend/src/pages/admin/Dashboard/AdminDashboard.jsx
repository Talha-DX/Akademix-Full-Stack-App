import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../../components/common/Layout/AdminLayout'
import ModulePlaceholder from '../../../components/common/ModulePlaceholder'
import { adminSidebar, flattenNav } from '../../../data/mockData'
import DashboardStats from '../../../components/charts/DashboardStats'
import { Users, GraduationCap, Wallet, ClipboardCheck } from 'lucide-react'
import { dashboardApi } from '../../../api/dashboardApi'
import { useAuth } from '../../../hooks/useAuth'

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

function Overview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    dashboardApi.stats().then(({ data }) => setStats(data)).catch(() => setError('Dashboard data could not be loaded.'))
  }, [])
  if (error) return <div className="card p-6 text-sm text-coral-600">{error}</div>
  if (!stats) return <div className="card p-6 text-sm text-ink-soft">Loading dashboard…</div>
  return (
    <div className="space-y-8">
      <DashboardStats
        items={[
          { label: 'Students enrolled', value: stats.studentCount ?? 0, icon: GraduationCap },
          { label: 'Staff on record', value: stats.staffCount ?? 0, icon: Users },
          { label: 'Invoices due', value: stats.dueInvoices ?? 0, icon: Wallet },
          { label: 'Classes', value: stats.classCount ?? 0, icon: ClipboardCheck },
        ]}
      />
      <div className="card p-6">
        <p className="font-display text-base font-semibold text-ink">School activity</p>
        <div className="mt-5 space-y-3">
          <p className="text-sm text-ink-soft">{stats.announcements ?? 0} announcement{stats.announcements === 1 ? '' : 's'} published for your school.</p>
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
