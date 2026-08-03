import { useEffect, useMemo, useState } from 'react'
import { PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { announcementApi } from '../../../api/announcementApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const defaultForm = {
  title: '',
  body: '',
  audience: 'ALL',
}

export default function AnnouncementList() {
  const { notify } = useNotificationContext()
  const [announcements, setAnnouncements] = useState([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadAnnouncements = async () => {
    try {
      const res = await announcementApi.list()
      setAnnouncements(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load announcements.'), 'error')
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const filteredAnnouncements = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return announcements
    return announcements.filter((item) => [item.title, item.body, item.audience].join(' ').toLowerCase().includes(term))
  }, [announcements, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      body: item.body || '',
      audience: item.audience || 'ALL',
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
      const payload = {
        title: form.title,
        body: form.body,
        audience: form.audience,
      }
      if (editingId) {
        await announcementApi.update(editingId, payload)
        notify('Announcement updated successfully.', 'success')
      } else {
        await announcementApi.create(payload)
        notify('Announcement created successfully.', 'success')
      }
      setModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
      await loadAnnouncements()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save announcement.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await announcementApi.remove(id)
        notify('Announcement deleted successfully.', 'success')
        await loadAnnouncements()
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to delete announcement.'), 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Announcements</p>
            <p className="mt-1 text-sm text-ink-soft">Send updates to students, teachers, or administrators stored in PostgreSQL.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            <span className="flex items-center gap-2"><PlusCircle size={16} /> Create announcement</span>
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search announcements" className="w-full bg-transparent outline-none" />
          </div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{announcements.length} total notices</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Body</th>
                <th className="px-5 py-3">Audience</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredAnnouncements.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.title}</td>
                  <td className="px-5 py-3.5 text-ink-soft max-w-xs truncate">{item.body}</td>
                  <td className="px-5 py-3.5 text-ink-soft font-mono text-xs">{item.audience}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint"><PencilLine size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredAnnouncements.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No announcements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit announcement' : 'Create announcement'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">Body</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={3}
              required
              className="w-full rounded-xl border border-line bg-white p-3 text-sm text-ink outline-none focus:border-brand-500"
              placeholder="Announcement details..."
            />
          </div>
          <Select
            label="Audience"
            name="audience"
            value={form.audience}
            onChange={handleChange}
            options={[
              { value: 'ALL', label: 'All Users' },
              { value: 'ADMIN', label: 'Admins Only' },
              { value: 'TEACHER', label: 'Teachers Only' },
              { value: 'STUDENT', label: 'Students Only' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
