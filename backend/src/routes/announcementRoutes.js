import { Router } from 'express'
import * as announcementController from '../controllers/announcementController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { announcementSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, announcementController.list)
router.get('/:id', requireAuth, announcementController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), validate(announcementSchema), announcementController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), announcementController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), announcementController.remove)

export default router
