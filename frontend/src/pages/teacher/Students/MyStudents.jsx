import { useEffect, useMemo, useState } from 'react'
import { Users2 } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { studentApi } from '../../../api/studentApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function MyStudents() {
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

  useEffect(() => {
    if (myClasses.length && !classId) setClassId(myClasses[0].id)
  }, [myClasses])

  useEffect(() => {
    if (!classId) return
    studentApi.list({ classId, limit: 100 })
      .then((res) => setStudents(res.data?.data || (Array.isArray(res.data) ? res.data : [])))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load students.'), 'error'))
  }, [classId])

  if (!myClasses.length) {
    return <div className="card p-6 text-sm text-ink-soft">You have no classes assigned yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <Users2 size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">My students</p>
              <p className="mt-1 text-sm text-ink-soft">Roster for the classes you teach.</p>
            </div>
          </div>
          <div className="w-64">
            <Select label="Class" value={classId} onChange={(e) => setClassId(e.target.value)} options={myClasses.map((c) => ({ value: c.id, label: `${c.klass?.name} ${c.klass?.section}` }))} />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Admission No.</th>
              <th className="px-5 py-3">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {students.map((s) => (
              <tr key={s.id} className="bg-white/70">
                <td className="px-5 py-3.5 font-medium text-ink">{s.user?.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">{s.admissionNo}</td>
                <td className="px-5 py-3.5 text-ink-soft">{s.user?.email}</td>
              </tr>
            ))}
            {!students.length && (
              <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-ink-soft">No students in this class.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
