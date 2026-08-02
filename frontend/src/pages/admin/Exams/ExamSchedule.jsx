import { useMemo, useState } from 'react'
import { ClipboardList, PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createExam, deleteExam, getExams, updateExam } from '../../../utils/adminModuleStore'

const defaultForm = {
  title: '',
  className: 'Grade 8',
  date: new Date().toISOString().slice(0, 10),
  duration: '90 min',
  status: 'Scheduled',
}

export default function ExamSchedule() {
  const [exams, setExams] = useState(getExams)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredExams = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return exams
    return exams.filter((item) => [item.title, item.className, item.status].join(' ').toLowerCase().includes(term))
  }, [exams, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({ title: item.title, className: item.className, date: item.date, duration: item.duration, status: item.status })
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)
    const payload = { ...form }
    const next = editingId ? updateExam(editingId, payload) : createExam(payload)
    setExams(next)
    setModalOpen(false)
    setForm(defaultForm)
    setEditingId(null)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this exam schedule?')) {
      setExams(deleteExam(id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Exam schedule</p>
            <p className="mt-1 text-sm text-ink-soft">Plan and manage exam dates, durations, and status for each class.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"><span className="flex items-center gap-2"><PlusCircle size={16} /> Add exam</span></button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exam or class" className="w-full bg-transparent outline-none" /></div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{exams.length} exams</div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft"><tr><th className="px-5 py-3">Exam</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Duration</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-line">
              {filteredExams.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.title}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.className}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.date}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.duration}</td>
                  <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Scheduled' ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600'}`}>{item.status}</span></td>
                  <td className="px-5 py-3.5"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint"><PencilLine size={16} /></button><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit exam' : 'Add exam'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Exam title" name="title" value={form.title} onChange={handleChange} required />
            <Select label="Class" name="className" value={form.className} onChange={handleChange} options={['Grade 8', 'Grade 9', 'Grade 10'].map((item) => ({ value: item, label: item }))} />
            <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
            <Input label="Duration" name="duration" value={form.duration} onChange={handleChange} required />
            <Select label="Status" name="status" value={form.status} onChange={handleChange} options={['Scheduled', 'Draft', 'Completed'].map((item) => ({ value: item, label: item }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
    </div>
  )
}
