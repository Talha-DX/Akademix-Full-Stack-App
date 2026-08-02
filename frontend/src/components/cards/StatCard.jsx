export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="card group relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-200/25 blur-2xl transition group-hover:scale-150" aria-hidden="true" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.1em] text-ink-soft">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
        </div>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-cyan-50 text-brand-600 shadow-sm shadow-brand-500/10">
            <Icon size={18} />
          </span>
        )}
      </div>
    </div>
  )
}
