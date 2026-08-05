import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { homeworkApi } from '../../../api/homeworkApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'
import { fileUrl } from '../../../utils/fileUrl'

export default function CheckSubmissions() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const subjects = user?.staff?.subjects || []
  const subjectIds = useMemo(() => subjects.map((s) => s.id), [subjects])

  const [homework, setHomework] = useState([])
  const [homeworkId, setHomeworkId] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [grades, setGrades] = useState({})
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    if (!subjectIds.length) return
    Promise.all(subjectIds.map((id) => homeworkApi.list({ subjectId: id })))
      .then((results) => {
        const rows = results.flatMap((r) => (Array.isArray(r.data) ? r.data : []))
        setHomework(rows)
        if (rows.length && !homeworkId) setHomeworkId(rows[0].id)
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load homework.'), 'error'))
  }, [subjectIds.join(',')])

  const loadSubmissions = () => {
    if (!homeworkId) return
    homeworkApi.submissions(homeworkId)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : []
        setSubmissions(rows)
        setGrades(Object.fromEntries(rows.map((s) => [s.id, { grade: s.grade || '', feedback: s.feedback || '' }])))
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load submissions.'), 'error'))
  }

  useEffect(() => { loadSubmissions() }, [homeworkId])

  const handleGrade = async (submissionId) => {
    setSavingId(submissionId)
    try {
      await homeworkApi.grade(submissionId, grades[submissionId])
      notify('Grade saved.', 'success')
      loadSubmissions()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save grade.'), 'error')
    } finally {
      setSavingId(null)
    }
  }

  if (!homework.length) {
    return <div className="card p-6 text-sm text-ink-soft">You haven't assigned any homework yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Check submissions</p>
              <p className="mt-1 text-sm text-ink-soft">Grade real student submissions, saved to the database.</p>
            </div>
          </div>
          <div className="w-72">
            <Select label="Homework" value={homeworkId} onChange={(e) => setHomeworkId(e.target.value)} options={homework.map((h) => ({ value: h.id, label: h.title }))} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium text-ink">{s.student?.user?.name}</p>
              <p className="text-xs text-ink-soft">Submitted {new Date(s.submittedAt).toLocaleString()}</p>
              {s.fileUrl && <a href={fileUrl(s.fileUrl)} target="_blank" rel="noreferrer" className="text-xs text-brand-600 underline">View attachment</a>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                placeholder="Grade"
                value={grades[s.id]?.grade || ''}
                onChange={(e) => setGrades((c) => ({ ...c, [s.id]: { ...c[s.id], grade: e.target.value } }))}
                className="w-24 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <input
                placeholder="Feedback"
                value={grades[s.id]?.feedback || ''}
                onChange={(e) => setGrades((c) => ({ ...c, [s.id]: { ...c[s.id], feedback: e.target.value } }))}
                className="w-48 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <button onClick={() => handleGrade(s.id)} disabled={savingId === s.id} className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60">
                {savingId === s.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
        {!submissions.length && <p className="card p-6 text-sm text-ink-soft">No submissions yet for this homework.</p>}
      </div>
    </div>
  )
}
