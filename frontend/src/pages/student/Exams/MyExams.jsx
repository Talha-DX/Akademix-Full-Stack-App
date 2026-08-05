import { useEffect, useState } from 'react'
import { Award } from 'lucide-react'
import { examApi } from '../../../api/examApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function MyExams() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [exams, setExams] = useState([])
  const classId = user?.student?.classId

  useEffect(() => {
    if (!classId) return
    examApi.list({ classId })
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load exams.'), 'error'))
  }, [classId])

  if (!classId) {
    return <div className="card p-6 text-sm text-ink-soft">You are not enrolled in a class yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <Award size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">My exams</p>
            <p className="mt-1 text-sm text-ink-soft">Exams scheduled for your class.</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Exam</th>
              <th className="px-5 py-3">Term</th>
              <th className="px-5 py-3">Start date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {exams.map((e) => (
              <tr key={e.id} className="bg-white/70">
                <td className="px-5 py-3.5 font-medium text-ink">{e.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">{e.term}</td>
                <td className="px-5 py-3.5 text-ink-soft">{e.startDate ? new Date(e.startDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
            {!exams.length && (
              <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-ink-soft">No exams scheduled yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
