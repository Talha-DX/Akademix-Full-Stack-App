import { useEffect, useMemo, useState } from 'react'
import { Download, BadgeCheck } from 'lucide-react'
import Select from '../../../components/forms/Select'
import { studentApi } from '../../../api/studentApi'
import { staffApi } from '../../../api/staffApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import {
  getApiErrorMessage,
  normalizeStaff,
  normalizeStudent,
} from '../../../utils/adminPeople'

export default function IDCardGenerator() {
  const { notify } = useNotificationContext()
  const [students, setStudents] = useState([])
  const [staff, setStaff] = useState([])
  const [mode, setMode] = useState('STUDENT')
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const [studentsRes, staffRes] = await Promise.all([
          studentApi.list({ page: 1, limit: 200 }),
          staffApi.list({ page: 1, limit: 200 }),
        ])
        const nextStudents = (studentsRes.data?.data || []).map(normalizeStudent)
        const nextStaff = (staffRes.data?.data || []).map(normalizeStaff)
        setStudents(nextStudents)
        setStaff(nextStaff)
        setSelectedId(nextStudents[0]?.id || '')
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to load ID card data.'), 'error')
      }
    }
    loadPeople()
  }, [])

  const options = useMemo(() => {
    if (mode === 'STUDENT') {
      return students.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.admissionNo})`,
      }))
    }
    return staff.map((item) => ({
      value: item.id,
      label: `${item.name} (${item.department})`,
    }))
  }, [mode, students, staff])

  const selected = useMemo(() => {
    if (mode === 'STUDENT') return students.find((item) => item.id === selectedId)
    return staff.find((item) => item.id === selectedId)
  }, [mode, selectedId, students, staff])

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><BadgeCheck size={18} /></div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">ID card generator</p>
            <p className="mt-1 text-sm text-ink-soft">Generate cards from live student and employee data.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Select
            label="Card type"
            value={mode}
            onChange={(event) => {
              const nextMode = event.target.value
              setMode(nextMode)
              setSelectedId(nextMode === 'STUDENT' ? students[0]?.id || '' : staff[0]?.id || '')
            }}
            options={[
              { value: 'STUDENT', label: 'Student ID card' },
              { value: 'STAFF', label: 'Employee ID card' },
            ]}
          />
          <Select
            label="Select person"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            options={options}
          />
          <button onClick={() => window.print()} className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            <span className="flex items-center justify-center gap-2"><Download size={16} /> Print ID card</span>
          </button>
        </div>
      </div>

      <div className="card p-6">
        {selected ? (
          <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-6 shadow-soft">
            <div className="rounded-2xl bg-brand-600 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-wide opacity-90">Akademix Institute</p>
              <p className="font-display text-lg font-semibold">Official ID Card</p>
            </div>
            <div className="mt-5 space-y-3">
              <p className="text-xl font-semibold text-ink">{selected.name}</p>
              {mode === 'STUDENT' ? (
                <>
                  <p className="text-sm text-ink-soft">Admission No: {selected.admissionNo}</p>
                  <p className="text-sm text-ink-soft">Class: {selected.className} · {selected.section}</p>
                  <p className="text-sm text-ink-soft">DOB: {selected.dob}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-ink-soft">Department: {selected.department}</p>
                  <p className="text-sm text-ink-soft">Designation: {selected.title}</p>
                  <p className="text-sm text-ink-soft">Subjects assigned: {selected.subjectCount}</p>
                </>
              )}
              <p className="text-sm text-ink-soft">Email: {selected.email}</p>
              <p className="text-sm text-ink-soft">Phone: {selected.phone || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-6 text-sm text-ink-soft">
            Select a person to preview the ID card.
          </div>
        )}
      </div>
    </div>
  )
}
