import { useEffect, useState } from 'react'
import { CheckCircle2, GraduationCap } from 'lucide-react'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { classApi } from '../../../api/classApi'
import { studentApi } from '../../../api/studentApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage, normalizeStudent } from '../../../utils/adminPeople'

export default function AddStudent() {
  const { notify } = useNotificationContext()
  const [classes, setClasses] = useState([])
  const [recent, setRecent] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    classId: '',
    dob: '',
    password: '',
  })

  const loadData = async () => {
    try {
      const [classesRes, studentsRes] = await Promise.all([
        classApi.list(),
        studentApi.list({ page: 1, limit: 4 }),
      ])
      const nextClasses = Array.isArray(classesRes.data) ? classesRes.data : []
      setClasses(nextClasses)
      setRecent((studentsRes.data?.data || []).map(normalizeStudent))
      setForm((current) => ({ ...current, classId: current.classId || nextClasses[0]?.id || '' }))
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load admissions data.'), 'error')
    }
  }

  useEffect(() => {
    loadData()
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
      await studentApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        classId: form.classId,
        dob: form.dob,
        password: form.password || undefined,
      })
      setSaved(true)
      notify('Student admitted successfully.', 'success')
      setForm({
        name: '',
        email: '',
        phone: '',
        classId: classes[0]?.id || '',
        dob: '',
        password: '',
      })
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to admit student.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <GraduationCap size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Student admissions</p>
            <p className="mt-1 text-sm text-ink-soft">Create real student records in your database with class assignment.</p>
          </div>
        </div>
        {saved && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            <CheckCircle2 size={16} />
            Admission created and synced.
          </div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Date of birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
            <Select
              label="Class"
              name="classId"
              value={form.classId}
              onChange={handleChange}
              options={classes.map((item) => ({ value: item.id, label: `${item.name} · ${item.section}` }))}
            />
            <Input label="Initial password (optional)" name="password" value={form.password} onChange={handleChange} placeholder="Defaults to changeme123" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : 'Create admission'}
            </button>
          </div>
        </form>
      </div>
      <div className="card p-6">
        <p className="font-display text-lg font-semibold text-ink">Recent admissions</p>
        <div className="mt-5 space-y-3">
          {recent.map((item) => (
            <div key={item.id} className="rounded-2xl border border-line bg-surface-tint px-4 py-3">
              <p className="font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-ink-soft">{item.className} · {item.section}</p>
              <p className="text-xs text-ink-soft">Admission: {item.admissionNo}</p>
            </div>
          ))}
          {!recent.length && <p className="text-sm text-ink-soft">No recent admissions.</p>}
        </div>
      </div>
    </div>
  )
}
