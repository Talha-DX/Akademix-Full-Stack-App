import { Router } from 'express'
import * as userController from '../controllers/userController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'

const router = Router()

router.get('/', requireAuth, requireRole('ADMIN'), userController.list)
router.get('/:id', requireAuth, requireRole('ADMIN'), userController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), userController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), userController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), userController.remove)

export default router
