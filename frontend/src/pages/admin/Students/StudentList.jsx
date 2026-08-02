import { useEffect, useMemo, useState } from 'react'
import { GraduationCap, PencilLine, Search, Trash2, UserPlus } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { studentApi } from '../../../api/studentApi'
import { classApi } from '../../../api/classApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage, normalizeStudent } from '../../../utils/adminPeople'

const createDefaultForm = (classes) => ({
  name: '',
  email: '',
  phone: '',
  classId: classes[0]?.id || '',
  dob: '',
  password: '',
})

export default function StudentList() {
  const { notify } = useNotificationContext()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(createDefaultForm([]))

  const loadData = async () => {
    setLoading(true)
    try {
      const [studentsRes, classesRes] = await Promise.all([
        studentApi.list({ page: 1, limit: 200 }),
        classApi.list(),
      ])
      const nextClasses = Array.isArray(classesRes.data) ? classesRes.data : []
      const nextStudents = (studentsRes.data?.data || []).map(normalizeStudent)
      setClasses(nextClasses)
      setStudents(nextStudents)
      setForm((current) => ({
        ...current,
        classId: current.classId || nextClasses[0]?.id || '',
      }))
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load students.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return students
    return students.filter((item) =>
      [item.name, item.email, item.admissionNo, item.className, item.section].join(' ').toLowerCase().includes(term)
    )
  }, [students, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(createDefaultForm(classes))
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      classId: item.classId,
      dob: item.dob,
      password: '',
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
      if (editingId) {
        await studentApi.update(editingId, {
          name: form.name,
          phone: form.phone || undefined,
          classId: form.classId,
          dob: form.dob,
        })
        notify('Student updated successfully.', 'success')
      } else {
        await studentApi.create({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          classId: form.classId,
          dob: form.dob,
          password: form.password || undefined,
        })
        notify('Student admitted successfully.', 'success')
      }
      setModalOpen(false)
      setEditingId(null)
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to save student.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try {
      await studentApi.remove(id)
      notify('Student deleted.', 'success')
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to delete student.'), 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Student records</p>
              <p className="mt-1 text-sm text-ink-soft">Live student registry from your backend database.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              <span className="flex items-center gap-2"><UserPlus size={16} /> Add student</span>
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{students.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Total enrolled</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{new Set(students.map((s) => s.classId)).size}</p>
              <p className="mt-1 text-sm text-ink-soft">Classes covered</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Find student</p>
              <p className="text-sm text-ink-soft">Search by name, admission no, class or email.</p>
            </div>
          </div>
          <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student" className="w-full bg-transparent outline-none" />
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Admission</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={5}>Loading students…</td></tr>
              ) : filteredStudents.length ? (
                filteredStudents.map((item) => (
                  <tr key={item.id} className="bg-white/70">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-ink">{item.name}</div>
                      <div className="text-xs text-ink-soft">{item.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.admissionNo}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.className} · {item.section}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.phone || '—'}</td>
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
                ))
              ) : (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={5}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit student' : 'Admit student'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={Boolean(editingId)} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Date of birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
            <Select
              label="Class"
              name="classId"
              value={form.classId}
              onChange={handleChange}
              options={classes.map((item) => ({ value: item.id, label: `${item.name} · ${item.section}` }))}
            />
            {!editingId && <Input label="Initial password (optional)" name="password" value={form.password} onChange={handleChange} placeholder="Defaults to changeme123" />}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update student' : 'Create student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
