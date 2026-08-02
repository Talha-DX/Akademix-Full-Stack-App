/**
 * Shared shell for a module page that doesn't have live data wired up yet.
 * Each page file passes its own title/description so the module still
 * reads as a real, purpose-built screen rather than a generic stub.
 */
export default function ModulePlaceholder({ title, description }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-soft">{description}</p>
    </div>
  )
}
