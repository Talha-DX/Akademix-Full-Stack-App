export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <input
        className={`w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-400 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-coral-600">{error}</span>}
    </label>
  )
}
