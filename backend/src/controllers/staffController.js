// Staff controller — teacher/staff records.
import { prisma } from '../models/index.js'
import { hashPassword } from '../utils/bcrypt.js'
import { asyncHandler, paginate, paginatedResponse } from '../utils/helpers.js'

const include = { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } }, subjects: true }

export const list = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = paginate(req.query)
  const where = { user: { schoolId: req.user.schoolId } }
  const [data, total] = await Promise.all([
    prisma.staff.findMany({ where, include, skip, take }),
    prisma.staff.count({ where }),
  ])
  res.json(paginatedResponse(data, total, page, limit))
})

export const getById = asyncHandler(async (req, res) => {
  const staff = await prisma.staff.findFirst({ where: { id: req.params.id, user: { schoolId: req.user.schoolId } }, include })
  if (!staff) return res.status(404).json({ message: 'Staff not found' })
  res.json(staff)
})

export const create = asyncHandler(async (req, res) => {
  const { name, email, password, designation, phone } = req.body
  const staff = await prisma.staff.create({
    data: {
      designation,
      user: {
        create: {
          name, email, phone, role: 'TEACHER', schoolId: req.user.schoolId,
          password: await hashPassword(password || 'changeme123'),
        },
      },
    },
    include,
  })
  res.status(201).json(staff)
})

export const update = asyncHandler(async (req, res) => {
  const { name, phone, designation } = req.body
  const staff = await prisma.staff.findFirst({ where: { id: req.params.id, user: { schoolId: req.user.schoolId } } })
  if (!staff) return res.status(404).json({ message: 'Staff not found' })

  const updated = await prisma.staff.update({
    where: { id: staff.id },
    data: { designation, user: { update: { name, phone } } },
    include,
  })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  const staff = await prisma.staff.findFirst({ where: { id: req.params.id, user: { schoolId: req.user.schoolId } } })
  if (!staff) return res.status(404).json({ message: 'Staff not found' })
  await prisma.staff.delete({ where: { id: staff.id } })
  await prisma.user.delete({ where: { id: staff.userId } }).catch(() => {})
  res.status(204).send()
})
