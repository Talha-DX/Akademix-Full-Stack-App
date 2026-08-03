import { useEffect, useState } from 'react'
import { Briefcase, CheckCircle2 } from 'lucide-react'
import Input from '../../../components/forms/Input'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { composeDesignation, getApiErrorMessage, normalizeStaff } from '../../../utils/adminPeople'

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  department: 'General',
  title: '',
  password: '',
}

export default function AddStaff() {
  const { notify } = useNotificationContext()
  const [form, setForm] = useState(defaultForm)
  const [recentStaff, setRecentStaff] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadRecent = async () => {
    try {
      const { data } = await staffApi.list({ page: 1, limit: 4 })
      setRecentStaff((data?.data || []).map(normalizeStaff))
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load latest employees.'), 'error')
    }
  }

  useEffect(() => {
    loadRecent()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setSaved(false)
    try {
      await staffApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        designation: composeDesignation(form.department, form.title),
        password: form.password,
      })
      setSaved(true)
      notify('Employee onboarded successfully.', 'success')
      setForm(defaultForm)
      await loadRecent()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to create employee.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Employee onboarding</p>
            <p className="mt-1 text-sm text-ink-soft">Create a staff account and assign department/designation.</p>
          </div>
        </div>
        {saved && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            <CheckCircle2 size={16} />
            Employee created in database.
          </div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Department" name="department" value={form.department} onChange={handleChange} required />
            <Input label="Designation title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Initial password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="At least 8 characters" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : 'Create employee'}
            </button>
          </div>
        </form>
      </div>
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Latest employee profiles</p>
        <div className="mt-5 space-y-3">
          {recentStaff.map((item) => (
            <div key={item.id} className="rounded-2xl border border-line bg-surface-tint px-4 py-3">
              <p className="font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-ink-soft">{item.department} · {item.title}</p>
              <p className="text-xs text-ink-soft">{item.email}</p>
            </div>
          ))}
          {!recentStaff.length && <p className="text-sm text-ink-soft">No employee records yet.</p>}
        </div>
      </div>
    </div>
  )
}
