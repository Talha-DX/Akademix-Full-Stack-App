import { useEffect, useMemo, useState } from 'react'
import { Building2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { composeDesignation, getApiErrorMessage, normalizeStaff } from '../../../utils/adminPeople'

export default function StaffProfile() {
  const { notify } = useNotificationContext()
  const [staff, setStaff] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('ALL')
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ department: '', title: '' })

  const loadStaff = async () => {
    try {
      const { data } = await staffApi.list({ page: 1, limit: 200 })
      setStaff((data?.data || []).map(normalizeStaff))
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load departments.'), 'error')
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const departments = useMemo(
    () => Array.from(new Set(staff.map((item) => item.department))).sort(),
    [staff]
  )

  const filteredStaff = useMemo(() => {
    if (selectedDepartment === 'ALL') return staff
    return staff.filter((item) => item.department === selectedDepartment)
  }, [selectedDepartment, staff])

  const openEdit = (item) => {
    setEditing(item)
    setForm({ department: item.department, title: item.title })
  }

  const saveDepartment = async (event) => {
    event.preventDefault()
    if (!editing) return
    setSubmitting(true)
    try {
      await staffApi.update(editing.id, {
        name: editing.name,
        phone: editing.phone || undefined,
        designation: composeDesignation(form.department, form.title),
      })
      notify('Department assignment updated.', 'success')
      setEditing(null)
      await loadStaff()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to update assignment.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Building2 size={18} /></div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Department management</p>
            <p className="mt-1 text-sm text-ink-soft">Group employees by department and update assignments.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-2xl font-semibold text-ink">{departments.length}</p><p className="mt-1 text-sm text-ink-soft">Departments</p></div>
          <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-2xl font-semibold text-ink">{staff.length}</p><p className="mt-1 text-sm text-ink-soft">Employees</p></div>
          <div className="rounded-2xl border border-line bg-surface-tint p-4">
            <Select
              label="Filter"
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              options={[{ value: 'ALL', label: 'All departments' }, ...departments.map((d) => ({ value: d, label: d }))]}
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Designation</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredStaff.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink-soft">{item.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.department}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.title}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint">
                      <PencilLine size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredStaff.length && <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={4}>No employees found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={Boolean(editing)} title="Edit department assignment" onClose={() => setEditing(null)}>
        <form className="space-y-4" onSubmit={saveDepartment}>
          <div className="grid gap-4">
            <Input label="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} required />
            <Input label="Designation title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : 'Save assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
