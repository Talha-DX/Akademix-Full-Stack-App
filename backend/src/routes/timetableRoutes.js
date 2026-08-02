import { Router } from 'express'
import * as timetableController from '../controllers/timetableController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { timetableSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, timetableController.list)
router.post('/', requireAuth, requireRole('ADMIN'), validate(timetableSchema), timetableController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), timetableController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), timetableController.remove)

export default router
