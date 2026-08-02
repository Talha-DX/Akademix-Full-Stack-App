import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, Save } from 'lucide-react'
import Select from '../../../components/forms/Select'
import Input from '../../../components/forms/Input'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import {
  composeDesignation,
  getApiErrorMessage,
  normalizeStaff,
  parseDesignation,
} from '../../../utils/adminPeople'

export default function EditStaff() {
  const { notify } = useNotificationContext()
  const [staff, setStaff] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [form, setForm] = useState({ department: '', title: '' })
  const [submitting, setSubmitting] = useState(false)

  const loadStaff = async () => {
    try {
      const { data } = await staffApi.list({ page: 1, limit: 200 })
      const nextStaff = (data?.data || []).map(normalizeStaff)
      setStaff(nextStaff)
      if (nextStaff.length && !selectedId) {
        setSelectedId(nextStaff[0].id)
        const parsed = parseDesignation(nextStaff[0].designation)
        setForm({ department: parsed.department, title: parsed.title })
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load designations.'), 'error')
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const selectedStaff = useMemo(
    () => staff.find((item) => item.id === selectedId) || null,
    [selectedId, staff]
  )

  const onSelectStaff = (id) => {
    setSelectedId(id)
    const target = staff.find((item) => item.id === id)
    if (!target) return
    const parsed = parseDesignation(target.designation)
    setForm({ department: parsed.department, title: parsed.title })
  }

  const saveDesignation = async (event) => {
    event.preventDefault()
    if (!selectedStaff) return
    setSubmitting(true)
    try {
      await staffApi.update(selectedStaff.id, {
        name: selectedStaff.name,
        phone: selectedStaff.phone || undefined,
        designation: composeDesignation(form.department, form.title),
      })
      notify('Designation updated successfully.', 'success')
      await loadStaff()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to update designation.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><BadgeCheck size={18} /></div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Designation management</p>
            <p className="mt-1 text-sm text-ink-soft">Update employee designations and department hierarchy.</p>
          </div>
        </div>
        <form className="mt-6 space-y-4" onSubmit={saveDesignation}>
          <Select
            label="Choose employee"
            value={selectedId}
            onChange={(event) => onSelectStaff(event.target.value)}
            options={staff.map((item) => ({ value: item.id, label: `${item.name} (${item.department})` }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} required />
            <Input label="Designation title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting || !selectedStaff} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              <span className="flex items-center gap-2">
                <Save size={16} />
                {submitting ? 'Saving…' : 'Save designation'}
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Current profile</p>
        {selectedStaff ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface-tint p-4">
            <p className="font-semibold text-ink">{selectedStaff.name}</p>
            <p className="text-sm text-ink-soft">{selectedStaff.email}</p>
            <div className="mt-3 space-y-2 text-sm text-ink-soft">
              <p><span className="font-medium text-ink">Department:</span> {selectedStaff.department}</p>
              <p><span className="font-medium text-ink">Designation:</span> {selectedStaff.title}</p>
              <p><span className="font-medium text-ink">Subjects:</span> {selectedStaff.subjectCount}</p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-ink-soft">No employee selected.</p>
        )}
      </div>
    </div>
  )
}
