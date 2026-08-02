import { Router } from 'express'
import * as classController from '../controllers/classController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { classSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, classController.list)
router.get('/:id', requireAuth, classController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), validate(classSchema), classController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), classController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), classController.remove)

export default router
