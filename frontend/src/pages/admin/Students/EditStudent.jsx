import { useEffect, useMemo, useState } from 'react'
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { classApi } from '../../../api/classApi'
import { studentApi } from '../../../api/studentApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage, normalizeStudent } from '../../../utils/adminPeople'

export default function EditStudent() {
  const { notify } = useNotificationContext()
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [targetClassId, setTargetClassId] = useState('')
  const [selectedStudentIds, setSelectedStudentIds] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [classesRes, studentsRes] = await Promise.all([
        classApi.list(),
        studentApi.list({ page: 1, limit: 400 }),
      ])
      const nextClasses = Array.isArray(classesRes.data) ? classesRes.data : []
      setClasses(nextClasses)
      setStudents((studentsRes.data?.data || []).map(normalizeStudent))
      if (nextClasses.length) {
        setSelectedClassId((current) => current || nextClasses[0].id)
        setTargetClassId((current) => current || nextClasses[Math.min(1, nextClasses.length - 1)].id)
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load promotion data.'), 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const sourceStudents = useMemo(
    () => students.filter((student) => student.classId === selectedClassId),
    [students, selectedClassId]
  )

  const toggleStudent = (id) => {
    setSelectedStudentIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const handlePromote = async () => {
    if (!selectedStudentIds.length) {
      notify('Select at least one student to promote.', 'info')
      return
    }
    if (!targetClassId || targetClassId === selectedClassId) {
      notify('Choose a different target class.', 'info')
      return
    }

    setSubmitting(true)
    try {
      const selectedStudents = students.filter((student) => selectedStudentIds.includes(student.id))
      await Promise.all(
        selectedStudents.map((student) =>
          studentApi.update(student.id, {
            name: student.name,
            phone: student.phone || undefined,
            classId: targetClassId,
            dob: student.dob,
          })
        )
      )
      notify('Students promoted successfully.', 'success')
      setSelectedStudentIds([])
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Unable to promote students.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <ArrowRightLeft size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Promote students</p>
            <p className="mt-1 text-sm text-ink-soft">Move selected students to the next class with one action.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Select
            label="From class"
            value={selectedClassId}
            onChange={(event) => {
              setSelectedClassId(event.target.value)
              setSelectedStudentIds([])
            }}
            options={classes.map((item) => ({ value: item.id, label: `${item.name} · ${item.section}` }))}
          />
          <Select
            label="To class"
            value={targetClassId}
            onChange={(event) => setTargetClassId(event.target.value)}
            options={classes.map((item) => ({ value: item.id, label: `${item.name} · ${item.section}` }))}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-semibold text-ink">Students in source class</p>
          <p className="text-sm text-ink-soft">{selectedStudentIds.length} selected</p>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Select</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Admission</th>
                <th className="px-5 py-3">DOB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sourceStudents.map((student) => (
                <tr key={student.id} className="bg-white/70">
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="h-4 w-4 rounded border-line"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink">{student.name}</p>
                    <p className="text-xs text-ink-soft">{student.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">{student.admissionNo}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{student.dob}</td>
                </tr>
              ))}
              {!sourceStudents.length && (
                <tr><td className="px-5 py-6 text-sm text-ink-soft" colSpan={4}>No students found in this class.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handlePromote} disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {submitting ? 'Promoting…' : 'Promote selected students'}
          </span>
        </button>
      </div>
    </div>
  )
}
