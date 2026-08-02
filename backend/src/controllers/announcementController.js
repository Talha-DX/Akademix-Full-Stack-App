// Announcement controller — school-wide or role-targeted notices.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

export const list = asyncHandler(async (req, res) => {
  const rows = await prisma.announcement.findMany({
    where: {
      schoolId: req.user.schoolId,
      audience: { in: ['ALL', req.user.role] },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(rows)
})

export const getById = asyncHandler(async (req, res) => {
  const row = await prisma.announcement.findFirst({ where: { id: req.params.id, schoolId: req.user.schoolId } })
  if (!row) return res.status(404).json({ message: 'Announcement not found' })
  res.json(row)
})

export const create = asyncHandler(async (req, res) => {
  const { title, body, audience } = req.body
  const row = await prisma.announcement.create({ data: { title, body, audience, schoolId: req.user.schoolId } })
  res.status(201).json(row)
})

export const update = asyncHandler(async (req, res) => {
  const result = await prisma.announcement.updateMany({ where: { id: req.params.id, schoolId: req.user.schoolId }, data: req.body })
  if (!result.count) return res.status(404).json({ message: 'Announcement not found' })
  res.json(await prisma.announcement.findUnique({ where: { id: req.params.id } }))
})

export const remove = asyncHandler(async (req, res) => {
  const result = await prisma.announcement.deleteMany({ where: { id: req.params.id, schoolId: req.user.schoolId } })
  if (!result.count) return res.status(404).json({ message: 'Announcement not found' })
  res.status(204).send()
})
