// Client-side PDF helpers — STUB.
// For heavy PDFs (report cards, certificates), prefer generating them
// server-side via backend/src/services/pdfService.js and just downloading
// the result here.
//
// export async function downloadPdf(url, filename) {
//   const res = await fetch(url)
//   const blob = await res.blob()
//   const link = document.createElement('a')
//   link.href = URL.createObjectURL(blob)
//   link.download = filename
//   link.click()
// }
