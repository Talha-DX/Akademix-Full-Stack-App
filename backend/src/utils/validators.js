// Shared validation schemas (Zod), reused by middleware/validation.js.
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Registration is admin-only: email + password + confirmPassword.
// Registering creates a brand-new school owned by that admin.
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export const schoolSettingsSchema = z.object({
  name: z.string().min(2).max(120),
  logo: z.string().url().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  academicYear: z.string().min(2).max(60),
})

export const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  classId: z.string().uuid(),
  dob: z.coerce.date(),
  phone: z.string().optional(),
})

export const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  designation: z.string().min(2),
  phone: z.string().optional(),
})

export const classSchema = z.object({
  name: z.string().min(1),
  section: z.string().min(1),
})

export const subjectSchema = z.object({
  name: z.string().min(1),
  classId: z.string().uuid(),
  teacherId: z.string().uuid().optional().nullable(),
})

export const attendanceMarkSchema = z.object({
  classId: z.string().uuid(),
  date: z.coerce.date(),
  records: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'LEAVE']),
    })
  ),
})

export const timetableSchema = z.object({
  classId: z.string().uuid(),
  day: z.string(),
  period: z.coerce.number().int().positive(),
  subjectId: z.string().uuid(),
  teacherId: z.string().uuid(),
})

export const homeworkSchema = z.object({
  classId: z.string().uuid(),
  subjectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.coerce.date(),
})

export const homeworkSubmissionSchema = z.object({
  fileUrl: z.string().optional(),
})

export const announcementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  audience: z.enum(['ALL', 'ADMIN', 'TEACHER', 'STUDENT']).default('ALL'),
})

export const examSchema = z.object({
  name: z.string().min(1),
  classId: z.string().uuid(),
  term: z.string().min(1),
  startDate: z.coerce.date().optional(),
})

export const resultSchema = z.object({
  examId: z.string().uuid(),
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  marks: z.coerce.number().min(0),
  maxMarks: z.coerce.number().min(1).default(100),
})

export const feeStructureSchema = z.object({
  classId: z.string().uuid(),
  category: z.string().min(1),
  amount: z.coerce.number().positive(),
})

export const feeInvoiceSchema = z.object({
  studentId: z.string().uuid(),
  feeStructureId: z.string().uuid().optional(),
  term: z.string().min(1),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
})

export const feePaySchema = z.object({
  status: z.enum(['PAID', 'DUE', 'OVERDUE']),
})

export const certificateSchema = z.object({
  studentId: z.string().uuid(),
  type: z.string().min(1),
})
