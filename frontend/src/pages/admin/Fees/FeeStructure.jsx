import { useEffect, useMemo, useState } from 'react'
import { DollarSign, PlusCircle, Search, Trash2, PencilLine } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { feeApi } from '../../../api/feeApi'
import { classApi } from '../../../api/classApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

const defaultForm = {
  classId: '',
  category: 'Tuition',
  amount: 0,
}

export default function FeeStructure() {
  const { notify } = useNotificationContext()
  const [structures, setStructures] = useState([])
  const [classes, setClasses] = useState([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [feeRes, classRes] = await Promise.all([
        feeApi.listStructures(),
        classApi.list(),
      ])
      const feeList = Array.isArray(feeRes.data) ? feeRes.data : []
      const classList = Array.isArray(classRes.data) ? classRes.data : []
      setStructures(feeList)
      setClasses(classList)
      if (classList.length && !form.classId) {
        setForm((prev) => ({ ...prev, classId: classList[0].id }))
      }
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to load fee structures.'), 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredStructures = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return structures
    return structures.filter((item) =>
      [item.category, item.class?.name].join(' ').toLowerCase().includes(term)
    )
  }, [structures, query])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...defaultForm, classId: classes[0]?.id || '' })
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      classId: item.classId || classes[0]?.id || '',
      category: item.category || 'Tuition',
      amount: Number(item.amount) || 0,
    })
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        classId: form.classId,
        category: form.category,
        amount: Number(form.amount) || 0,
      }
      if (editingId) {
        await feeApi.updateStructure(editingId, payload)
        notify('Fee structure updated successfully.', 'success')
      } else {
        await feeApi.createStructure(payload)
        notify('Fee structure created successfully.', 'success')
      }
      setModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
      await loadData()
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save fee structure.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this fee structure?')) {
      try {
        await feeApi.removeStructure(id)
        notify('Fee structure deleted successfully.', 'success')
        await loadData()
      } catch (error) {
        notify(getApiErrorMessage(error, 'Failed to delete fee structure.'), 'error')
      }
    }
  }

  const totalFeeAmount = structures.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Fee Ledger & Structures</p>
              <p className="mt-1 text-sm text-ink-soft">Define fee categories and amounts per class in PostgreSQL.</p>
            </div>
            <button onClick={openCreate} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              <span className="flex items-center gap-2"><PlusCircle size={16} /> Add Fee Structure</span>
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">{structures.length}</p>
              <p className="mt-1 text-sm text-ink-soft">Fee Categories</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-tint p-4">
              <p className="text-2xl font-semibold text-ink">${totalFeeAmount.toLocaleString()}</p>
              <p className="mt-1 text-sm text-ink-soft">Total Standard Fee</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><DollarSign size={18} /></div>
            <div><p className="font-display text-lg font-semibold text-ink">Search fee structures</p><p className="text-sm text-ink-soft">Filter items by class or category.</p></div>
          </div>
          <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search fees" className="w-full bg-transparent outline-none" />
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Amount ($)</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredStructures.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.class ? `${item.class.name} - ${item.class.section}` : 'N/A'}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.category}</td>
                  <td className="px-5 py-3.5 text-ink-soft">${Number(item.amount).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="rounded-lg border border-line p-2 text-ink-soft hover:bg-surface-tint">
                        <PencilLine size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredStructures.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-sm text-ink-soft">
                    No fee structures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Fee Structure' : 'Add Fee Structure'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Class"
              name="classId"
              value={form.classId}
              onChange={handleChange}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} · ${c.section}` }))}
            />
            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={['Tuition', 'Transport', 'Library', 'Sports', 'Exam Fee', 'Uniform'].map((cat) => ({ value: cat, label: cat }))}
            />
            <div className="sm:col-span-2">
              <Input label="Amount ($)" name="amount" type="number" min="0" value={form.amount} onChange={handleChange} required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
