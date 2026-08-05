import { useEffect, useState } from 'react'
import { Sparkles, Users } from 'lucide-react'
import { studentApi } from '../../../api/studentApi'

/** A distinct student-engagement overview; it intentionally does not reuse reports or exams. */
export default function BehaviourSkills() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    studentApi.list({ limit: 100 })
      .then(({ data }) => setStudents(data?.data || (Array.isArray(data) ? data : [])))
      .finally(() => setLoading(false))
  }, [])
  const classes = new Set(students.map((student) => student.classId)).size
  return <div className="space-y-6"><div className="card p-6"><div className="flex items-center gap-3"><div className="rounded-2xl bg-purple-50 p-3 text-purple-700"><Sparkles size={20} /></div><div><p className="font-display text-xl font-semibold text-ink">Behaviour & Skills</p><p className="mt-1 text-sm text-ink-soft">A dedicated student engagement overview, separate from exams and reports.</p></div></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="card p-5"><div className="flex items-center gap-2 text-ink-soft"><Users size={17} /><span className="text-sm font-medium">Students to review</span></div><p className="mt-3 text-3xl font-semibold text-ink">{loading ? '…' : students.length}</p></div><div className="card p-5"><p className="text-sm font-medium text-ink-soft">Classes represented</p><p className="mt-3 text-3xl font-semibold text-ink">{loading ? '…' : classes}</p></div></div><div className="card overflow-hidden"><div className="p-6"><p className="font-display text-base font-semibold text-ink">Student list</p><p className="mt-1 text-sm text-ink-soft">Use this unique workspace to review behaviour and skills with each learner.</p></div><table className="min-w-full text-left text-sm"><thead className="bg-surface-tint text-xs font-mono uppercase text-ink-soft"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Admission no.</th></tr></thead><tbody className="divide-y divide-line">{students.map((student) => <tr key={student.id}><td className="px-5 py-3.5 font-medium text-ink">{student.user?.name}</td><td className="px-5 py-3.5 text-ink-soft">{student.class?.name} {student.class?.section}</td><td className="px-5 py-3.5 text-ink-soft">{student.admissionNo}</td></tr>)}{!loading && !students.length && <tr><td colSpan="3" className="px-5 py-6 text-center text-ink-soft">No students found.</td></tr>}</tbody></table></div></div>
}
