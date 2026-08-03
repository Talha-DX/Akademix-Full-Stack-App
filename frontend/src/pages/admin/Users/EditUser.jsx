import { useEffect, useState } from 'react'
import { CheckCircle2, UserCog } from 'lucide-react'
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
  isActive: true,
}

export default function EditUser() {
  const { notify } = useNotificationContext()
  const [users, setUsers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadUsers = async () => {
    try {
      const res = await userApi.list({ limit: 100 })
      const listData = res.data?.data || (Array.isArray(res.data) ? res.data : [])
      setUsers(listData)
      if (listData.length && !selectedId) {
        setSelectedId(listData[0].id)
        setForm({
          name: listData[0].name || '',
          email: listData[0].email || '',
          phone: listData[0].phone || '',
          role: listData[0].role || 'TEACHER',
          isActive: listData[0].isActive ?? true,
        })
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load user accounts.'), 'error')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSelect = (event) => {
    const id = event.target.value
    setSelectedId(id)
    const selected = users.find((item) => item.id === id)
    if (selected) {
      setForm({
        name: selected.name || '',
        email: selected.email || '',
        phone: selected.phone || '',
        role: selected.role || 'TEACHER',
        isActive: selected.isActive ?? true,
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedId) return
    setSubmitting(true)
    setSaved(false)
    try {
      await userApi.update(selectedId, {
        name: form.name,
        phone: form.phone || undefined,
        isActive: Boolean(form.isActive),
      })
      setSaved(true)
      notify('User profile updated successfully.', 'success')
      await loadUsers()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to update user profile.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <UserCog size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Update a user profile</p>
            <p className="mt-1 text-sm text-ink-soft">Change name, phone, or active status for existing portal users.</p>
          </div>
        </div>
        {saved && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            <CheckCircle2 size={16} />
            User profile updated successfully.
          </div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Select label="Choose user" value={selectedId} onChange={handleSelect} options={users.map((item) => ({ value: item.id, label: `${item.name} (${item.email})` }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} disabled />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Select label="Status" name="isActive" value={form.isActive ? 'true' : 'false'} onChange={(e) => setForm((c) => ({ ...c, isActive: e.target.value === 'true' }))} options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : 'Update user'}
            </button>
          </div>
        </form>
      </div>
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Available accounts</p>
        <div className="mt-5 space-y-3">
          {users.map((item) => (
            <div key={item.id} className="rounded-2xl border border-line bg-surface-tint px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-ink-soft">{item.email} · {item.role}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.isActive !== false ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600'}`}>
                  {item.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
          {!users.length && <p className="text-sm text-ink-soft">No accounts found.</p>}
        </div>
      </div>
    </div>
  )
}
