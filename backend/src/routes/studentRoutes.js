import { Router } from 'express'
import * as studentController from '../controllers/studentController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { studentSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, requireRole('ADMIN', 'TEACHER'), studentController.list)
router.get('/:id', requireAuth, requireRole('ADMIN', 'TEACHER'), studentController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), validate(studentSchema), studentController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), studentController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), studentController.remove)

export default router
