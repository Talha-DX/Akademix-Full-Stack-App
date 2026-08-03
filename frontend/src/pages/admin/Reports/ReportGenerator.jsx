import { useEffect, useState } from 'react'
import { FileBarChart, RefreshCw } from 'lucide-react'
import { reportApi } from '../../../api/reportApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function ReportGenerator() {
  const { notify } = useNotificationContext()
  const [academic, setAcademic] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [financial, setFinancial] = useState(null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadReports = async () => {
    setLoading(true)
    try {
      const [acadRes, attRes, finRes, studRes] = await Promise.all([
        reportApi.academic(),
        reportApi.attendance(),
        reportApi.financial(),
        reportApi.student(),
      ])
      setAcademic(acadRes.data)
      setAttendance(attRes.data)
      setFinancial(finRes.data)
      setStudent(studRes.data)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to fetch reports data.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold text-ink">Report Center</p>
          <p className="mt-1 text-sm text-ink-soft">Real-time aggregate analytics generated from your Postgres database.</p>
        </div>
        <button onClick={loadReports} disabled={loading} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 flex items-center gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing…' : 'Refresh Metrics'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <FileBarChart size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Academic Overview</p>
              <p className="text-sm text-ink-soft">Exams and Performance</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Total Exams Scheduled</span>
              <span className="font-semibold text-ink">{academic?.totalExams ?? '—'}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Results Recorded</span>
              <span className="font-semibold text-ink">{academic?.totalResultsRecorded ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Average Marks %</span>
              <span className="font-semibold text-ink">{academic?.averagePercentage ?? 0}%</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <FileBarChart size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Attendance Summary</p>
              <p className="text-sm text-ink-soft">Presence and Rates</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Total Records Marked</span>
              <span className="font-semibold text-ink">{attendance?.totalMarked ?? '—'}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Present / Absent</span>
              <span className="font-semibold text-ink">{attendance?.present ?? 0} / {attendance?.absent ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Overall Attendance Rate</span>
              <span className="font-semibold text-ink">{attendance?.attendanceRatePercentage ?? 100}%</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <FileBarChart size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Financial Ledger</p>
              <p className="text-sm text-ink-soft">Billing & Collections</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Total Billed</span>
              <span className="font-semibold text-ink">${(financial?.totalBilled ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Total Collected</span>
              <span className="font-semibold text-brand-600">${(financial?.totalPaid ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Total Pending</span>
              <span className="font-semibold text-coral-600">${(financial?.totalPending ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-50 p-3 text-purple-700">
              <FileBarChart size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Students & Enrolment</p>
              <p className="text-sm text-ink-soft">Class Distribution</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Total Enrolled Students</span>
              <span className="font-semibold text-ink">{student?.totalStudents ?? '—'}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2 text-sm">
              <span className="text-ink-soft">Total Active Classes</span>
              <span className="font-semibold text-ink">{student?.totalClasses ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
