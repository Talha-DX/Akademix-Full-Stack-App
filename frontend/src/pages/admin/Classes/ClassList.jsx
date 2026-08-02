import { useMemo, useState } from 'react'
import { PencilLine, Search, Trash2, Users } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import ClassForm from '../../../components/admin/ClassForm'
import { createClass, deleteClass, getClasses, updateClass } from '../../../utils/adminCrudStore'

const defaultForm = {
  name: '',
  section: 'A',
  teacher: '',
  capacity: 30,
  status: 'Active',
}

export default function ClassList() {
  const [classes, setClasses] = useState(getClasses)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredClasses = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return classes
    return classes.filter((item) => [item.name, item.section, item.teacher].join(' ').toLowerCase().includes(term))
  }, [classes, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      section: item.section,
      teacher: item.teacher,
      capacity: item.capacity,
      status: item.status,
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

    const payload = {
      ...form,
      capacity: Number(form.capacity) || 30,
    }

    const next = editingId ? updateClass(editingId, payload) : createClass(payload)
    setClasses(next)
    setModalOpen(false)
    setSubmitting(false)
    setForm(defaultForm)
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) {
      setClasses(deleteClass(id))
    }
  }

  const activeCount = classes.filter((item) => item.status === 'Active').length
  const avgCapacity = classes.length ? Math.round(classes.reduce((total, item) => total + Number(item.capacity || 0), 0) / classes.length) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Class library</p>
              <p className="mt-1 text-sm text-ink-soft">Manage every class, section, and homeroom teacher from a single view.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Add class
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{classes.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Classes</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{activeCount}</p>
              <p className="mt-1 text-sm text-ink-soft">Active</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{avgCapacity}</p>
              <p className="mt-1 text-sm text-ink-soft">Avg. capacity</p>
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
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search class or teacher" className="w-full bg-transparent outline-none" />
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
                <th className="px-5 py-3">Teacher</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredClasses.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.section}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.teacher}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.capacity}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Active' ? 'bg-brand-50 text-brand-700' : item.status === 'On hold' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/10 text-slate-600'}`}>
                      {item.status}
                    </span>
                  </td>
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
