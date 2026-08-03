import { useEffect, useMemo, useState } from 'react'
import { PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { examApi } from '../../../api/examApi'
import { classApi } from '../../../api/classApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const defaultForm = {
  name: '',
  classId: '',
  term: 'Midterm',
  startDate: new Date().toISOString().slice(0, 10),
}

export default function ExamSchedule() {
  const { notify } = useNotificationContext()
  const [exams, setExams] = useState([])
  const [classes, setClasses] = useState([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [examRes, classRes] = await Promise.all([
        examApi.list(),
        classApi.list(),
      ])
      const examList = Array.isArray(examRes.data) ? examRes.data : []
      const classList = Array.isArray(classRes.data) ? classRes.data : []
      setExams(examList)
      setClasses(classList)
      if (classList.length && !form.classId) {
        setForm((prev) => ({ ...prev, classId: classList[0].id }))
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load exams data.'), 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredExams = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return exams
    return exams.filter((item) => [item.name, item.class?.name, item.term].join(' ').toLowerCase().includes(term))
  }, [exams, query])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...defaultForm, classId: classes[0]?.id || '' })
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      classId: item.classId || classes[0]?.id || '',
      term: item.term || 'Midterm',
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    })
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        classId: form.classId,
        term: form.term,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      }
      if (editingId) {
        await examApi.update(editingId, payload)
        notify('Exam schedule updated successfully.', 'success')
      } else {
        await examApi.create(payload)
        notify('Exam scheduled successfully.', 'success')
      }
      setModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save exam schedule.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this exam schedule?')) {
      try {
        await examApi.remove(id)
        notify('Exam deleted successfully.', 'success')
        await loadData()
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to delete exam.'), 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Exam Schedule</p>
            <p className="mt-1 text-sm text-ink-soft">Plan and manage exam terms and start dates directly in PostgreSQL.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            <span className="flex items-center gap-2"><PlusCircle size={16} /> Add Exam</span>
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exam or class" className="w-full bg-transparent outline-none" />
          </div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{exams.length} exams scheduled</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Exam Name</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Term</th>
                <th className="px-5 py-3">Start Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredExams.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.class ? `${item.class.name} - ${item.class.section}` : 'N/A'}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.term}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint">
                        <PencilLine size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredExams.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Exam' : 'Schedule Exam'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Exam Name" name="name" value={form.name} onChange={handleChange} required />
            <Select
              label="Class"
              name="classId"
              value={form.classId}
              onChange={handleChange}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} · ${c.section}` }))}
            />
            <Select
              label="Term"
              name="term"
              value={form.term}
              onChange={handleChange}
              options={['Midterm', 'Finals', 'Quiz', 'Term 1', 'Term 2'].map((t) => ({ value: t, label: t }))}
            />
            <Input label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Schedule'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
