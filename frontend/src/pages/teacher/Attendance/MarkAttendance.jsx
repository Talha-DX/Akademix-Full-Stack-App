import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck2 } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { attendanceApi } from '../../../api/attendanceApi'
import { studentApi } from '../../../api/studentApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'LEAVE']

export default function MarkAttendance() {
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
  const [students, setStudents] = useState([])
  const [statuses, setStatuses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (myClasses.length && !classId) setClassId(myClasses[0].id)
  }, [myClasses])

  useEffect(() => {
    if (!classId) return
    setSaved(false)
    studentApi.list({ classId, limit: 100 })
      .then((res) => {
        const rows = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        setStudents(rows)
        setStatuses(Object.fromEntries(rows.map((s) => [s.id, 'PRESENT'])))
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load students.'), 'error'))
  }, [classId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setSaved(false)
    try {
      await attendanceApi.mark({
        classId,
        date,
        records: students.map((s) => ({ studentId: s.id, status: statuses[s.id] || 'PRESENT' })),
      })
      setSaved(true)
      notify('Attendance saved.', 'success')
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save attendance.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!myClasses.length) {
    return <div className="card p-6 text-sm text-ink-soft">You have no classes assigned yet.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <CalendarCheck2 size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Mark attendance</p>
              <p className="mt-1 text-sm text-ink-soft">Saved directly to the database — visible immediately in reports.</p>
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
        {saved && (
          <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            Attendance for {date} saved successfully.
          </div>
        )}
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
              {students.map((student) => (
                <tr key={student.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-medium text-ink">{student.user?.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {STATUSES.map((status) => (
                        <button
                          type="button"
                          key={status}
                          onClick={() => setStatuses((c) => ({ ...c, [student.id]: status }))}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            statuses[student.id] === status
                              ? status === 'PRESENT' ? 'bg-brand-600 text-white'
                              : status === 'ABSENT' ? 'bg-coral-600 text-white'
                              : 'bg-amber-500 text-white'
                              : 'bg-surface-tint text-ink-soft'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {!students.length && (
                <tr><td colSpan={2} className="px-5 py-6 text-center text-sm text-ink-soft">No students in this class.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting || !students.length} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
          {submitting ? 'Saving…' : 'Save attendance'}
        </button>
      </div>
    </form>
  )
}
