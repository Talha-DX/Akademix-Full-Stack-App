import { useEffect, useState } from 'react'
import { feeApi } from '../../../api/feeApi'
import { useAuth } from '../../../hooks/useAuth'

export default function MyFees() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user?.student?.id) return
    feeApi.listInvoices({ studentId: user.student.id }).then(({ data }) => setInvoices(data)).catch(() => setError('Fee invoices could not be loaded.'))
  }, [user?.student?.id])
  if (error) return <div className="card p-6 text-sm text-coral-600">{error}</div>
  if (!invoices) return <div className="card p-6 text-sm text-ink-soft">Loading fee invoices…</div>
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-5 py-3">Term</th>
            <th className="px-5 py-3">Amount</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {invoices.length ? invoices.map((f) => (
            <tr key={f.id}>
              <td className="px-5 py-3.5 font-medium text-ink">{f.feeStructure?.category ?? 'Fee'} · {new Date(f.dueDate).toLocaleDateString()}</td>
              <td className="px-5 py-3.5 text-ink-soft">Rs. {Number(f.amount).toLocaleString()}</td>
              <td className="px-5 py-3.5">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    f.status === 'PAID' ? 'bg-brand-50 text-brand-700' : 'bg-coral-500/10 text-coral-600'
                  }`}
                >
                  {f.status}
                </span>
              </td>
            </tr>
          )) : <tr><td colSpan="3" className="px-5 py-6 text-center text-ink-soft">No invoices found.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
