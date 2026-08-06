// PDF service — renders the HTML templates in src/templates/pdf into
// PDFs (fee receipts, ID cards, certificates, report cards) using Puppeteer.
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesDir = path.join(__dirname, '..', 'templates', 'pdf')

let browserPromise

function getBrowser() {
  if (!browserPromise) {
    browserPromise = (async () => {
      const puppeteer = await import('puppeteer')
      return puppeteer.default.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      })
    })()
    browserPromise.catch(() => { browserPromise = undefined })
  }
  return browserPromise
}

export async function renderPdf(template, data) {
  const html = await ejs.renderFile(path.join(templatesDir, template), data)
  const browser = await getBrowser()
  const page = await browser.newPage()
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const raw = await page.pdf({ format: 'A4', printBackground: true })

    // Puppeteer (v22+) returns a plain Uint8Array here, not a Node Buffer.
    // Express's res.send() only writes raw bytes for a real Buffer
    // (via Buffer.isBuffer) — anything else gets JSON.stringify'd, which
    // is what was corrupting every downloaded PDF. This conversion is
    // the actual fix.
    const buffer = Buffer.from(raw)

    if (buffer.length < 100 || buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
      throw new Error(`PDF generation produced an invalid document (length=${buffer.length})`)
    }
    return buffer
  } finally {
    await page.close()
  }
}

export const renderFeeReceipt = (data) => renderPdf('feeReceipt.html', data)
export const renderIdCard = (data) => renderPdf('idCard.html', data)
export const renderCertificate = (data) => renderPdf('certificate.html', data)
export const renderReportCard = (data) => renderPdf('reportCard.html', data)
export const renderDataReport = (data) => renderPdf('dataReport.html', data)