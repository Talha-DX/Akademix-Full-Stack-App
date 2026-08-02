export default function FormWrapper({ title, description, onSubmit, children, footer }) {
  return (
    <form onSubmit={onSubmit} className="card p-6">
      {title && <p className="font-display text-base font-semibold text-ink">{title}</p>}
      {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
      {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
    </form>
  )
}
