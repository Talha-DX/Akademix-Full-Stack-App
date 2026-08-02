export default function AnnouncementCard({ title, body, date, audience }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-ink">{title}</p>
        <span className="text-xs text-ink-soft">{date}</span>
      </div>
      <p className="mt-2 text-sm text-ink-soft">{body}</p>
      {audience && (
        <span className="mt-3 inline-block rounded-full bg-surface-tint px-2.5 py-1 text-xs text-ink-soft">
          {audience}
        </span>
      )}
    </div>
  )
}
