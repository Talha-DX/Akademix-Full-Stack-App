import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2, PencilLine, ShieldCheck } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { userApi } from '../../../api/userApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  role: 'TEACHER',
  password: '',
  isActive: true,
}

export default function UserManagement() {
  const { notify } = useNotificationContext()
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadUsers = async () => {
    try {
      const res = await userApi.list({ limit: 100 })
      const listData = res.data?.data || (Array.isArray(res.data) ? res.data : [])
      setUsers(listData)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load user accounts.'), 'error')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

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
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      role: item.role || 'TEACHER',
      password: '',
      isActive: item.isActive ?? true,
    })
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      if (editingId) {
        await userApi.update(editingId, {
          name: form.name,
          phone: form.phone || undefined,
          isActive: Boolean(form.isActive),
        })
        notify('User updated successfully.', 'success')
      } else {
        await userApi.create({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          role: form.role,
          password: form.password,
        })
        notify('User created successfully.', 'success')
      }
      setModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
      await loadUsers()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save user account.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user account?')) {
      try {
        await userApi.remove(id)
        notify('User account deleted.', 'success')
        await loadUsers()
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to delete user.'), 'error')
      }
    }
  }

  const activeCount = users.filter((item) => item.isActive !== false).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">User access control</p>
              <p className="mt-1 text-sm text-ink-soft">Create and manage every portal account directly in PostgreSQL.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Add user
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{users.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Total Accounts</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{activeCount}</p>
              <p className="mt-1 text-sm text-ink-soft">Active Accounts</p>
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
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredUsers.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.email}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.phone || '—'}</td>
                  <td className="px-5 py-3.5 text-ink-soft font-mono text-xs">{item.role}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.isActive !== false ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600'}`}>
                      {item.isActive !== false ? 'Active' : 'Inactive'}
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
              {!filteredUsers.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No user accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit user' : 'Add user'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={Boolean(editingId)} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            {!editingId && (
              <>
                <Select label="Role" name="role" value={form.role} onChange={handleChange} options={['ADMIN', 'TEACHER', 'STUDENT'].map((item) => ({ value: item, label: item }))} />
                <Input label="Initial Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="At least 8 characters" />
              </>
            )}
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
