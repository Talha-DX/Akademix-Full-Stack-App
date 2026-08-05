import { Router } from 'express'
import * as reportController from '../controllers/reportController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'

const router = Router()

router.get('/academic', requireAuth, requireRole('ADMIN'), reportController.getAcademicReport)
router.get('/attendance', requireAuth, requireRole('ADMIN'), reportController.getAttendanceReport)
router.get('/financial', requireAuth, requireRole('ADMIN'), reportController.getFinancialReport)
router.get('/student', requireAuth, requireRole('ADMIN'), reportController.getStudentReport)
router.get('/:type/pdf', requireAuth, requireRole('ADMIN'), reportController.downloadReport)

export default router
