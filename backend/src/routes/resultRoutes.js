import { Router } from 'express'
import * as resultController from '../controllers/resultController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { resultSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, resultController.list)
router.get('/student/:studentId', requireAuth, resultController.byStudent)
router.get('/student/:studentId/report-card', requireAuth, resultController.downloadReportCard)
router.post('/', requireAuth, requireRole('ADMIN', 'TEACHER'), validate(resultSchema), resultController.create)
router.post('/bulk', requireAuth, requireRole('ADMIN', 'TEACHER'), resultController.bulkCreate)
router.put('/:id', requireAuth, requireRole('ADMIN', 'TEACHER'), resultController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN', 'TEACHER'), resultController.remove)

export default router
