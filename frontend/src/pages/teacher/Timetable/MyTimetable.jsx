import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { timetableApi } from '../../../api/timetableApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

export default function MyTimetable() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [entries, setEntries] = useState([])
  const teacherId = user?.staff?.id

  useEffect(() => {
    if (!teacherId) return
    timetableApi.byTeacher(teacherId)
      .then((res) => setEntries(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load your timetable.'), 'error'))
  }, [teacherId, notify])

  const grouped = DAYS.map((day) => ({
    day,
    periods: entries.filter((e) => e.day === day).sort((a, b) => a.period - b.period),
  }))

  if (!teacherId) {
    return <div className="card p-6 text-sm text-ink-soft">Your employee record is not configured yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <CalendarClock size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">My timetable</p>
            <p className="mt-1 text-sm text-ink-soft">Your class's weekly schedule.</p>
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
                  <p className="text-xs text-ink-soft">{p.teacher?.user?.name}</p>
                </div>
              )) : <p className="text-xs text-ink-soft">No periods scheduled.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
