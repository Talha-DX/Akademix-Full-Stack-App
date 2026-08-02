import { useEffect, useMemo, useState } from 'react'
import { ContactRound } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { studentApi } from '../../../api/studentApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage, normalizeStudent } from '../../../utils/adminPeople'

export default function StudentDetails() {
  const { notify } = useNotificationContext()
  const [students, setStudents] = useState([])
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data } = await studentApi.list({ page: 1, limit: 300 })
        const nextStudents = (data?.data || []).map(normalizeStudent)
        setStudents(nextStudents)
        setSelectedId(nextStudents[0]?.id || '')
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to load student details.'), 'error')
      }
    }
    loadStudents()
  }, [])

  const selected = useMemo(
    () => students.find((item) => item.id === selectedId) || null,
    [selectedId, students]
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><ContactRound size={18} /></div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Student details</p>
            <p className="mt-1 text-sm text-ink-soft">View profile-level details from your live data.</p>
          </div>
        </div>
        <div className="mt-6">
          <Select
            label="Choose student"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            options={students.map((item) => ({ value: item.id, label: `${item.name} (${item.admissionNo})` }))}
          />
        </div>
      </div>
      <div className="card p-6">
        {selected ? (
          <div className="space-y-4">
            <p className="font-display text-xl font-semibold text-ink">{selected.name}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-xs uppercase tracking-wide text-ink-soft">Admission No</p><p className="mt-1 font-semibold text-ink">{selected.admissionNo}</p></div>
              <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-xs uppercase tracking-wide text-ink-soft">Class</p><p className="mt-1 font-semibold text-ink">{selected.className} · {selected.section}</p></div>
              <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-xs uppercase tracking-wide text-ink-soft">Email</p><p className="mt-1 font-semibold text-ink">{selected.email}</p></div>
              <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-xs uppercase tracking-wide text-ink-soft">Phone</p><p className="mt-1 font-semibold text-ink">{selected.phone || 'N/A'}</p></div>
              <div className="rounded-2xl border border-line bg-surface-tint p-4 sm:col-span-2"><p className="text-xs uppercase tracking-wide text-ink-soft">Date of birth</p><p className="mt-1 font-semibold text-ink">{selected.dob}</p></div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-soft">No student selected.</p>
        )}
      </div>
    </div>
  )
}
