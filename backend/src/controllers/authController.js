// Auth controller — register, login, current-user, change password, password recovery.
import crypto from 'crypto'
import { prisma } from '../models/index.js'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import { signToken } from '../utils/jwt.js'
import { asyncHandler } from '../utils/helpers.js'
import { sendPasswordResetEmail } from '../services/emailService.js'

function toPublicUser(user) {
  const { password, resetToken, resetTokenExpiry, ...rest } = user
  return rest
}

// POST /api/auth/register
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

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.json({ message: 'If an account with that email exists, password reset instructions have been sent.' })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 3600000) // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  })

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`
  await sendPasswordResetEmail(email, { name: user.name, resetUrl, expiresIn: '1 hour' })

  // Never reveal whether an account exists or expose the reset token in an API response.
  res.json({ message: 'If an account with that email exists, password reset instructions have been sent.' })
})

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body
  if (!token || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'A valid token and a password of at least 8 characters are required' })
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired password reset token' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await hashPassword(newPassword),
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  res.json({ message: 'Password has been reset successfully. You can now login.' })
})
