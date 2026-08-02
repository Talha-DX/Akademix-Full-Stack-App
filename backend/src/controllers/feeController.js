// Fee controller — fee structures (per class/category) + student invoices.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

// --- Fee structures ---

export const listStructures = asyncHandler(async (req, res) => {
  const { classId } = req.query
  const where = { class: { schoolId: req.user.schoolId }, ...(classId ? { classId } : {}) }
  const rows = await prisma.feeStructure.findMany({ where, include: { class: true } })
  res.json(rows)
})

export const createStructure = asyncHandler(async (req, res) => {
  const { classId, category, amount } = req.body
  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })
  const structure = await prisma.feeStructure.create({ data: { classId, category, amount } })
  res.status(201).json(structure)
})

export const updateStructure = asyncHandler(async (req, res) => {
  const updated = await prisma.feeStructure.update({ where: { id: req.params.id }, data: req.body })
  res.json(updated)
})

export const removeStructure = asyncHandler(async (req, res) => {
  await prisma.feeStructure.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

// --- Invoices ---

export const listInvoices = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query
  const where = {
    student: { class: { schoolId: req.user.schoolId } },
    ...(studentId ? { studentId } : {}),
    ...(status ? { status } : {}),
  }
  const rows = await prisma.feeInvoice.findMany({
    where,
    include: { student: { include: { user: { select: { name: true } } } }, feeStructure: true },
    orderBy: { dueDate: 'asc' },
  })
  res.json(rows)
})

export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await prisma.feeInvoice.create({ data: req.body })
  res.status(201).json(invoice)
})

// PUT /api/fees/invoices/:id/pay
export const payInvoice = asyncHandler(async (req, res) => {
  const invoice = await prisma.feeInvoice.update({
    where: { id: req.params.id },
    data: { status: 'PAID', paidAt: new Date() },
  })
  res.json(invoice)
})

export const removeInvoice = asyncHandler(async (req, res) => {
  await prisma.feeInvoice.delete({ where: { id: req.params.id } })
  res.status(204).send()
})
