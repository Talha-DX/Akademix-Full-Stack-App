// User controller — admin management of all user accounts.
import { prisma } from '../models/index.js'
import { hashPassword } from '../utils/bcrypt.js'
import { asyncHandler, paginate, paginatedResponse } from '../utils/helpers.js'

const publicSelect = {
  id: true, name: true, email: true, phone: true, avatar: true,
  role: true, isActive: true, schoolId: true, createdAt: true,
}

export const list = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = paginate(req.query)
  const where = { schoolId: req.user.schoolId, ...(req.query.role ? { role: req.query.role } : {}) }
  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, select: publicSelect, skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.user.count({ where }),
  ])
  res.json(paginatedResponse(data, total, page, limit))
})

export const getById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    select: publicSelect,
  })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
})

export const create = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body
  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'An initial password of at least 8 characters is required' })
  }
  const user = await prisma.user.create({
    data: { name, email, phone, role, schoolId: req.user.schoolId, password: await hashPassword(password) },
    select: publicSelect,
  })
  res.status(201).json(user)
})

export const update = asyncHandler(async (req, res) => {
  const { name, phone, isActive, avatar } = req.body
  const user = await prisma.user.updateMany({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: { name, phone, isActive, avatar },
  })
  if (!user.count) return res.status(404).json({ message: 'User not found' })
  res.json(await prisma.user.findUnique({ where: { id: req.params.id }, select: publicSelect }))
})

export const remove = asyncHandler(async (req, res) => {
  const result = await prisma.user.deleteMany({ where: { id: req.params.id, schoolId: req.user.schoolId } })
  if (!result.count) return res.status(404).json({ message: 'User not found' })
  res.status(204).send()
})
