// Email transport config — Nodemailer transport used by
// services/emailService.js for welcome emails, password resets, and
// announcement notifications. If SMTP_HOST is unset (e.g. local dev
// without email configured), transport calls will simply fail — callers
// should not assume delivery is guaranteed.
import nodemailer from 'nodemailer'

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
})
