// JWT authentication middleware.
// Verifies the Bearer token on protected routes and attaches
// req.user = { id, role, schoolId } before calling next().
import { verifyToken } from '../utils/jwt.js'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
