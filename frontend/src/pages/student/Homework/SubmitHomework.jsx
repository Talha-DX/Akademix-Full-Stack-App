import { useEffect, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { homeworkApi } from '../../../api/homeworkApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function SubmitHomework() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [homework, setHomework] = useState([])
  const [homeworkId, setHomeworkId] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const classId = user?.student?.classId

  const load = () => {
    if (!classId) return
    homeworkApi.list({ classId })
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : []
        setHomework(rows)
        if (rows.length && !homeworkId) setHomeworkId(rows[0].id)
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load homework.'), 'error'))
  }

  useEffect(() => { load() }, [classId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!homeworkId) return
    setSubmitting(true)
    try {
      const payload = new FormData()
      if (file) payload.append('file', file)
      await homeworkApi.submit(homeworkId, payload)
      notify('Homework submitted.', 'success')
      setFile(null)
      load()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to submit homework.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!classId) {
    return <div className="card p-6 text-sm text-ink-soft">You are not enrolled in a class yet.</div>
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <UploadCloud size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Submit homework</p>
            <p className="mt-1 text-sm text-ink-soft">Your submission is saved to the database and visible to your teacher immediately.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <Select
          label="Homework"
          value={homeworkId}
          onChange={(e) => setHomeworkId(e.target.value)}
          options={homework.map((h) => ({ value: h.id, label: `${h.title} — due ${new Date(h.dueDate).toLocaleDateString()}` }))}
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Attachment (optional)</span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
          />
        </label>
        <div className="flex justify-end">
          <button type="submit" disabled={submitting || !homework.length} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
        {!homework.length && <p className="text-xs text-coral-600">No homework has been assigned to your class yet.</p>}
      </form>
    </div>
  )
}
