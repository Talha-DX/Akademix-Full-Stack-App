import { useEffect, useState } from 'react'
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
import SectionManagement from '../Classes/SectionManagement'
import SubjectList from '../Subjects/SubjectList'
import AddSubject from '../Subjects/AddSubject'
import AttendanceReport from '../Attendance/AttendanceReport'
import TimetableManager from '../Timetable/TimetableManager'
import TeacherTimetable from '../Timetable/TeacherTimetable'
import HomeworkList from '../Homework/HomeworkList'
import ExamSchedule from '../Exams/ExamSchedule'
import ResultManagement from '../Results/ResultManagement'
import FeeStructure from '../Fees/FeeStructure'
import FeeManagement from '../Fees/FeeManagement'
import FeeReports from '../Fees/FeeReports'
import AnnouncementList from '../Announcements/AnnouncementList'
import CertificateTemplates from '../Certificates/CertificateTemplates'
import GenerateCertificate from '../Certificates/GenerateCertificate'
import IDCardGenerator from '../Certificates/IDCardGenerator'
import ReportGenerator from '../Reports/ReportGenerator'
import AcademicSettings from '../Settings/AcademicSettings'
import NotificationSettings from '../Settings/NotificationSettings'

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
  'settings-academic-year': <AcademicSettings />,
  'settings-roles': <UserManagement />,
  'settings-notifications': <NotificationSettings />,

  'classes-list': <ClassList />,
  'classes-add': <AddClass />,
  'classes-sections': <SectionManagement />,

  'subjects-list': <SubjectList />,
  'subjects-assign': <AddSubject />,

  'students-list': <StudentList />,
  'students-add': <AddStudent />,
  'students-admissions': <StudentProfile />,
  'students-promote': <EditStudent />,
  'students-id-cards': <IDCardGenerator />,

  'employees-list': <StaffList />,
  'employees-add': <AddStaff />,
  'employees-departments': <StaffProfile />,
  'employees-designations': <EditStaff />,

  'accounts-income': <FeeReports />,
  'accounts-expense': <FeeReports />,
  'accounts-bank': <FeeManagement />,

  'fees-structure': <FeeStructure />,
  'fees-collection': <FeeManagement />,
  'fees-reports': <FeeReports />,

  'salary-structure': <ModulePlaceholder title="Salary Structure" description="Define pay grades and salary components. This module is wired into the navigation and ready for its data screens." />,
  'salary-pay': <FeeManagement />,
  'salary-reports': <FeeReports />,

  'attendance-students': <AttendanceReport />,
  'attendance-staff': <AttendanceReport />,

  'timetable-class': <TimetableManager />,
  'timetable-teacher': <TeacherTimetable />,

  homework: <HomeworkList />,
  behaviour: <ReportGenerator />,

  'store-products': <ModulePlaceholder title="Products" description="Manage store products for your front-office point of sale. This module is wired into the navigation and ready for its data screens." />,
  'store-orders': <ReportGenerator />,
  'store-pos': <FeeManagement />,

  whatsapp: <NotificationSettings />,
  messaging: <AnnouncementList />,

  'sms-send': <AnnouncementList />,
  'sms-templates': <AnnouncementList />,
  'sms-logs': <ReportGenerator />,

  'live-class': <TimetableManager />,

  'question-paper-create': <ExamSchedule />,
  'question-paper-bank': <ExamSchedule />,

  'exams-schedule': <ExamSchedule />,
  'exams-marks': <ResultManagement />,
  'exams-results': <ResultManagement />,

  'class-tests-schedule': <ExamSchedule />,
  'class-tests-marks': <ResultManagement />,

  'reports-attendance': <AttendanceReport />,
  'reports-fee': <FeeReports />,
  'reports-exam': <ReportGenerator />,

  'certificates-templates': <CertificateTemplates />,
  'certificates-generate': <GenerateCertificate />,
}

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const { user } = useAuth()

  return (
    <AdminLayout
      active={active}
      onNavigate={setActive}
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
