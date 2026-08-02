import { Router } from 'express'
import * as schoolController from '../controllers/schoolController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { schoolSettingsSchema } from '../utils/validators.js'

const router = Router()

router.get('/settings', requireAuth, requireRole('ADMIN'), schoolController.getSettings)
router.put('/settings', requireAuth, requireRole('ADMIN'), validate(schoolSettingsSchema), schoolController.updateSettings)

export default router
