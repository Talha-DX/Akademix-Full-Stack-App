// Auth controller — register, login, current-user, change password.
//
// Registration is ADMIN-only. There is no public signup for teachers,
// students, or parents (the parent role no longer exists at all).
// Registering an admin creates a brand-new School in the same
// transaction, and that admin becomes the sole owner/manager of it.
// Students and staff are never self-registered — the admin creates
// those accounts from inside the dashboard (see studentController.create
// and staffController.create).
import { prisma } from '../models/index.js'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import { signToken } from '../utils/jwt.js'
import { asyncHandler } from '../utils/helpers.js'

function toPublicUser(user) {
  const { password, ...rest } = user
  return rest
}

// POST /api/auth/register
//
// Body: { email, password, confirmPassword }
// Creates a new School (placeholder name the admin edits later from
// Institute Profile) plus a single ADMIN user that owns it.
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ message: 'Email already registered' })

  const currentYear = new Date().getFullYear()

  const { user } = await prisma.$transaction(async (tx) => {
    const school = await tx.school.create({
      data: {
        name: 'My School',
        academicYear: `${currentYear}-${currentYear + 1}`,
      },
    })

    const user = await tx.user.create({
      data: {
        name: 'Admin',
        email,
        password: await hashPassword(password),
        role: 'ADMIN',
        schoolId: school.id,
      },
    })

    return { school, user }
  })

  const token = signToken({ id: user.id, role: user.role, schoolId: user.schoolId })
  res.status(201).json({ token, user: toPublicUser(user) })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) return res.status(401).json({ message: 'Invalid credentials' })

  const valid = await comparePassword(password, user.password)
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

  const token = signToken({ id: user.id, role: user.role, schoolId: user.schoolId })
  res.json({ token, user: toPublicUser(user) })
})

// POST /api/auth/logout
// Stateless JWT — nothing to invalidate server-side; client just discards the token.
export const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out' })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { student: true, staff: true },
  })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(toPublicUser(user))
})

// POST /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  const valid = await comparePassword(currentPassword, user.password)
  if (!valid) return res.status(401).json({ message: 'Current password is incorrect' })

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(newPassword) },
  })
  res.json({ message: 'Password updated' })
})
