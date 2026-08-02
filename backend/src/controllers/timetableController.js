// Timetable controller — weekly period grid per class.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

const include = { subject: true, teacher: { include: { user: { select: { name: true } } } }, class: true }

export const list = asyncHandler(async (req, res) => {
  const { classId, teacherId } = req.query
  const where = {
    class: { schoolId: req.user.schoolId },
    ...(classId ? { classId } : {}),
    ...(teacherId ? { teacherId } : {}),
  }
  const rows = await prisma.timetable.findMany({ where, include, orderBy: [{ day: 'asc' }, { period: 'asc' }] })
  res.json(rows)
})

export const create = asyncHandler(async (req, res) => {
  const { classId, day, period, subjectId, teacherId } = req.body
  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })
  const entry = await prisma.timetable.create({ data: { classId, day, period, subjectId, teacherId }, include })
  res.status(201).json(entry)
})

export const update = asyncHandler(async (req, res) => {
  const entry = await prisma.timetable.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!entry) return res.status(404).json({ message: 'Timetable entry not found' })
  const updated = await prisma.timetable.update({ where: { id: entry.id }, data: req.body, include })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  const entry = await prisma.timetable.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!entry) return res.status(404).json({ message: 'Timetable entry not found' })
  await prisma.timetable.delete({ where: { id: entry.id } })
  res.status(204).send()
})
