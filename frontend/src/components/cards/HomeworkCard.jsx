export default function HomeworkCard({ title, subject, due, status }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-tint px-3 py-2.5 text-sm">
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-soft">{subject}</p>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          status === 'submitted' ? 'bg-brand-50 text-brand-700' : 'bg-coral-500/10 text-coral-600'
        }`}
      >
        {due}
      </span>
    </div>
  )
}
