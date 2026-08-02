import { Router } from 'express'
import * as attendanceController from '../controllers/attendanceController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { attendanceMarkSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, attendanceController.list)
router.get('/student/:studentId', requireAuth, attendanceController.byStudent)
router.post('/mark', requireAuth, requireRole('ADMIN', 'TEACHER'), validate(attendanceMarkSchema), attendanceController.mark)

export default router
