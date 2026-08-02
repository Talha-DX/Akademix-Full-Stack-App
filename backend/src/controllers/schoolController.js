// School-level settings belong to the institution, not to an individual user.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

const publicFields = { id: true, name: true, logo: true, address: true, academicYear: true, createdAt: true }

export const getSettings = asyncHandler(async (req, res) => {
  const school = await prisma.school.findUnique({ where: { id: req.user.schoolId }, select: publicFields })
  if (!school) return res.status(404).json({ message: 'School not found' })
  res.json(school)
})

export const updateSettings = asyncHandler(async (req, res) => {
  const { name, logo, address, academicYear } = req.body
  const school = await prisma.school.update({
    where: { id: req.user.schoolId },
    data: { name, logo: logo || null, address: address || null, academicYear },
    select: publicFields,
  })
  res.json(school)
})
