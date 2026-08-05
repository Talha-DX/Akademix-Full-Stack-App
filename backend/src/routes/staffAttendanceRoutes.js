import { Router } from 'express'
import * as controller from '../controllers/staffAttendanceController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'

const router = Router()
router.get('/', requireAuth, requireRole('ADMIN'), controller.list)
router.post('/mark', requireAuth, requireRole('ADMIN'), controller.mark)
export default router
