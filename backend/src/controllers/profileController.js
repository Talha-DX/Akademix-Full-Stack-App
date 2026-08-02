// Profile controller — the logged-in user's own profile (any role).
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      student: { include: { class: true } },
      staff: { include: { subjects: true } },
    },
  })
  if (!user) return res.status(404).json({ message: 'User not found' })
  const { password, ...safe } = user
  res.json(safe)
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone, avatar },
  })
  const { password, ...safe } = user
  res.json(safe)
})
