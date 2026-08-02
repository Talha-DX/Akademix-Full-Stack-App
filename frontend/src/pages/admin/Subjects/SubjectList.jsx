import { useMemo, useState } from 'react'
import { BookOpen, PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createSubject, deleteSubject, getSubjects, updateSubject } from '../../../utils/adminModuleStore'

const defaultForm = {
  name: '',
  teacher: '',
  className: 'Grade 8',
  room: '',
}

export default function SubjectList() {
  const [subjects, setSubjects] = useState(getSubjects)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredSubjects = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return subjects
    return subjects.filter((item) => [item.name, item.teacher, item.className].join(' ').toLowerCase().includes(term))
  }, [subjects, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({ name: item.name, teacher: item.teacher, className: item.className, room: item.room })
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
    const next = editingId ? updateSubject(editingId, payload) : createSubject(payload)
    setSubjects(next)
    setModalOpen(false)
    setForm(defaultForm)
    setEditingId(null)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this subject?')) {
      setSubjects(deleteSubject(id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Subject catalogue</p>
            <p className="mt-1 text-sm text-ink-soft">Organize classes, teachers, and rooms in one easy-to-manage subject list.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"><span className="flex items-center gap-2"><PlusCircle size={16} /> Add subject</span></button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subject or teacher" className="w-full bg-transparent outline-none" /></div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{subjects.length} subjects</div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft"><tr><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Teacher</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Room</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-line">
              {filteredSubjects.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.teacher}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.className}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.room}</td>
                  <td className="px-5 py-3.5"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint"><PencilLine size={16} /></button><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit subject' : 'Add subject'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Subject name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Teacher" name="teacher" value={form.teacher} onChange={handleChange} required />
            <Select label="Class" name="className" value={form.className} onChange={handleChange} options={['Grade 8', 'Grade 9', 'Grade 10'].map((item) => ({ value: item, label: item }))} />
            <Input label="Room" name="room" value={form.room} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
    </div>
  )
}
