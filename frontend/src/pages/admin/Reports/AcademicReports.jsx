import { useEffect, useState } from 'react'
import { GraduationCap, Award, BookOpen, Layers } from 'lucide-react'
import { reportApi } from '../../../api/reportApi'
import { downloadPdf } from '../../../utils/download'

export default function AcademicReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const download = async () => { setDownloading(true); try { downloadPdf(await reportApi.download('academic'), 'exam-report.pdf') } finally { setDownloading(false) } }

  useEffect(() => {
    reportApi.academic()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Academic Performance Reports</h1>
            <p className="mt-1 text-sm text-ink-soft">Institute-wide examination statistics and class-by-class performance summary.</p>
          </div>
        </div><button onClick={download} disabled={downloading} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{downloading ? 'Preparing…' : 'Download PDF'}</button></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3 text-brand-700">
            <BookOpen size={18} />
            <span className="text-sm font-semibold">Total Exams</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : data?.totalExams ?? 0}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-brand-700">
            <Award size={18} />
            <span className="text-sm font-semibold">Graded Results</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : data?.totalResultsRecorded ?? 0}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-brand-700">
            <Layers size={18} />
            <span className="text-sm font-semibold">Average Grade %</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : `${data?.averagePercentage ?? 0}%`}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Class Performance Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase text-ink-soft">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Exams Scheduled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(data?.classesSummary || []).map((cls) => (
                <tr key={cls.id}>
                  <td className="px-4 py-3 font-semibold text-ink">{cls.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{cls.section}</td>
                  <td className="px-4 py-3 text-ink-soft">{cls._count?.students ?? 0}</td>
                  <td className="px-4 py-3 text-ink-soft">{cls._count?.exams ?? 0}</td>
                </tr>
              ))}
              {(!data?.classesSummary || data.classesSummary.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-soft">No class performance data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
