export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
      <span className="text-ink-soft">Page {page} of {pageCount}</span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn-secondary py-1.5 text-xs disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="btn-secondary py-1.5 text-xs disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
