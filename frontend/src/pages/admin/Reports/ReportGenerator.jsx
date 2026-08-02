import { useMemo, useState } from 'react'
import { FileBarChart, PlusCircle, Search, Trash2 } from 'lucide-react'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/forms/Input'
import Select from '../../../components/forms/Select'
import { createReport, deleteReport, getReports } from '../../../utils/adminModuleStore'

const defaultForm = {
  title: '',
  type: 'Academics',
  generatedAt: new Date().toISOString().slice(0, 10),
  owner: '',
}

export default function ReportGenerator() {
  const [reports, setReports] = useState(getReports)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const filteredReports = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return reports
    return reports.filter((item) => [item.title, item.type, item.owner].join(' ').toLowerCase().includes(term))
  }, [reports, query])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)
    createReport(form)
    setReports(getReports())
    setModalOpen(false)
    setForm(defaultForm)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this report?')) {
      deleteReport(id)
      setReports(getReports())
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Report center</p>
            <p className="mt-1 text-sm text-ink-soft">Generate and manage school reports for academics, students, and finance.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"><span className="flex items-center gap-2"><PlusCircle size={16} /> Create report</span></button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-soft"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports" className="w-full bg-transparent outline-none" /></div>
          <div className="rounded-2xl border border-line bg-surface-tint px-3 py-2 text-sm text-ink-soft">{reports.length} reports</div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-tint text-xs font-mono uppercase tracking-wide text-ink-soft"><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Generated</th><th className="px-5 py-3">Owner</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-line">
              {filteredReports.map((item) => (
                <tr key={item.id} className="bg-white/70">
                  <td className="px-5 py-3.5 font-semibold text-ink">{item.title}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.type}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.generatedAt}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{item.owner}</td>
                  <td className="px-5 py-3.5"><div className="flex justify-end"><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-line p-2 text-coral-600 hover:bg-coral-50"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title="Create report" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Report title" name="title" value={form.title} onChange={handleChange} required />
            <Select label="Type" name="type" value={form.type} onChange={handleChange} options={['Academics', 'Finance', 'Student', 'Attendance'].map((item) => ({ value: item, label: item }))} />
            <Input label="Generated date" name="generatedAt" type="date" value={form.generatedAt} onChange={handleChange} required />
            <Input label="Owner" name="owner" value={form.owner} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Saving…' : 'Create report'}</button></div>
        </form>
      </Modal>
    </div>
  )
}
