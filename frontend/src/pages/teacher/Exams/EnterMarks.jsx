import { useEffect, useMemo, useState } from 'react'
import { PencilLine } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { examApi } from '../../../api/examApi'
import { resultApi } from '../../../api/resultApi'
import { studentApi } from '../../../api/studentApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function EnterMarks() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const subjects = user?.staff?.subjects || []

  const classIds = useMemo(() => {
    const set = new Set()
    subjects.forEach((s) => { if (s.classId) set.add(s.classId) })
    return Array.from(set)
  }, [subjects])

  const [exams, setExams] = useState([])
  const [examId, setExamId] = useState('')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [maxMarks, setMaxMarks] = useState(100)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!classIds.length) return
    Promise.all(classIds.map((id) => examApi.list({ classId: id })))
      .then((results) => {
        const rows = results.flatMap((r) => (Array.isArray(r.data) ? r.data : []))
        setExams(rows)
        if (rows.length && !examId) setExamId(rows[0].id)
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load exams.'), 'error'))
  }, [classIds.join(',')])

  const selectedExam = exams.find((e) => e.id === examId)

  useEffect(() => {
    if (!selectedExam) return
    studentApi.list({ classId: selectedExam.classId, limit: 100 })
      .then((res) => {
        const rows = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        setStudents(rows)
        setMarks(Object.fromEntries(rows.map((s) => [s.id, ''])))
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load students.'), 'error'))
  }, [selectedExam?.classId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!examId || !subjectId) return
    setSubmitting(true)
    try {
      const results = students
        .filter((s) => marks[s.id] !== '' && marks[s.id] != null)
        .map((s) => ({ examId, subjectId, studentId: s.id, marks: Number(marks[s.id]), maxMarks: Number(maxMarks) }))
      await resultApi.bulkCreate({ results })
      notify('Marks saved.', 'success')
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save marks.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!classIds.length) {
    return <div className="card p-6 text-sm text-ink-soft">You have no classes assigned yet.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <PencilLine size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Enter marks</p>
              <p className="mt-1 text-sm text-ink-soft">Marks are upserted directly against exam results in the database.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select label="Exam" value={examId} onChange={(e) => setExamId(e.target.value)} options={exams.map((e) => ({ value: e.id, label: `${e.name} · ${e.class?.name}${e.class?.section}` }))} />
            <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Max marks</span>
              <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} className="w-24 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
            </label>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {students.map((s) => (
              <tr key={s.id} className="bg-white/70">
                <td className="px-5 py-3.5 font-medium text-ink">{s.user?.name}</td>
                <td className="px-5 py-3.5">
                  <input
                    type="number"
                    value={marks[s.id] ?? ''}
                    onChange={(e) => setMarks((c) => ({ ...c, [s.id]: e.target.value }))}
                    className="w-24 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
                  />
                </td>
              </tr>
            ))}
            {!students.length && (
              <tr><td colSpan={2} className="px-5 py-6 text-center text-sm text-ink-soft">Select an exam to load its class roster.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting || !students.length} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
          {submitting ? 'Saving…' : 'Save marks'}
        </button>
      </div>
    </form>
  )
}
