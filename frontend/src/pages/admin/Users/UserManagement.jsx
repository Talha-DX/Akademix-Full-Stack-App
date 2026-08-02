import { useMemo, useState } from 'react'
import { Search, Trash2, PencilLine, ShieldCheck } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createUser, deleteUser, getUsers, updateUser } from '../../../utils/adminCrudStore'

const defaultForm = {
  name: '',
  email: '',
  role: 'TEACHER',
  status: 'Active',
  lastLogin: 'Never',
}

export default function UserManagement() {
  const [users, setUsers] = useState(getUsers)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return users
    return users.filter((item) => [item.name, item.email, item.role].join(' ').toLowerCase().includes(term))
  }, [users, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status,
      lastLogin: item.lastLogin,
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
    const payload = { ...form }
    const next = editingId ? updateUser(editingId, payload) : createUser(payload)
    setUsers(next)
    setModalOpen(false)
    setForm(defaultForm)
    setEditingId(null)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(deleteUser(id))
    }
  }

  const activeCount = users.filter((item) => item.status === 'Active').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">User access control</p>
              <p className="mt-1 text-sm text-ink-soft">Create and manage every portal account, from admins to students.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Add user
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{users.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Accounts</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{activeCount}</p>
              <p className="mt-1 text-sm text-ink-soft">Active</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Search users</p>
              <p className="text-sm text-ink-soft">Filter by name, role, or email address.</p>
            </div>
          </div>
          <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" className="w-full bg-transparent outline-none" />
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last login</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredUsers.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.email}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.role}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Active' ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.lastLogin}</td>
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

      <Modal open={modalOpen} title={editingId ? 'Edit user' : 'Add user'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Select label="Role" name="role" value={form.role} onChange={handleChange} options={['ADMIN', 'TEACHER', 'STUDENT'].map((item) => ({ value: item, label: item }))} />
            <Select label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'Inactive', 'Suspended'].map((item) => ({ value: item, label: item }))} />
            <div className="sm:col-span-2">
              <Input label="Last login" name="lastLogin" value={form.lastLogin} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update user' : 'Create user'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
