import { Router } from 'express'
import * as dashboardController from '../controllers/dashboardController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, dashboardController.stats)

export default router
