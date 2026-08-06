import { useEffect, useMemo, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { studentApi } from '../../../api/studentApi'
import { resultApi } from '../../../api/resultApi'
import { attendanceApi } from '../../../api/attendanceApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function StudentProgress() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const subjects = user?.staff?.subjects || []

  const myClasses = useMemo(() => {
    const map = new Map()
    subjects.forEach((s) => { if (s.classId) map.set(s.classId, s.class) })
    return Array.from(map.entries()).map(([id, klass]) => ({ id, klass }))
  }, [subjects])

  const [classId, setClassId] = useState('')
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [results, setResults] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState({})

  useEffect(() => {
    if (myClasses.length && !classId) setClassId(myClasses[0].id)
  }, [myClasses])

  useEffect(() => {
    if (!classId) return
    studentApi.list({ classId, limit: 100 })
      .then((res) => {
        const rows = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        setStudents(rows)
        if (rows.length) setStudentId(rows[0].id)
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load students.'), 'error'))
  }, [classId])

  useEffect(() => {
    if (!studentId) return
    const now = new Date()
    Promise.all([
      resultApi.byStudent(studentId),
      attendanceApi.byStudent(studentId, { month: now.getMonth() + 1, year: now.getFullYear() }),
    ])
      .then(([resultsRes, attendanceRes]) => {
        setResults(Array.isArray(resultsRes.data) ? resultsRes.data : [])
        setAttendanceSummary(attendanceRes.data?.summary || {})
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load progress.'), 'error'))
  }, [studentId])

  if (!myClasses.length) {
    return <div className="card p-6 text-sm text-ink-soft">You have no classes assigned yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Student progress</p>
              <p className="mt-1 text-sm text-ink-soft">Exam results and this month's attendance for one student.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select label="Class" value={classId} onChange={(e) => setClassId(e.target.value)} options={myClasses.map((c) => ({ value: c.id, label: `${c.klass?.name} ${c.klass?.section}` }))} />
            <Select label="Student" value={studentId} onChange={(e) => setStudentId(e.target.value)} options={students.map((s) => ({ value: s.id, label: s.user?.name || s.id }))} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {['PRESENT', 'ABSENT', 'LATE', 'LEAVE'].map((status) => (
          <div key={status} className="card p-4">
            <p className="text-2xl font-semibold text-ink">{attendanceSummary[status] || 0}</p>
            <p className="mt-1 text-sm text-ink-soft">{status} (this month)</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Exam</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Marks</th>
              <th className="px-5 py-3">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {results.map((r) => (
              <tr key={r.id} className="bg-white/70">
                <td className="px-5 py-3.5 font-medium text-ink">{r.exam?.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">{r.subject?.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">{r.marks}/{r.maxMarks}</td>
                <td className="px-5 py-3.5 text-ink-soft">{r.grade}</td>
              </tr>
            ))}
            {!results.length && (
              <tr><td colSpan={4} className="px-5 py-6 text-center text-sm text-ink-soft">No exam results recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
