import { Router } from 'express'
import * as subjectController from '../controllers/subjectController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { subjectSchema } from '../utils/validators.js'

const router = Router()

router.get('/', requireAuth, subjectController.list)
router.get('/:id', requireAuth, subjectController.getById)
router.post('/', requireAuth, requireRole('ADMIN'), validate(subjectSchema), subjectController.create)
router.put('/:id', requireAuth, requireRole('ADMIN'), subjectController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN'), subjectController.remove)

export default router
