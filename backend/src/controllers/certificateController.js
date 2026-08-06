// Certificate controller — bonafide/transfer/character certs, ID cards.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'
import { renderCertificate } from '../services/pdfService.js'
import { randomUUID } from 'crypto'

export const list = asyncHandler(async (req, res) => {
  const { studentId } = req.query
  const where = {
    student: { class: { schoolId: req.user.schoolId }, ...(req.user.role === 'STUDENT' ? { userId: req.user.id } : {}) },
    ...(studentId ? { studentId } : {}),
  }
  const rows = await prisma.certificate.findMany({
    where,
    include: { student: { include: { user: { select: { name: true } } } } },
    orderBy: { issuedDate: 'desc' },
  })
  res.json(rows)
})

export const create = asyncHandler(async (req, res) => {
  const { studentId, type, templateId } = req.body
  const student = await prisma.student.findFirst({ where: { id: studentId, class: { schoolId: req.user.schoolId } } })
  if (!student) return res.status(400).json({ message: 'Invalid studentId' })
  const templates = templateId ? await prisma.$queryRaw`SELECT "id", "type", "body" FROM "CertificateTemplate" WHERE "id" = ${templateId} AND "schoolId" = ${req.user.schoolId}` : []
  const template = templates[0] || null
  if (templateId && !template) return res.status(400).json({ message: 'Invalid certificate template' })
  const id = randomUUID()
  await prisma.$executeRaw`INSERT INTO "Certificate" ("id", "studentId", "type", "body", "issuedDate") VALUES (${id}, ${studentId}, ${template?.type || type}, ${template?.body || null}, NOW())`
  res.status(201).json({ id, studentId, type: template?.type || type })
})

export const remove = asyncHandler(async (req, res) => {
  await prisma.certificate.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export const listTemplates = asyncHandler(async (req, res) => {
  res.json(await prisma.$queryRaw`SELECT * FROM "CertificateTemplate" WHERE "schoolId" = ${req.user.schoolId} ORDER BY "createdAt" DESC`)
})
export const createTemplate = asyncHandler(async (req, res) => {
  const { name, type, body } = req.body
  const id = randomUUID()
  await prisma.$executeRaw`INSERT INTO "CertificateTemplate" ("id", "schoolId", "name", "type", "body", "createdAt") VALUES (${id}, ${req.user.schoolId}, ${name}, ${type}, ${body}, NOW())`
  res.status(201).json({ id, name, type, body })
})
export const updateTemplate = asyncHandler(async (req, res) => {
  const result = await prisma.$executeRaw`UPDATE "CertificateTemplate" SET "name" = COALESCE(${req.body.name || null}, "name"), "type" = COALESCE(${req.body.type || null}, "type"), "body" = COALESCE(${req.body.body || null}, "body") WHERE "id" = ${req.params.id} AND "schoolId" = ${req.user.schoolId}`
  if (!result) return res.status(404).json({ message: 'Certificate template not found' })
  res.json({ id: req.params.id })
})
export const removeTemplate = asyncHandler(async (req, res) => {
  const result = await prisma.$executeRaw`DELETE FROM "CertificateTemplate" WHERE "id" = ${req.params.id} AND "schoolId" = ${req.user.schoolId}`
  if (!result) return res.status(404).json({ message: 'Certificate template not found' })
  res.status(204).send()
})

export const downloadPdf = asyncHandler(async (req, res) => {
  const cert = await prisma.certificate.findFirst({
    where: {
      id: req.params.id,
      student: {
        class: { schoolId: req.user.schoolId },
        ...(req.user.role === 'STUDENT' ? { userId: req.user.id } : {}),
      },
    },
    include: { student: { include: { user: true, class: true } } },
  })
  if (!cert) return res.status(404).json({ message: 'Certificate not found' })

  const pdf = await renderCertificate({
    certificateType: cert.type,
    studentName: cert.student.user.name,
    certificateBody: (cert.body || 'Issued on {issuedDate}.').replaceAll('{studentName}', cert.student.user.name).replaceAll('{issuedDate}', cert.issuedDate.toLocaleDateString()),
  })
  res.type('application/pdf')
  res.attachment(`certificate-${cert.id}.pdf`)
  res.send(pdf)
})
