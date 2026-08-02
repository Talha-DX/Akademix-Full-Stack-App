import { Router } from 'express'
import * as homeworkController from '../controllers/homeworkController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { homeworkSchema } from '../utils/validators.js'
import { uploadHomework } from '../middleware/upload.js'

const router = Router()

router.get('/', requireAuth, homeworkController.list)
router.get('/:id', requireAuth, homeworkController.getById)
router.post('/', requireAuth, requireRole('ADMIN', 'TEACHER'), uploadHomework.single('attachment'), validate(homeworkSchema), homeworkController.create)
router.put('/:id', requireAuth, requireRole('ADMIN', 'TEACHER'), homeworkController.update)
router.delete('/:id', requireAuth, requireRole('ADMIN', 'TEACHER'), homeworkController.remove)

router.post('/:id/submit', requireAuth, requireRole('STUDENT'), uploadHomework.single('file'), homeworkController.submit)
router.get('/:id/submissions', requireAuth, requireRole('ADMIN', 'TEACHER'), homeworkController.submissions)
router.put('/submissions/:submissionId/grade', requireAuth, requireRole('ADMIN', 'TEACHER'), homeworkController.grade)

export default router
