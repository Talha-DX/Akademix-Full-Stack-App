import { useEffect, useMemo, useState } from 'react'
import { PencilLine, Search, Trash2, Users } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import ClassForm from '../../../components/admin/ClassForm'
import { classApi } from '../../../api/classApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const defaultForm = {
  name: '',
  section: 'A',
  teacher: '',
  capacity: 30,
  status: 'Active',
}

export default function ClassList() {
  const { notify } = useNotificationContext()
  const [classes, setClasses] = useState([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadClasses = async () => {
    try {
      const res = await classApi.list()
      setClasses(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load classes.'), 'error')
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  const filteredClasses = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return classes
    return classes.filter((item) => [item.name, item.section].join(' ').toLowerCase().includes(term))
  }, [classes, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      section: item.section || 'A',
      teacher: '',
      capacity: 30,
      status: 'Active',
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
        await classApi.update(editingId, { name: form.name, section: form.section })
        notify('Class updated successfully.', 'success')
      } else {
        await classApi.create({ name: form.name, section: form.section })
        notify('Class created successfully.', 'success')
      }
      setModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
      await loadClasses()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save class.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this class?')) {
      try {
        await classApi.remove(id)
        notify('Class deleted successfully.', 'success')
        await loadClasses()
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to delete class.'), 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Class library</p>
              <p className="mt-1 text-sm text-ink-soft">Manage every class and section directly in the database.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Add class
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{classes.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Total Classes</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">
                {classes.reduce((total, c) => total + (c.students?.length || 0), 0)}
              </p>
              <p className="mt-1 text-sm text-ink-soft">Total Enrolled Students</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <Users size={18} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Sections at a glance</p>
              <p className="text-sm text-ink-soft">Use the search box to jump to a class quickly.</p>
            </div>
          </div>
          <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search class or section" className="w-full bg-transparent outline-none" />
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Section</th>
                <th className="px-5 py-3">Students</th>
                <th className="px-5 py-3">Subjects</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredClasses.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.section}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.students?.length || 0}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.subjects?.length || 0}</td>
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
              {!filteredClasses.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit class' : 'Add class'} onClose={() => setModalOpen(false)}>
        <ClassForm form={form} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} submitLabel={editingId ? 'Update class' : 'Create class'} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
