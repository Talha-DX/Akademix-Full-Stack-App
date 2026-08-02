import { useEffect, useMemo, useState } from 'react'
import { Briefcase, PencilLine, Search, Trash2, UserPlus } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import {
  composeDesignation,
  getApiErrorMessage,
  normalizeStaff,
  parseDesignation,
} from '../../../utils/adminPeople'

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  department: 'General',
  title: '',
  password: '',
}

export default function StaffList() {
  const { notify } = useNotificationContext()
  const [staff, setStaff] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadStaff = async () => {
    setLoading(true)
    try {
      const { data } = await staffApi.list({ page: 1, limit: 200 })
      setStaff((data?.data || []).map(normalizeStaff))
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load employees.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const filteredStaff = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return staff
    return staff.filter((item) =>
      [item.name, item.email, item.department, item.title].join(' ').toLowerCase().includes(term)
    )
  }, [staff, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    const parsed = parseDesignation(item.designation)
    setEditingId(item.id)
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      department: parsed.department,
      title: parsed.title,
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
        await staffApi.update(editingId, {
          name: form.name,
          phone: form.phone || undefined,
          designation: composeDesignation(form.department, form.title),
        })
        notify('Employee updated.', 'success')
      } else {
        await staffApi.create({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          designation: composeDesignation(form.department, form.title),
          password: form.password || undefined,
        })
        notify('Employee created.', 'success')
      }
      setModalOpen(false)
      setEditingId(null)
      await loadStaff()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to save employee.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
    try {
      await staffApi.remove(id)
      notify('Employee deleted.', 'success')
      await loadStaff()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to delete employee.'), 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Employee roster</p>
              <p className="mt-1 text-sm text-ink-soft">Live staff records with department and designation data.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              <span className="flex items-center gap-2"><UserPlus size={16} /> Add employee</span>
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{staff.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Employees</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{new Set(staff.map((item) => item.department)).size}</p>
              <p className="mt-1 text-sm text-ink-soft">Departments</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Briefcase size={18} /></div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Find employee</p>
              <p className="text-sm text-ink-soft">Search by name, department, designation or email.</p>
            </div>
          </div>
          <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee" className="w-full bg-transparent outline-none" />
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Designation</th>
                <th className="px-5 py-3">Subjects</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={5}>Loading employees…</td></tr>
              ) : filteredStaff.length ? (
                filteredStaff.map((item) => (
                  <tr key={item.id} className="bg-white/70">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-ink-soft">{item.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.department}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.title}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{item.subjectCount}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint"><PencilLine size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={5}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit employee' : 'Add employee'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={Boolean(editingId)} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Department" name="department" value={form.department} onChange={handleChange} required />
            <Input label="Designation title" name="title" value={form.title} onChange={handleChange} required />
            {!editingId && <Input label="Initial password (optional)" name="password" value={form.password} onChange={handleChange} placeholder="Defaults to changeme123" />}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update employee' : 'Create employee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
