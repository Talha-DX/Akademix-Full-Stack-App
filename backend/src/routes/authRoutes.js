import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { loginSchema, registerSchema, changePasswordSchema } from '../utils/validators.js'
import { rateLimit } from '../middleware/rateLimit.js'

const router = Router()

const sensitiveAuthLimit = rateLimit({ max: 10, windowMs: 15 * 60 * 1000, message: 'Too many authentication attempts. Please try again later.' })

router.post('/register', sensitiveAuthLimit, validate(registerSchema), authController.register)
router.post('/login', sensitiveAuthLimit, validate(loginSchema), authController.login)
router.post('/logout', requireAuth, authController.logout)
router.get('/me', requireAuth, authController.me)
router.post('/change-password', requireAuth, validate(changePasswordSchema), authController.changePassword)
router.post('/forgot-password', sensitiveAuthLimit, authController.forgotPassword)
router.post('/reset-password', sensitiveAuthLimit, authController.resetPassword)

export default router
