import { Router } from 'express'
import * as certificateController from '../controllers/certificateController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { certificateSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, certificateController.list)
router.post('/', requireAuth, requireRole('ADMIN'), validate(certificateSchema), certificateController.create)
router.delete('/:id', requireAuth, requireRole('ADMIN'), certificateController.remove)

export default router
