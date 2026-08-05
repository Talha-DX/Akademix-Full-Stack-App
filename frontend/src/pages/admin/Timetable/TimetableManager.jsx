import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, PlusCircle, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Select from '../../../components/forms/Select'
import { timetableApi } from '../../../api/timetableApi'
import { classApi } from '../../../api/classApi'
import { subjectApi } from '../../../api/subjectApi'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]

const defaultForm = { day: 'MONDAY', period: 1, subjectId: '', teacherId: '' }

export default function TimetableManager() {
  const { notify } = useNotificationContext()
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState('')
  const [entries, setEntries] = useState([])
  const [subjects, setSubjects] = useState([])
  const [staff, setStaff] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadClasses = async () => {
    try {
      const res = await classApi.list()
      const rows = Array.isArray(res.data) ? res.data : []
      setClasses(rows)
      if (rows.length && !classId) setClassId(rows[0].id)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load classes.'), 'error')
    }
  }

  const loadStaff = async () => {
    try {
      const res = await staffApi.list({ limit: 100 })
      setStaff(res.data?.data || (Array.isArray(res.data) ? res.data : []))
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load staff.'), 'error')
    }
  }

  const loadEntries = async (cid) => {
    if (!cid) return
    try {
      const [ttRes, subjRes] = await Promise.all([
        timetableApi.list({ classId: cid }),
        subjectApi.list({ classId: cid }),
      ])
      setEntries(Array.isArray(ttRes.data) ? ttRes.data : [])
      setSubjects(Array.isArray(subjRes.data) ? subjRes.data : [])
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load the timetable.'), 'error')
    }
  }

  useEffect(() => {
    loadClasses()
    loadStaff()
  }, [])

  useEffect(() => {
    loadEntries(classId)
  }, [classId])

  const grid = useMemo(() => {
    const map = {}
    entries.forEach((entry) => {
      map[`${entry.day}-${entry.period}`] = entry
    })
    return map
  }, [entries])

  const openCreate = (day, period) => {
    setEditingId(null)
    setForm({ day, period, subjectId: subjects[0]?.id || '', teacherId: staff[0]?.id || '' })
    setModalOpen(true)
  }

  const openEdit = (entry) => {
    setEditingId(entry.id)
    setForm({ day: entry.day, period: entry.period, subjectId: entry.subjectId, teacherId: entry.teacherId })
    setModalOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!classId) return
    setSubmitting(true)
    try {
      const payload = { classId, day: form.day, period: Number(form.period), subjectId: form.subjectId, teacherId: form.teacherId }
      if (editingId) {
        await timetableApi.update(editingId, payload)
        notify('Timetable entry updated.', 'success')
      } else {
        await timetableApi.create(payload)
        notify('Timetable entry created.', 'success')
      }
      setModalOpen(false)
      await loadEntries(classId)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save the timetable entry.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this period from the timetable?')) return
    try {
      await timetableApi.remove(id)
      notify('Timetable entry removed.', 'success')
      await loadEntries(classId)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to remove the entry.'), 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <CalendarClock size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Weekly timetable</p>
              <p className="mt-1 text-sm text-ink-soft">Click any empty slot to schedule a period. Data is read from and written to the database.</p>
            </div>
          </div>
          <div className="w-64">
            <Select
              label="Class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} · ${c.section}` }))}
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Period</th>
                {DAYS.map((day) => (
                  <th key={day} className="px-4 py-3">{day.slice(0, 3)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {PERIODS.map((period) => (
                <tr key={period} className="bg-white/70">
                  <td className="px-4 py-3 font-semibold text-ink">P{period}</td>
                  {DAYS.map((day) => {
                    const entry = grid[`${day}-${period}`]
                    return (
                      <td key={day} className="px-4 py-3">
                        {entry ? (
                          <div className="group relative rounded-xl border border-brand-200 bg-brand-50 px-2.5 py-2 text-xs">
                            <p className="font-semibold text-brand-700">{entry.subject?.name}</p>
                            <p className="text-ink-soft">{entry.teacher?.user?.name}</p>
                            <div className="mt-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                              <button onClick={() => openEdit(entry)} className="rounded p-1 text-ink-soft hover:bg-white">
                                <PencilLine size={12} />
                              </button>
                              <button onClick={() => handleDelete(entry.id)} className="rounded p-1 text-coral-600 hover:bg-white">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openCreate(day, period)}
                            className="flex h-14 w-full items-center justify-center rounded-xl border border-dashed border-line text-ink-soft hover:border-brand-300 hover:text-brand-600"
                          >
                            <PlusCircle size={16} />
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!classes.length && <p className="p-6 text-center text-sm text-ink-soft">No classes found. Create a class first.</p>}
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit period' : 'Schedule a period'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Day" value={form.day} onChange={(e) => setForm((c) => ({ ...c, day: e.target.value }))} options={DAYS.map((d) => ({ value: d, label: d }))} />
            <Select label="Period" value={form.period} onChange={(e) => setForm((c) => ({ ...c, period: e.target.value }))} options={PERIODS.map((p) => ({ value: p, label: `Period ${p}` }))} />
            <Select
              label="Subject"
              value={form.subjectId}
              onChange={(e) => setForm((c) => ({ ...c, subjectId: e.target.value }))}
              options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            />
            <Select
              label="Teacher"
              value={form.teacherId}
              onChange={(e) => setForm((c) => ({ ...c, teacherId: e.target.value }))}
              options={staff.map((s) => ({ value: s.id, label: s.user?.name || s.id }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">
              Cancel
            </button>
            <button type="submit" disabled={submitting || !subjects.length} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update' : 'Schedule'}
            </button>
          </div>
          {!subjects.length && <p className="text-xs text-coral-600">This class has no subjects yet — add one first under Subjects.</p>}
        </form>
      </Modal>
    </div>
  )
}
