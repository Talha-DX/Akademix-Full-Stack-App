import { useEffect, useState } from 'react'
import { resultApi } from '../../../api/resultApi'
import { useAuth } from '../../../hooks/useAuth'

export default function MyResults() {
  const { user } = useAuth()
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user?.student?.id) return
    resultApi.byStudent(user.student.id).then(({ data }) => setResults(data)).catch(() => setError('Results could not be loaded.'))
  }, [user?.student?.id])
  if (error) return <div className="card p-6 text-sm text-coral-600">{error}</div>
  if (!results) return <div className="card p-6 text-sm text-ink-soft">Loading results…</div>
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-5 py-3">Subject</th>
            <th className="px-5 py-3">Marks</th>
            <th className="px-5 py-3">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {results.length ? results.map((r) => (
            <tr key={r.id}>
              <td className="px-5 py-3.5 font-medium text-ink">{r.subject?.name} <span className="text-xs font-normal text-ink-soft">{r.exam?.name}</span></td>
              <td className="px-5 py-3.5 text-ink-soft">{r.marks}/{r.maxMarks}</td>
              <td className="px-5 py-3.5">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{r.grade}</span>
              </td>
            </tr>
          )) : <tr><td colSpan="3" className="px-5 py-6 text-center text-ink-soft">No results have been published.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
