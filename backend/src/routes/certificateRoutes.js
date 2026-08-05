import { Router } from 'express'
import * as certificateController from '../controllers/certificateController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { certificateSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, certificateController.list)
router.get('/templates', requireAuth, requireRole('ADMIN'), certificateController.listTemplates)
router.get('/:id/pdf', requireAuth, certificateController.downloadPdf)
router.post('/', requireAuth, requireRole('ADMIN'), validate(certificateSchema), certificateController.create)
router.post('/templates', requireAuth, requireRole('ADMIN'), certificateController.createTemplate)
router.put('/templates/:id', requireAuth, requireRole('ADMIN'), certificateController.updateTemplate)
router.delete('/templates/:id', requireAuth, requireRole('ADMIN'), certificateController.removeTemplate)
router.delete('/:id', requireAuth, requireRole('ADMIN'), certificateController.remove)

export default router
