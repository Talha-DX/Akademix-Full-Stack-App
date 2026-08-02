import Input from '../forms/Input'
import Select from '../forms/Select'

const statusOptions = ['Active', 'On hold', 'Archived']

export default function ClassForm({ form, onChange, onSubmit, submitting, submitLabel = 'Save class', onCancel }) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Class name" name="name" value={form.name} onChange={onChange} required />
        <Input label="Section" name="section" value={form.section} onChange={onChange} required />
        <Input label="Homeroom teacher" name="teacher" value={form.teacher} onChange={onChange} required />
        <Input label="Capacity" name="capacity" type="number" min="1" value={form.capacity} onChange={onChange} required />
        <div className="sm:col-span-2">
          <Select label="Status" name="status" value={form.status} onChange={onChange} options={statusOptions.map((item) => ({ value: item, label: item }))} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-tint">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
