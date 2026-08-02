import { useState } from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createUser, getUsers } from '../../../utils/adminCrudStore'

const defaultForm = {
  name: '',
  email: '',
  role: 'TEACHER',
  status: 'Active',
  lastLogin: 'Never',
}

export default function AddUser() {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)
    createUser(form)
    setSaved(true)
    setForm(defaultForm)
    setSubmitting(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Create portal access</p>
            <p className="mt-1 text-sm text-ink-soft">Provision a new account for any admin, teacher, or student role.</p>
          </div>
        </div>
        {saved && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            <CheckCircle2 size={16} />
            User account added successfully.
          </div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Select label="Role" name="role" value={form.role} onChange={handleChange} options={['ADMIN', 'TEACHER', 'STUDENT'].map((item) => ({ value: item, label: item }))} />
            <Select label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'Inactive', 'Suspended'].map((item) => ({ value: item, label: item }))} />
            <div className="sm:col-span-2">
              <Input label="Last login" name="lastLogin" value={form.lastLogin} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Recent accounts</p>
        <div className="mt-5 space-y-3">
          {getUsers().slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-2xl border border-line bg-surface-tint px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-ink-soft">{item.role}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Active' ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
