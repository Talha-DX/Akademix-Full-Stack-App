export default function EventCard({ title, date, time, location }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <span className="text-xs font-semibold uppercase">{date?.split(' ')[0]}</span>
        <span className="text-sm font-bold">{date?.split(' ')[1]}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-soft">{time} {location && `· ${location}`}</p>
      </div>
    </div>
  )
}
