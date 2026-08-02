// Class controller — grade/section management.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

const include = { students: { select: { id: true } }, subjects: true }

export const list = asyncHandler(async (req, res) => {
  const classes = await prisma.class.findMany({ where: { schoolId: req.user.schoolId }, include, orderBy: { name: 'asc' } })
  res.json(classes)
})

export const getById = asyncHandler(async (req, res) => {
  const klass = await prisma.class.findFirst({ where: { id: req.params.id, schoolId: req.user.schoolId }, include })
  if (!klass) return res.status(404).json({ message: 'Class not found' })
  res.json(klass)
})

export const create = asyncHandler(async (req, res) => {
  const { name, section } = req.body
  const klass = await prisma.class.create({ data: { name, section, schoolId: req.user.schoolId } })
  res.status(201).json(klass)
})

export const update = asyncHandler(async (req, res) => {
  const result = await prisma.class.updateMany({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: req.body,
  })
  if (!result.count) return res.status(404).json({ message: 'Class not found' })
  res.json(await prisma.class.findUnique({ where: { id: req.params.id } }))
})

export const remove = asyncHandler(async (req, res) => {
  const result = await prisma.class.deleteMany({ where: { id: req.params.id, schoolId: req.user.schoolId } })
  if (!result.count) return res.status(404).json({ message: 'Class not found' })
  res.status(204).send()
})
