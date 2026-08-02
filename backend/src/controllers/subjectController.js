// Subject controller — subjects per class, with an assigned teacher.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

const include = { class: true, teacher: { include: { user: { select: { id: true, name: true } } } } }

export const list = asyncHandler(async (req, res) => {
  const where = {
    class: { schoolId: req.user.schoolId },
    ...(req.query.classId ? { classId: req.query.classId } : {}),
  }
  const subjects = await prisma.subject.findMany({ where, include })
  res.json(subjects)
})

export const getById = asyncHandler(async (req, res) => {
  const subject = await prisma.subject.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } }, include })
  if (!subject) return res.status(404).json({ message: 'Subject not found' })
  res.json(subject)
})

export const create = asyncHandler(async (req, res) => {
  const { name, classId, teacherId } = req.body
  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })
  const subject = await prisma.subject.create({ data: { name, classId, teacherId: teacherId || null }, include })
  res.status(201).json(subject)
})

export const update = asyncHandler(async (req, res) => {
  const subject = await prisma.subject.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!subject) return res.status(404).json({ message: 'Subject not found' })
  const updated = await prisma.subject.update({ where: { id: subject.id }, data: req.body, include })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  const subject = await prisma.subject.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!subject) return res.status(404).json({ message: 'Subject not found' })
  await prisma.subject.delete({ where: { id: subject.id } })
  res.status(204).send()
})

// PUT /api/subjects/:id/assign-teacher
export const assignTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body
  const subject = await prisma.subject.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!subject) return res.status(404).json({ message: 'Subject not found' })
  const updated = await prisma.subject.update({ where: { id: subject.id }, data: { teacherId }, include })
  res.json(updated)
})
