import { Router } from 'express'
import * as staffController from '../controllers/staffController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { staffSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, requireRole('ADMIN'), staffController.list)
router.get('/:id', requireAuth, requireRole('ADMIN'), staffController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), validate(staffSchema), staffController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), staffController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), staffController.remove)

export default router
