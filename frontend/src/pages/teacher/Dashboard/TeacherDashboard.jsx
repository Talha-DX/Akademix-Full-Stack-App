import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarClock, ClipboardList, Users2, CheckCircle2 } from 'lucide-react'
import TeacherLayout from '../../../components/common/Layout/TeacherLayout'
import DashboardStats from '../../../components/charts/DashboardStats'
import { dashboardApi } from '../../../api/dashboardApi'
import { useAuth } from '../../../hooks/useAuth'
import { announcementApi } from '../../../api/announcementApi'

import MarkAttendance from '../Attendance/MarkAttendance'
import MyTimetable from '../Timetable/MyTimetable'
import CreateHomework from '../Homework/CreateHomework'
import MyHomework from '../Homework/MyHomework'
import CheckSubmissions from '../Homework/CheckSubmissions'
import MyExams from '../Exams/MyExams'
import EnterMarks from '../Exams/EnterMarks'
import MyStudents from '../Students/MyStudents'
import StudentProgress from '../Students/StudentProgress'
import TeacherProfile from '../Profile/TeacherProfile'
import AccountSettings from '../../../components/common/AccountSettings'

function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [announcements, setAnnouncements] = useState([])
  useEffect(() => { Promise.all([dashboardApi.stats(), announcementApi.list()]).then(([{ data: response }, notices]) => { setData(response); setAnnouncements(notices.data || []) }).catch(() => setError('Dashboard data could not be loaded.')) }, [])
  if (error) return <div className="card p-6 text-sm text-coral-600">{error}</div>
  if (!data) return <div className="card p-6 text-sm text-ink-soft">Loading dashboard…</div>
  return (
    <div className="space-y-8">
      <DashboardStats
        items={[
          { label: 'Classes assigned', value: data.classesTaught ?? 0, icon: CalendarClock },
          { label: 'Homework assigned', value: data.homeworkCount ?? 0, icon: ClipboardList },
          { label: 'Timetable entries', value: data.timetableToday?.length ?? 0, icon: Users2 },
          { label: 'Schedule status', value: data.timetableToday?.length ? 'Ready' : 'None', icon: CheckCircle2 },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-ink">Today's schedule</p>
          <div className="mt-5 space-y-3">
            {data.timetableToday?.length ? data.timetableToday.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-surface-tint px-3 py-2.5 text-sm">
                <span className="text-ink-soft">{s.day} · Period {s.period}</span>
                <span className="font-medium text-ink">{s.class?.name} {s.class?.section} · {s.subject?.name}</span>
              </div>
            )) : <p className="text-sm text-ink-soft">No timetable entries are available.</p>}
          </div>
        </div>
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-ink">Teaching workload</p>
          <div className="mt-5 space-y-3">
            <p className="text-sm text-ink-soft">You have assigned {data.homeworkCount ?? 0} homework item{data.homeworkCount === 1 ? '' : 's'} across your subjects.</p>
          </div>
        </div>
      </div>
      <div className="card p-6"><p className="font-display text-base font-semibold text-ink">Announcements</p><div className="mt-4 space-y-3">{announcements.length ? announcements.map((notice) => <div key={notice.id} className="rounded-lg bg-surface-tint px-3 py-2.5"><p className="text-sm font-medium text-ink">{notice.title}</p><p className="mt-1 text-sm text-ink-soft">{notice.body}</p></div>) : <p className="text-sm text-ink-soft">No announcements for you.</p>}</div></div>
    </div>
  )
}

const sections = {
  overview: <Overview />,
  'mark-attendance': <MarkAttendance />,
  timetable: <MyTimetable />,
  'create-homework': <CreateHomework />,
  homework: <MyHomework />,
  'check-submissions': <CheckSubmissions />,
  exams: <MyExams />,
  'enter-marks': <EnterMarks />,
  'my-students': <MyStudents />,
  'student-progress': <StudentProgress />,
  profile: <TeacherProfile />,
  'account-settings': <AccountSettings />,
}

export default function TeacherDashboard() {
  const { section } = useParams()
  const navigate = useNavigate()
  const [active, setActive] = useState(section || 'overview')
  const { user } = useAuth()
  useEffect(() => { setActive(section || 'overview') }, [section])
  const handleNavigate = (nextSection) => {
    setActive(nextSection)
    navigate(nextSection === 'overview' ? '/teacher' : `/teacher/${nextSection}`)
  }

  return (
    <TeacherLayout
      active={active}
      onNavigate={handleNavigate}
      userName={user?.name ?? ''}
      userMeta={user?.staff?.designation ?? 'Teacher'}
    >
      {sections[active] ?? <Overview />}
    </TeacherLayout>
  )
}
