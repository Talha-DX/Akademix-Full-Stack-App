import { useMemo, useState } from 'react'
import { CalendarCheck2, PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createAttendance, deleteAttendance, getAttendance, updateAttendance } from '../../../utils/adminModuleStore'

const defaultForm = {
  student: '',
  className: 'Grade 8',
  section: 'A',
  present: 0,
  absent: 0,
  rate: '100%',
}

export default function AttendanceReport() {
  const [attendance, setAttendance] = useState(getAttendance)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredAttendance = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return attendance
    return attendance.filter((item) => [item.student, item.className, item.section].join(' ').toLowerCase().includes(term))
  }, [attendance, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      student: item.student,
      className: item.className,
      section: item.section,
      present: item.present,
      absent: item.absent,
      rate: item.rate,
    })
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)
    const payload = { ...form, present: Number(form.present) || 0, absent: Number(form.absent) || 0, rate: `${Math.round((Number(form.present) / (Number(form.present) + Number(form.absent))) * 100) || 0}%` }
    const next = editingId ? updateAttendance(editingId, payload) : createAttendance(payload)
    setAttendance(next)
    setModalOpen(false)
    setForm(defaultForm)
    setEditingId(null)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this attendance record?')) {
      setAttendance(deleteAttendance(id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Attendance management</p>
            <p className="mt-1 text-sm text-ink-soft">Track daily presence for students across classes and sections.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"><span className="flex items-center gap-2"><PlusCircle size={16} /> Add record</span></button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student or class" className="w-full bg-transparent outline-none" /></div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{attendance.length} records</div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Present</th>
                <th className="px-5 py-3">Absent</th>
                <th className="px-5 py-3">Rate</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredAttendance.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.student}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.className} · {item.section}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.present}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.absent}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.rate}</td>
                  <td className="px-5 py-3.5"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint"><PencilLine size={16} /></button><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit attendance' : 'Add attendance'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Student" name="student" value={form.student} onChange={handleChange} required />
            <Select label="Class" name="className" value={form.className} onChange={handleChange} options={['Grade 8', 'Grade 9', 'Grade 10'].map((item) => ({ value: item, label: item }))} />
            <Input label="Section" name="section" value={form.section} onChange={handleChange} required />
            <Input label="Present" name="present" type="number" min="0" value={form.present} onChange={handleChange} required />
            <Input label="Absent" name="absent" type="number" min="0" value={form.absent} onChange={handleChange} required />
            <div className="sm:col-span-2"><div className="rounded-2xl border border-line bg-surface-tint p-3 text-sm text-ink-soft">Attendance rate will be auto-calculated and stored.</div></div>
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
    </div>
  )
}
