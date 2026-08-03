import { useEffect, useState } from 'react'
import { Users, GraduationCap, Building2 } from 'lucide-react'
import { reportApi } from '../../../api/reportApi'

export default function StudentReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportApi.student()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-purple-50 p-3 text-purple-700">
            <Users size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Student Demographics & Reports</h1>
            <p className="mt-1 text-sm text-ink-soft">Enrolment statistics and class distribution across the institute.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center gap-3 text-purple-700">
            <GraduationCap size={18} />
            <span className="text-sm font-semibold">Total Students</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : data?.totalStudents ?? 0}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-purple-700">
            <Building2 size={18} />
            <span className="text-sm font-semibold">Total Classes</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : data?.totalClasses ?? 0}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Class Enrolment Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase text-ink-soft">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Enrolled Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(data?.studentsPerClass || []).map((cls) => (
                <tr key={cls.id}>
                  <td className="px-4 py-3 font-semibold text-ink">{cls.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{cls.section}</td>
                  <td className="px-4 py-3 text-ink-soft">{cls._count?.students ?? 0}</td>
                </tr>
              ))}
              {(!data?.studentsPerClass || data.studentsPerClass.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-soft">No class enrolment data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
