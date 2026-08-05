import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { attendanceApi } from '../../../api/attendanceApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }) }))
const STATUS_STYLES = {
  PRESENT: 'bg-brand-50 text-brand-700',
  ABSENT: 'bg-coral-50 text-coral-600',
  LATE: 'bg-amber-500/10 text-amber-600',
  LEAVE: 'bg-slate-200 text-slate-600',
}

export default function MyAttendance() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState({})
  const studentId = user?.student?.id

  useEffect(() => {
    if (!studentId) return
    attendanceApi.byStudent(studentId, { month, year })
      .then((res) => {
        setRecords(res.data?.records || [])
        setSummary(res.data?.summary || {})
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load your attendance.'), 'error'))
  }, [studentId, month, year])

  if (!studentId) {
    return <div className="card p-6 text-sm text-ink-soft">Your student profile could not be found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <CalendarCheck size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">My attendance</p>
              <p className="mt-1 text-sm text-ink-soft">Your recorded attendance for the selected month.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Select label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))} options={MONTHS} />
            <Select label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} options={[year - 1, year, year + 1].map((y) => ({ value: y, label: y }))} />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {['PRESENT', 'ABSENT', 'LATE', 'LEAVE'].map((status) => (
            <div key={status} className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{summary[status] || 0}</p>
              <p className="mt-1 text-sm text-ink-soft">{status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.map((r) => (
                <tr key={r.id} className="bg-white/70">
                  <td className="px-5 py-3.5 text-ink">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.status] || 'bg-surface-tint text-ink-soft'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!records.length && (
                <tr><td colSpan={2} className="px-5 py-6 text-center text-sm text-ink-soft">No attendance records for this month.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
