// CSV/Excel export helpers — STUB.
// Used by components/tables/TableActions.jsx "Export" buttons.
//
// export function exportToCsv(rows, filename = 'export.csv') {
//   const header = Object.keys(rows[0] ?? {}).join(',')
//   const body = rows.map((r) => Object.values(r).join(',')).join('\n')
//   const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' })
//   const link = document.createElement('a')
//   link.href = URL.createObjectURL(blob)
//   link.download = filename
//   link.click()
// }
