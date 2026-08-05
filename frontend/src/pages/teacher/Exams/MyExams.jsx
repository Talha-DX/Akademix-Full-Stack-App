import { useEffect, useMemo, useState } from 'react'
import { Award } from 'lucide-react'
import { examApi } from '../../../api/examApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function MyExams() {
  const { user } = useAuth(); const { notify } = useNotificationContext(); const [exams, setExams] = useState([])
  const classIds = useMemo(() => [...new Set(user?.staff?.subjects?.map((subject) => subject.classId) || [])], [user])
  useEffect(() => { if (!classIds.length) { setExams([]); return }; Promise.all(classIds.map((classId) => examApi.list({ classId }))).then((rows) => setExams(rows.flatMap(({ data }) => Array.isArray(data) ? data : []))).catch((error) => notify(getApiErrorMessage(error, 'Failed to load exams.'), 'error')) }, [classIds.join(','), notify])
  return <div className="space-y-6"><div className="card p-6"><div className="flex items-center gap-3"><div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Award size={18}/></div><div><p className="font-display text-xl font-semibold text-ink">My exams</p><p className="mt-1 text-sm text-ink-soft">Exams for your assigned classes.</p></div></div></div><div className="card overflow-hidden"><table className="min-w-full text-left text-sm"><thead className="bg-surface-tint text-xs uppercase text-ink-soft"><tr><th className="px-5 py-3">Exam</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Term</th><th className="px-5 py-3">Start date</th></tr></thead><tbody className="divide-y divide-line">{exams.map((exam) => <tr key={exam.id}><td className="px-5 py-3 font-medium">{exam.name}</td><td className="px-5 py-3">{exam.class?.name} {exam.class?.section}</td><td className="px-5 py-3">{exam.term}</td><td className="px-5 py-3">{exam.startDate ? new Date(exam.startDate).toLocaleDateString() : '—'}</td></tr>)}{!exams.length && <tr><td colSpan={4} className="px-5 py-6 text-center text-ink-soft">No exams scheduled for your classes.</td></tr>}</tbody></table></div></div>
}
