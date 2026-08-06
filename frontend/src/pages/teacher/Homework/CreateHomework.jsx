import { useEffect, useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import Select from '../../../components/forms/Select'
import Input from '../../../components/forms/Input'
import Textarea from '../../../components/forms/Textarea'
import { homeworkApi } from '../../../api/homeworkApi'
import { subjectApi } from '../../../api/subjectApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const emptyForm = { classId: '', subjectId: '', title: '', description: '', dueDate: '' }

export default function CreateHomework() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [loadedSubjects, setLoadedSubjects] = useState([])
  const staffId = user?.staff?.id
  const subjects = loadedSubjects.length ? loadedSubjects : (user?.staff?.subjects || [])

  useEffect(() => {
    subjectApi.list()
      .then(({ data }) => setLoadedSubjects((Array.isArray(data) ? data : []).filter((subject) => subject.teacherId === staffId)))
      .catch(() => setLoadedSubjects([]))
  }, [staffId])

  const classOptions = useMemo(() => {
    const map = new Map()
    subjects.forEach((s) => { if (s.classId) map.set(s.classId, s.class) })
    return Array.from(map.entries()).map(([id, klass]) => ({ id, klass }))
  }, [subjects])

  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const subjectOptions = subjects.filter((s) => s.classId === form.classId)

  const update = (field) => (e) => setForm((c) => ({ ...c, [field]: e.target.value, ...(field === 'classId' ? { subjectId: '' } : {}) }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('classId', form.classId)
      payload.append('subjectId', form.subjectId)
      payload.append('title', form.title)
      payload.append('description', form.description)
      payload.append('dueDate', form.dueDate)
      if (file) payload.append('attachment', file)
      await homeworkApi.create(payload)
      notify('Homework assigned.', 'success')
      setForm(emptyForm)
      setFile(null)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to create homework.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!classOptions.length) {
    return <div className="card p-6 text-sm text-ink-soft">You have no classes assigned yet.</div>
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <ClipboardList size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Create homework</p>
            <p className="mt-1 text-sm text-ink-soft">Saved to the database and visible to students of the selected class immediately.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <Select label="Class" value={form.classId} onChange={update('classId')} options={classOptions.map((c) => ({ value: c.id, label: `${c.klass?.name} ${c.klass?.section}` }))} />
        <Select label="Subject" value={form.subjectId} onChange={update('subjectId')} options={subjectOptions.map((s) => ({ value: s.id, label: s.name }))} />
        <Input label="Title" value={form.title} onChange={update('title')} required />
        <Textarea label="Description" value={form.description} onChange={update('description')} rows={4} required />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Due date</span>
          <input type="date" value={form.dueDate} onChange={update('dueDate')} required className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Attachment (optional)</span>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400" />
        </label>
        <div className="flex justify-end">
          <button type="submit" disabled={submitting || !form.classId || !form.subjectId} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
            {submitting ? 'Saving…' : 'Assign homework'}
          </button>
        </div>
      </form>
    </div>
  )
}
