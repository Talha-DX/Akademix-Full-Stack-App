import { useEffect, useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { homeworkApi } from '../../../api/homeworkApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'
import { fileUrl } from '../../../utils/fileUrl'

export default function MyHomework() {
  const { user } = useAuth(); const { notify } = useNotificationContext(); const [homework, setHomework] = useState([])
  const subjectIds = useMemo(() => user?.staff?.subjects?.map((subject) => subject.id) || [], [user])
  useEffect(() => { if (!subjectIds.length) { setHomework([]); return }; Promise.all(subjectIds.map((subjectId) => homeworkApi.list({ subjectId }))).then((rows) => setHomework(rows.flatMap(({ data }) => Array.isArray(data) ? data : []))).catch((error) => notify(getApiErrorMessage(error, 'Failed to load homework.'), 'error')) }, [subjectIds.join(','), notify])
  return <div className="space-y-6"><div className="card p-6"><div className="flex items-center gap-3"><div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><ClipboardList size={18}/></div><div><p className="font-display text-xl font-semibold text-ink">My homework</p><p className="mt-1 text-sm text-ink-soft">Assignments for subjects assigned to you.</p></div></div></div><div className="grid gap-4 md:grid-cols-2">{homework.map((item) => <div key={item.id} className="card p-5"><p className="font-semibold text-ink">{item.title}</p><p className="mt-1 text-sm text-ink-soft">{item.class?.name} {item.class?.section} · {item.subject?.name}</p><p className="mt-3 text-sm text-ink-soft">{item.description}</p>{item.attachment && <a href={fileUrl(item.attachment)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-brand-700 underline">Open attachment</a>}<p className="mt-3 text-xs text-ink-soft">Due {new Date(item.dueDate).toLocaleDateString()}</p></div>)}{!homework.length && <p className="text-sm text-ink-soft">No homework assigned for your subjects yet.</p>}</div></div>
}
