import { useState } from 'react'
import { CheckCircle2, GraduationCap } from 'lucide-react'
import ClassForm from '../../../components/admin/ClassForm'
import { createClass, getClasses } from '../../../utils/adminCrudStore'

const defaultForm = {
  name: '',
  section: 'A',
  teacher: '',
  capacity: 30,
  status: 'Active',
}

export default function AddClass() {
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
    const payload = {
      ...form,
      capacity: Number(form.capacity) || 30,
    }
    createClass(payload)
    setSaved(true)
    setForm(defaultForm)
    setSubmitting(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <GraduationCap size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Create a new class</p>
            <p className="mt-1 text-sm text-ink-soft">Add the class name, timetable section, and homeroom teacher in seconds.</p>
          </div>
        </div>
        {saved && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            <CheckCircle2 size={16} />
            Class created successfully. You can create another one below.
          </div>
        )}
        <div className="mt-6">
          <ClassForm form={form} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} submitLabel="Create class" />
        </div>
      </div>
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Current class overview</p>
        <div className="mt-5 space-y-3">
          {getClasses().map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-line bg-surface-tint px-4 py-3">
              <div>
                <p className="font-semibold text-ink">{item.name} · {item.section}</p>
                <p className="text-sm text-ink-soft">{item.teacher}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Active' ? 'bg-brand-50 text-brand-700' : item.status === 'On hold' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/10 text-slate-600'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
