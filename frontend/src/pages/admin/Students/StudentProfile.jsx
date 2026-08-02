import { useEffect, useMemo, useState } from 'react'
import { ClipboardPlus, Search } from 'lucide-react'
import { studentApi } from '../../../api/studentApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage, normalizeStudent } from '../../../utils/adminPeople'

export default function StudentProfile() {
  const { notify } = useNotificationContext()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true)
      try {
        const { data } = await studentApi.list({ page: 1, limit: 400 })
        setStudents((data?.data || []).map(normalizeStudent))
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to load admissions overview.'), 'error')
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return students
    return students.filter((item) =>
      [item.name, item.email, item.admissionNo, item.className].join(' ').toLowerCase().includes(term)
    )
  }, [students, query])

  const classSummary = useMemo(() => {
    const map = new Map()
    students.forEach((item) => {
      const key = `${item.className} · ${item.section}`
      map.set(key, (map.get(key) || 0) + 1)
    })
    return [...map.entries()]
  }, [students])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <ClipboardPlus size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Admissions overview</p>
            <p className="mt-1 text-sm text-ink-soft">Real-time admission roster grouped by classes.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface-tint p-4">
            <p className="text-2xl font-semibold text-ink">{students.length}</p>
            <p className="mt-1 text-sm text-ink-soft">Total admissions</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface-tint p-4">
            <p className="text-2xl font-semibold text-ink">{classSummary.length}</p>
            <p className="mt-1 text-sm text-ink-soft">Classes with students</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface-tint p-4">
            <p className="text-2xl font-semibold text-ink">{students.filter((s) => s.phone).length}</p>
            <p className="mt-1 text-sm text-ink-soft">Profiles with phone</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search admissions" className="w-full bg-transparent outline-none" />
        </label>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classSummary.map(([classLabel, count]) => (
            <div key={classLabel} className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="font-semibold text-ink">{classLabel}</p>
              <p className="text-sm text-ink-soft">{count} admissions</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Admission no.</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">DOB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={4}>Loading admissions…</td></tr>
              ) : filtered.length ? (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white/70">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-ink-soft">{item.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.admissionNo}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.className} · {item.section}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.dob}</td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={4}>No admissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
