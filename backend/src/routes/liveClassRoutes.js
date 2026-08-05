import { Router } from 'express'
import * as controller from '../controllers/liveClassController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'

const router = Router()
router.get('/', requireAuth, controller.list)
router.post('/', requireAuth, requireRole('ADMIN'), controller.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), controller.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove)
export default router
