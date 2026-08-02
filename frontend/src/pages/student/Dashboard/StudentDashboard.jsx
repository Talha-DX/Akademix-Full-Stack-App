import { useEffect, useState } from 'react'
import { BookOpen, CalendarCheck, Award, ClipboardList } from 'lucide-react'
import StudentLayout from '../../../components/common/Layout/StudentLayout'
import DashboardStats from '../../../components/charts/DashboardStats'
import { dashboardApi } from '../../../api/dashboardApi'
import { timetableApi } from '../../../api/timetableApi'
import { homeworkApi } from '../../../api/homeworkApi'
import { useAuth } from '../../../hooks/useAuth'

import MyAttendance from '../Attendance/MyAttendance'
import MyTimetable from '../Timetable/MyTimetable'
import MyHomework from '../Homework/MyHomework'
import SubmitHomework from '../Homework/SubmitHomework'
import MyExams from '../Exams/MyExams'
import MyResults from '../Exams/MyResults'
import MyFees from '../Fees/MyFees'
import FeePayment from '../Fees/FeePayment'
import MyCertificates from '../Certificates/MyCertificates'
import StudentProfile from '../Profile/StudentProfile'

function Overview() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [timetable, setTimetable] = useState([])
  const [homework, setHomework] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const classId = user?.student?.classId
    Promise.all([
      dashboardApi.stats(),
      classId ? timetableApi.list({ classId }) : Promise.resolve({ data: [] }),
      classId ? homeworkApi.list({ classId }) : Promise.resolve({ data: [] }),
    ]).then(([stats, schedule, assignments]) => {
      setData(stats.data); setTimetable(schedule.data); setHomework(assignments.data)
    }).catch(() => setError('Your dashboard data could not be loaded.'))
  }, [user?.student?.classId])
  if (error) return <div className="card p-6 text-sm text-coral-600">{error}</div>
  if (!data) return <div className="card p-6 text-sm text-ink-soft">Loading dashboard…</div>
  return (
    <div className="space-y-8">
      <DashboardStats
        items={[
          { label: 'Present days', value: data.attendanceCount ?? 0, icon: CalendarCheck },
          { label: 'Pending homework', value: data.homeworkPending ?? 0, icon: ClipboardList },
          { label: 'Recent results', value: data.recentResults?.length ?? 0, icon: Award },
          { label: 'Invoices due', value: data.feesDue ?? 0, icon: BookOpen },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-ink">Today's timetable</p>
          <div className="mt-5 space-y-2">
            {timetable.length ? timetable.map((t) => (
              <div key={t.id} className="flex items-center gap-4 rounded-lg bg-surface-tint px-3 py-2.5 text-sm">
                <span className="font-mono text-xs text-ink-soft">{t.day} · {t.period}</span>
                <span className="font-medium text-ink">{t.subject?.name}</span>
              </div>
            )) : <p className="text-sm text-ink-soft">No timetable entries are available.</p>}
          </div>
        </div>
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-ink">Homework</p>
          <div className="mt-5 space-y-3">
            {homework.length ? homework.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg bg-surface-tint px-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-ink">{h.title}</p>
                  <p className="text-xs text-ink-soft">{h.subject?.name}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    'bg-coral-500/10 text-coral-600'
                  }`}
                >
                  Due {new Date(h.dueDate).toLocaleDateString()}
                </span>
              </div>
            )) : <p className="text-sm text-ink-soft">No homework has been assigned.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const sections = {
  overview: <Overview />,
  attendance: <MyAttendance />,
  timetable: <MyTimetable />,
  homework: <MyHomework />,
  'submit-homework': <SubmitHomework />,
  exams: <MyExams />,
  results: <MyResults />,
  fees: <MyFees />,
  'fee-payment': <FeePayment />,
  certificates: <MyCertificates />,
  profile: <StudentProfile />,
}

export default function StudentDashboard() {
  const [active, setActive] = useState('overview')
  const { user } = useAuth()

  return (
    <StudentLayout
      active={active}
      onNavigate={setActive}
      userName={user?.name ?? ''}
      userMeta={user?.student?.class ? `${user.student.class.name} - ${user.student.class.section}` : 'Student'}
    >
      {sections[active] ?? <Overview />}
    </StudentLayout>
  )
}
