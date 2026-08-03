import { useEffect, useMemo, useState } from 'react'
import { PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { subjectApi } from '../../../api/subjectApi'
import { classApi } from '../../../api/classApi'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const defaultForm = {
  name: '',
  classId: '',
  teacherId: '',
}

export default function SubjectList() {
  const { notify } = useNotificationContext()
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [staff, setStaff] = useState([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [subjRes, classRes, staffRes] = await Promise.all([
        subjectApi.list(),
        classApi.list(),
        staffApi.list({ limit: 100 }),
      ])
      setSubjects(Array.isArray(subjRes.data) ? subjRes.data : [])
      const classList = Array.isArray(classRes.data) ? classRes.data : []
      setClasses(classList)
      const staffList = staffRes.data?.data || (Array.isArray(staffRes.data) ? staffRes.data : [])
      setStaff(staffList)
      if (classList.length && !form.classId) {
        setForm((prev) => ({ ...prev, classId: classList[0].id }))
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load subjects.'), 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredSubjects = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return subjects
    return subjects.filter((item) =>
      [item.name, item.class?.name, item.teacher?.user?.name].join(' ').toLowerCase().includes(term)
    )
  }, [subjects, query])

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
      teacherId: item.teacherId || '',
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
        teacherId: form.teacherId || undefined,
      }
      if (editingId) {
        await subjectApi.update(editingId, payload)
        notify('Subject updated successfully.', 'success')
      } else {
        await subjectApi.create(payload)
        notify('Subject created successfully.', 'success')
      }
      setModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save subject.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subject?')) {
      try {
        await subjectApi.remove(id)
        notify('Subject deleted successfully.', 'success')
        await loadData()
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to delete subject.'), 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Subject Catalogue</p>
            <p className="mt-1 text-sm text-ink-soft">Organize subjects, classes, and teachers directly in PostgreSQL.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            <span className="flex items-center gap-2"><PlusCircle size={16} /> Add Subject</span>
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subject or teacher" className="w-full bg-transparent outline-none" />
          </div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{subjects.length} subjects</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Assigned Teacher</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredSubjects.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.class ? `${item.class.name} - ${item.class.section}` : 'N/A'}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.teacher?.user?.name || 'Unassigned'}</td>
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
              {!filteredSubjects.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Subject' : 'Add Subject'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Subject Name" name="name" value={form.name} onChange={handleChange} required />
            <Select
              label="Class"
              name="classId"
              value={form.classId}
              onChange={handleChange}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} · ${c.section}` }))}
            />
            <div className="sm:col-span-2">
              <Select
                label="Assign Teacher (optional)"
                name="teacherId"
                value={form.teacherId}
                onChange={handleChange}
                options={[{ value: '', label: 'Unassigned' }, ...staff.map((s) => ({ value: s.id, label: s.user?.name || s.designation }))] }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
