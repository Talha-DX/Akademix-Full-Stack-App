// Email service — renders EJS templates and sends via the configured
// SMTP transport. Fails silently with a console warning if SMTP isn't
// configured, so the app still works locally without email set up.
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'
import { mailer } from '../config/email.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesDir = path.join(__dirname, '..', 'templates', 'emails')

async function send(to, subject, template, data) {
  if (!process.env.SMTP_HOST) {
    console.warn(`SMTP not configured — skipping email "${subject}" to ${to}`)
    return
  }
  const html = await ejs.renderFile(path.join(templatesDir, template), data)
  await mailer.sendMail({ from: process.env.SMTP_USER, to, subject, html })
}

export const sendWelcomeEmail = (to, data) => send(to, 'Welcome to Akademix', 'welcome.ejs', data)
export const sendPasswordResetEmail = (to, data) => send(to, 'Reset your password', 'resetPassword.ejs', data)
export const sendAnnouncementEmail = (to, data) => send(to, data.title || 'Announcement', 'announcement.ejs', data)
