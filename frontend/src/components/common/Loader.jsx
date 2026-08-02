export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
