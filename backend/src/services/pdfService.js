// PDF service — renders the HTML templates in src/templates/pdf into
// PDFs (fee receipts, ID cards, certificates, report cards) using
// Puppeteer. Add "puppeteer" to package.json dependencies before use:
//   npm install puppeteer
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesDir = path.join(__dirname, '..', 'templates', 'pdf')

export async function renderPdf(template, data) {
  const html = await ejs.renderFile(path.join(templatesDir, template), data)
  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.default.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const buffer = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()
  return buffer
}

export const renderFeeReceipt = (data) => renderPdf('feeReceipt.html', data)
export const renderIdCard = (data) => renderPdf('idCard.html', data)
export const renderCertificate = (data) => renderPdf('certificate.html', data)
export const renderReportCard = (data) => renderPdf('reportCard.html', data)
export const renderDataReport = (data) => renderPdf('dataReport.html', data)
