import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { attendanceApi } from '../../../api/attendanceApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const STATUS_STYLES = {
  PRESENT: 'bg-brand-50 text-brand-700',
  ABSENT: 'bg-coral-50 text-coral-600',
  LATE: 'bg-amber-500/10 text-amber-600',
  LEAVE: 'bg-slate-200 text-slate-600',
}

export default function ClassAttendance() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()

  const myClasses = useMemo(() => {
    const subjects = user?.staff?.subjects || []
    const map = new Map()
    subjects.forEach((s) => { if (s.classId) map.set(s.classId, s.class) })
    return Array.from(map.entries()).map(([id, klass]) => ({ id, klass }))
  }, [user])

  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (myClasses.length && !classId) setClassId(myClasses[0].id)
  }, [myClasses])

  useEffect(() => {
    if (!classId) return
    attendanceApi.list({ classId, date })
      .then((res) => setRecords(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load attendance.'), 'error'))
  }, [classId, date])

  if (!myClasses.length) {
    return <div className="card p-6 text-sm text-ink-soft">You have no classes assigned yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Class attendance</p>
              <p className="mt-1 text-sm text-ink-soft">Attendance already recorded for a class on a given date.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Select
              label="Class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              options={myClasses.map((c) => ({ value: c.id, label: `${c.klass?.name} ${c.klass?.section}` }))}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.map((r) => (
                <tr key={r.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-medium text-ink">{r.student?.user?.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.status] || 'bg-surface-tint text-ink-soft'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!records.length && (
                <tr><td colSpan={2} className="px-5 py-6 text-center text-sm text-ink-soft">No attendance recorded for this date yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
