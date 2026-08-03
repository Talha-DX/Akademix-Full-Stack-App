import { useEffect, useState } from 'react'
import { DollarSign, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import { reportApi } from '../../../api/reportApi'

export default function FinancialReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportApi.financial()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
            <DollarSign size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Financial Reports & Fee Ledger</h1>
            <p className="mt-1 text-sm text-ink-soft">Real-time revenue, collection rates, and pending fee balances.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 text-ink-soft">
            <CreditCard size={18} />
            <span className="text-sm font-semibold">Total Invoices</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : data?.totalInvoices ?? 0}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-brand-700">
            <DollarSign size={18} />
            <span className="text-sm font-semibold">Total Billed</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">{loading ? '…' : `$${(data?.totalBilled ?? 0).toLocaleString()}`}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-emerald-700">
            <TrendingUp size={18} />
            <span className="text-sm font-semibold">Total Collected</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{loading ? '…' : `$${(data?.totalPaid ?? 0).toLocaleString()}`}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-coral-700">
            <AlertCircle size={18} />
            <span className="text-sm font-semibold">Pending Balance</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-coral-600">{loading ? '…' : `$${(data?.totalPending ?? 0).toLocaleString()}`}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Collection Rate Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Collection Progress</span>
              <span>{data?.collectionRatePercentage ?? 100}%</span>
            </div>
            <div className="w-full h-3 bg-surface-tint rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-500"
                style={{ width: `${data?.collectionRatePercentage ?? 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
