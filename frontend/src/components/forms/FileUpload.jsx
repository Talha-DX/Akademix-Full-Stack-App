import { Upload } from 'lucide-react'

export default function FileUpload({ label, onChange, accept, hint }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-ink-soft hover:border-brand-300">
        <Upload size={18} />
        <span>{hint ?? 'Click to choose a file, or drag it here'}</span>
        <input type="file" accept={accept} onChange={onChange} className="hidden" />
      </div>
    </label>
  )
}
