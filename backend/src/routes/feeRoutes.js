import { Router } from 'express'
import * as feeController from '../controllers/feeController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validation.js'
import { feeStructureSchema, feeInvoiceSchema } from '../utils/validators.js'

const router = Router()

router.get('/structures', requireAuth, feeController.listStructures)
router.post('/structures', requireAuth, requireRole('ADMIN'), validate(feeStructureSchema), feeController.createStructure)
router.put('/structures/:id', requireAuth, requireRole('ADMIN'), feeController.updateStructure)
router.delete('/structures/:id', requireAuth, requireRole('ADMIN'), feeController.removeStructure)

router.get('/invoices', requireAuth, feeController.listInvoices)
router.post('/invoices', requireAuth, requireRole('ADMIN'), validate(feeInvoiceSchema), feeController.createInvoice)
router.put('/invoices/:id/pay', requireAuth, requireRole('ADMIN', 'STUDENT'), feeController.payInvoice)
router.delete('/invoices/:id', requireAuth, requireRole('ADMIN'), feeController.removeInvoice)

export default router
