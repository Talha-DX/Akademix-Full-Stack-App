import { useEffect, useMemo, useState } from 'react'
import { timetableApi } from '../../../api/timetableApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export default function MyTimetable() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const classId = user?.student?.classId

  useEffect(() => {
    if (!classId) { setEntries([]); setLoading(false); return }
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await timetableApi.byClass(classId)
        setEntries(Array.isArray(data) ? data : [])
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to load your timetable.'), 'error')
      } finally { setLoading(false) }
    }
    load()
  }, [classId, notify])

  const periods = useMemo(() => [...new Set(entries.map((entry) => entry.period))].sort((a, b) => a - b), [entries])
  const schedule = useMemo(() => new Map(entries.map((entry) => [`${String(entry.day).toUpperCase()}-${entry.period}`, entry])), [entries])

  return (
    <div className="card overflow-hidden">
      <div className="p-6">
        <h1 className="font-display text-xl font-semibold text-ink">My Timetable</h1>
        <p className="mt-1 text-sm text-ink-soft">Your weekly class schedule, synced from the school timetable.</p>
      </div>
      {loading ? <p className="px-6 pb-6 text-sm text-ink-soft">Loading timetable…</p> : !periods.length ? <p className="px-6 pb-6 text-sm text-ink-soft">No timetable has been published for your class.</p> : (
        <div className="overflow-x-auto border-t border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft"><tr><th className="px-4 py-3">Day</th>{periods.map((period) => <th key={period} className="min-w-40 px-4 py-3">Period {period}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">{days.map((day) => <tr key={day}><td className="whitespace-nowrap px-4 py-4 font-semibold text-ink">{day.charAt(0) + day.slice(1).toLowerCase()}</td>{periods.map((period) => {
              const entry = schedule.get(`${day}-${period}`)
              return <td key={period} className="px-4 py-4 text-ink-soft">{entry ? <><p className="font-medium text-ink">{entry.subject?.name}</p><p className="mt-1 text-xs">{entry.teacher?.user?.name || 'Teacher not assigned'}</p></> : '—'}</td>
            })}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
