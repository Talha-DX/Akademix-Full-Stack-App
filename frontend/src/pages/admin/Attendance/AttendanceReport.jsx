import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck2, PlusCircle, Search } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Select from '../../../components/forms/Select'
import Input from '../../../components/forms/Input'
import { attendanceApi } from '../../../api/attendanceApi'
import { classApi } from '../../../api/classApi'
import { studentApi } from '../../../api/studentApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'
import { reportApi } from '../../../api/reportApi'
import { downloadPdf } from '../../../utils/download'

export default function AttendanceReport() {
  const { notify } = useNotificationContext()
  const [records, setRecords] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [markForm, setMarkForm] = useState({
    classId: '',
    date: new Date().toISOString().split('T')[0],
    studentId: '',
    status: 'PRESENT',
  })
  const [submitting, setSubmitting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const download = async () => { setDownloading(true); try { downloadPdf(await reportApi.download('attendance'), 'attendance-report.pdf') } finally { setDownloading(false) } }

  const loadData = async () => {
    try {
      const [attRes, classRes, studentRes] = await Promise.all([
        attendanceApi.list({ classId: selectedClass || undefined }),
        classApi.list(),
        studentApi.list({ limit: 100 }),
      ])
      setRecords(Array.isArray(attRes.data) ? attRes.data : [])
      const classList = Array.isArray(classRes.data) ? classRes.data : []
      setClasses(classList)
      const stList = studentRes.data?.data || (Array.isArray(studentRes.data) ? studentRes.data : [])
      setStudents(stList)
      if (classList.length && !markForm.classId) {
        setMarkForm((prev) => ({ ...prev, classId: classList[0].id }))
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load attendance records.'), 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedClass])

  const filteredRecords = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return records
    return records.filter((r) => [r.student?.user?.name, r.status].join(' ').toLowerCase().includes(term))
  }, [records, query])

  const handleMarkSubmit = async (e) => {
    e.preventDefault()
    if (!markForm.classId || !markForm.studentId) {
      notify('Please select a class and student.', 'error')
      return
    }
    setSubmitting(true)
    try {
      await attendanceApi.mark({
        classId: markForm.classId,
        date: markForm.date,
        records: [{ studentId: markForm.studentId, status: markForm.status }],
      })
      notify('Attendance marked successfully.', 'success')
      setModalOpen(false)
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to mark attendance.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Attendance Management</p>
            <p className="mt-1 text-sm text-ink-soft">View and mark real daily attendance connected directly to PostgreSQL.</p>
          </div>
          <div className="flex gap-2"><button onClick={download} disabled={downloading} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface-tint disabled:opacity-60">{downloading ? 'Preparing…' : 'Download PDF'}</button><button onClick={() => setModalOpen(true)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"><span className="flex items-center gap-2"><PlusCircle size={16} /> Mark Attendance</span></button></div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft min-w-[200px]">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student or status" className="w-full bg-transparent outline-none" />
            </div>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none">
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{records.length} records found</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 text-ink-soft">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.student?.user?.name || 'Unknown'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'PRESENT' ? 'bg-brand-50 text-brand-700' : item.status === 'ABSENT' ? 'bg-coral-50 text-coral-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!filteredRecords.length && (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title="Mark Attendance" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleMarkSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Class"
              value={markForm.classId}
              onChange={(e) => setMarkForm((c) => ({ ...c, classId: e.target.value }))}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} · ${c.section}` }))}
            />
            <Input
              label="Date"
              type="date"
              value={markForm.date}
              onChange={(e) => setMarkForm((c) => ({ ...c, date: e.target.value }))}
              required
            />
            <Select
              label="Student"
              value={markForm.studentId}
              onChange={(e) => setMarkForm((c) => ({ ...c, studentId: e.target.value }))}
              options={students
                .filter((s) => !markForm.classId || s.classId === markForm.classId)
                .map((s) => ({ value: s.id, label: `${s.user?.name || s.name} (${s.admissionNo})` }))}
            />
            <Select
              label="Status"
              value={markForm.status}
              onChange={(e) => setMarkForm((c) => ({ ...c, status: e.target.value }))}
              options={[
                { value: 'PRESENT', label: 'PRESENT' },
                { value: 'ABSENT', label: 'ABSENT' },
                { value: 'LATE', label: 'LATE' },
                { value: 'LEAVE', label: 'LEAVE' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : 'Mark Attendance'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
