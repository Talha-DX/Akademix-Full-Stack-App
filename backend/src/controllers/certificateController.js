// Certificate controller — bonafide/transfer/character certs, ID cards.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'
import { renderCertificate } from '../services/pdfService.js'

export const list = asyncHandler(async (req, res) => {
  const { studentId } = req.query
  const where = {
    student: { class: { schoolId: req.user.schoolId } },
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
  const { studentId, type } = req.body
  const student = await prisma.student.findFirst({ where: { id: studentId, class: { schoolId: req.user.schoolId } } })
  if (!student) return res.status(400).json({ message: 'Invalid studentId' })
  const cert = await prisma.certificate.create({ data: { studentId, type } })
  res.status(201).json(cert)
})

export const remove = asyncHandler(async (req, res) => {
  await prisma.certificate.delete({ where: { id: req.params.id } })
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
    certificateBody: `Issued on ${cert.issuedDate.toLocaleDateString()}.`,
  })
  res.type('application/pdf')
  res.attachment(`certificate-${cert.id}.pdf`)
  res.send(pdf)
})
