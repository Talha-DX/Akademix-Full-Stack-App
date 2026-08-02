import { Router } from 'express'
import * as profileController from '../controllers/profileController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, profileController.getProfile)
router.put('/', requireAuth, profileController.updateProfile)

export default router
