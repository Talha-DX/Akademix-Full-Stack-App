import { Router } from 'express'
import * as examController from '../controllers/examController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { examSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, examController.list)
router.get('/:id', requireAuth, examController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), validate(examSchema), examController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), examController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), examController.remove)

export default router
