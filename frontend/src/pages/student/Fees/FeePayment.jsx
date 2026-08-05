import { useEffect, useState } from 'react'
import { Wallet, Download } from 'lucide-react'
import { feeApi } from '../../../api/feeApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const STATUS_STYLES = {
  PAID: 'bg-brand-50 text-brand-700',
  DUE: 'bg-amber-500/10 text-amber-600',
  OVERDUE: 'bg-coral-50 text-coral-600',
}

export default function FeePayment() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [invoices, setInvoices] = useState([])
  const [payingId, setPayingId] = useState(null)
  const studentId = user?.student?.id

  const load = () => {
    if (!studentId) return
    feeApi.listInvoices({ studentId })
      .then((res) => setInvoices(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load your invoices.'), 'error'))
  }

  useEffect(() => { load() }, [studentId])

  const handlePay = async (id) => {
    if (!window.confirm('Confirm this payment? This marks the invoice as paid.')) return
    setPayingId(id)
    try {
      await feeApi.payInvoice(id)
      notify('Payment recorded.', 'success')
      load()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to record payment.'), 'error')
    } finally {
      setPayingId(null)
    }
  }

  const handleReceipt = async (id) => {
    try {
      const res = await feeApi.downloadReceipt(id)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `receipt-${id}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Receipt not available yet.'), 'error')
    }
  }

  if (!studentId) {
    return <div className="card p-6 text-sm text-ink-soft">Your student profile could not be found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <Wallet size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">My fees</p>
            <p className="mt-1 text-sm text-ink-soft">Your invoices, real balances from the database.</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Term</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Due date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoices.map((inv) => (
              <tr key={inv.id} className="bg-white/70">
                <td className="px-5 py-3.5 text-ink">{inv.term}</td>
                <td className="px-5 py-3.5 text-ink">{inv.amount}</td>
                <td className="px-5 py-3.5 text-ink-soft">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[inv.status] || 'bg-surface-tint text-ink-soft'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  {inv.status === 'PAID' ? (
                    <button onClick={() => handleReceipt(inv.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-surface-tint">
                      <Download size={12} /> Receipt
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePay(inv.id)}
                      disabled={payingId === inv.id}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60"
                    >
                      {payingId === inv.id ? 'Processing…' : 'Pay now'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!invoices.length && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-sm text-ink-soft">No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
