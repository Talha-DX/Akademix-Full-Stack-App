export default function TableActions({ onEdit, onDelete, onView }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {onView && <button onClick={onView} className="text-brand-600 hover:underline">View</button>}
      {onEdit && <button onClick={onEdit} className="text-ink-soft hover:text-ink">Edit</button>}
      {onDelete && <button onClick={onDelete} className="text-coral-600 hover:underline">Delete</button>}
    </div>
  )
}
