import { useMemo, useState } from 'react'
import { DollarSign, PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createFee, deleteFee, getFees, updateFee } from '../../../utils/adminModuleStore'

const defaultForm = {
  student: '',
  category: 'Tuition',
  amount: 0,
  status: 'Pending',
  dueDate: new Date().toISOString().slice(0, 10),
}

export default function FeeStructure() {
  const [fees, setFees] = useState(getFees)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredFees = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return fees
    return fees.filter((item) => [item.student, item.category, item.status].join(' ').toLowerCase().includes(term))
  }, [fees, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      student: item.student,
      category: item.category,
      amount: item.amount,
      status: item.status,
      dueDate: item.dueDate,
    })
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)
    const payload = { ...form, amount: Number(form.amount) || 0 }
    const next = editingId ? updateFee(editingId, payload) : createFee(payload)
    setFees(next)
    setModalOpen(false)
    setForm(defaultForm)
    setEditingId(null)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this fee record?')) {
      setFees(deleteFee(id))
    }
  }

  const pendingAmount = fees.filter((item) => item.status === 'Pending').reduce((total, item) => total + Number(item.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Fee ledger</p>
              <p className="mt-1 text-sm text-ink-soft">Manage tuition and miscellaneous fees with status and due dates.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"><span className="flex items-center gap-2"><PlusCircle size={16} /> Add fee</span></button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-2xl font-semibold text-ink">{fees.length}</p><p className="mt-1 text-sm text-ink-soft">Fee entries</p></div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4"><p className="text-2xl font-semibold text-ink">{pendingAmount.toLocaleString()}</p><p className="mt-1 text-sm text-ink-soft">Pending</p></div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><DollarSign size={18} /></div>
            <div><p className="font-display text-lg font-semibold text-ink">Search fees</p><p className="text-sm text-ink-soft">Filter ledger items by student or status.</p></div>
          </div>
          <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search fees" className="w-full bg-transparent outline-none" /></label>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Due date</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-line">
              {filteredFees.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.student}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.category}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{Number(item.amount).toLocaleString()}</td>
                  <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Paid' ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600'}`}>{item.status}</span></td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.dueDate}</td>
                  <td className="px-5 py-3.5"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint"><PencilLine size={16} /></button><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit fee' : 'Add fee'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Student" name="student" value={form.student} onChange={handleChange} required />
            <Select label="Category" name="category" value={form.category} onChange={handleChange} options={['Tuition', 'Transport', 'Library', 'Sports'].map((item) => ({ value: item, label: item }))} />
            <Input label="Amount" name="amount" type="number" min="0" value={form.amount} onChange={handleChange} required />
            <Select label="Status" name="status" value={form.status} onChange={handleChange} options={['Paid', 'Pending', 'Overdue'].map((item) => ({ value: item, label: item }))} />
            <Input label="Due date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
    </div>
  )
}
