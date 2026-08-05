import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { homeworkApi } from '../../../api/homeworkApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'
import { fileUrl } from '../../../utils/fileUrl'

export default function MyHomework() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [homework, setHomework] = useState([])
  const classId = user?.student?.classId

  useEffect(() => {
    if (!classId) return
    homeworkApi.list({ classId })
      .then((res) => setHomework(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load homework.'), 'error'))
  }, [classId])

  if (!classId) {
    return <div className="card p-6 text-sm text-ink-soft">You are not enrolled in a class yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <ClipboardList size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">My homework</p>
            <p className="mt-1 text-sm text-ink-soft">Assignments for your class, straight from the database.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {homework.map((h) => {
          const mine = h.submissions?.find((s) => s.studentId === user?.student?.id)
          return (
            <div key={h.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{h.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{h.subject?.name}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${mine ? 'bg-brand-50 text-brand-700' : 'bg-coral-50 text-coral-600'}`}>
                  {mine ? (mine.grade ? `Graded: ${mine.grade}` : 'Submitted') : 'Not submitted'}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{h.description}</p>
              {h.attachment && <a href={fileUrl(h.attachment)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-brand-700 underline">Open attachment</a>}
              <p className="mt-3 text-xs font-mono uppercase tracking-wide text-ink-soft">Due {new Date(h.dueDate).toLocaleDateString()}</p>
              {mine?.feedback && <p className="mt-2 rounded-lg bg-surface-tint px-3 py-2 text-xs text-ink-soft">Feedback: {mine.feedback}</p>}
            </div>
          )
        })}
        {!homework.length && <p className="text-sm text-ink-soft">No homework has been assigned yet.</p>}
      </div>
    </div>
  )
}
