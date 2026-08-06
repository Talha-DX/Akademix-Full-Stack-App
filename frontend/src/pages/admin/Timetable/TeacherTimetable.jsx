import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { timetableApi } from '../../../api/timetableApi'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

export default function TeacherTimetable() {
  const { notify } = useNotificationContext()
  const [staff, setStaff] = useState([])
  const [teacherId, setTeacherId] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    staffApi.list({ limit: 100 })
      .then((res) => {
        const rows = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        setStaff(rows)
        if (rows.length) setTeacherId(rows[0].id)
      })
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load staff.'), 'error'))
  }, [])

  useEffect(() => {
    if (!teacherId) return
    timetableApi.byTeacher(teacherId)
      .then((res) => setEntries(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load timetable.'), 'error'))
  }, [teacherId])

  const grouped = DAYS.map((day) => ({
    day,
    periods: entries.filter((e) => e.day === day).sort((a, b) => a.period - b.period),
  }))

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <CalendarClock size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Teacher timetable</p>
              <p className="mt-1 text-sm text-ink-soft">Read-only view of a teacher's assigned periods, pulled directly from the database.</p>
            </div>
          </div>
          <div className="w-64">
            <Select
              label="Teacher"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              options={staff.map((s) => ({ value: s.id, label: s.user?.name || s.id }))}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grouped.map(({ day, periods }) => (
          <div key={day} className="card p-5">
            <p className="font-display text-sm font-semibold text-ink">{day}</p>
            <div className="mt-3 space-y-2">
              {periods.length ? periods.map((p) => (
                <div key={p.id} className="rounded-lg bg-surface-tint px-3 py-2 text-sm">
                  <p className="font-medium text-ink">Period {p.period} · {p.subject?.name}</p>
                  <p className="text-xs text-ink-soft">{p.class?.name} {p.class?.section}</p>
                </div>
              )) : <p className="text-xs text-ink-soft">No periods scheduled.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
