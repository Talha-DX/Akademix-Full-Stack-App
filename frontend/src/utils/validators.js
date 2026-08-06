// Shared validation schemas (Zod), reused by middleware/validation.js.
import { z } from 'zod'

// `role` is optional so existing integrations (Postman, mobile, etc.) that
// don't send it still work — but when the login form sends it (the
// Admin/Teacher/Student picker), authController.login() cross-checks it
// against the account's real role.
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
})
