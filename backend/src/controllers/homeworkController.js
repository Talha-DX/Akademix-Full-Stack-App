// Homework controller — assignments + student submissions.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

const include = { class: true, subject: true }

export const list = asyncHandler(async (req, res) => {
  const { classId, subjectId } = req.query
  const where = {
    class: { schoolId: req.user.schoolId },
    ...(classId ? { classId } : {}),
    ...(subjectId ? { subjectId } : {}),
  }
  const rows = await prisma.homework.findMany({ where, include, orderBy: { dueDate: 'desc' } })
  res.json(rows)
})

export const getById = asyncHandler(async (req, res) => {
  const hw = await prisma.homework.findFirst({
    where: { id: req.params.id, class: { schoolId: req.user.schoolId } },
    include: { ...include, submissions: { include: { student: { include: { user: { select: { name: true } } } } } } },
  })
  if (!hw) return res.status(404).json({ message: 'Homework not found' })
  res.json(hw)
})

export const create = asyncHandler(async (req, res) => {
  const { classId, subjectId, title, description, dueDate } = req.body
  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })
  const attachment = req.file ? `/uploads/homework/${req.file.filename}` : undefined
  const hw = await prisma.homework.create({ data: { classId, subjectId, title, description, dueDate, attachment }, include })
  res.status(201).json(hw)
})

export const update = asyncHandler(async (req, res) => {
  const hw = await prisma.homework.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!hw) return res.status(404).json({ message: 'Homework not found' })
  const updated = await prisma.homework.update({ where: { id: hw.id }, data: req.body, include })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  const hw = await prisma.homework.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!hw) return res.status(404).json({ message: 'Homework not found' })
  await prisma.homework.delete({ where: { id: hw.id } })
  res.status(204).send()
})

// POST /api/homework/:id/submit — student submits their work
export const submit = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } })
  if (!student) return res.status(403).json({ message: 'Only students can submit homework' })

  const fileUrl = req.file ? `/uploads/homework/${req.file.filename}` : req.body.fileUrl

  const submission = await prisma.homeworkSubmission.upsert({
    where: { homeworkId_studentId: { homeworkId: req.params.id, studentId: student.id } },
    create: { homeworkId: req.params.id, studentId: student.id, fileUrl },
    update: { fileUrl, submittedAt: new Date() },
  })
  res.status(201).json(submission)
})

// GET /api/homework/:id/submissions
export const submissions = asyncHandler(async (req, res) => {
  const rows = await prisma.homeworkSubmission.findMany({
    where: { homeworkId: req.params.id },
    include: { student: { include: { user: { select: { name: true } } } } },
  })
  res.json(rows)
})

// PUT /api/homework/submissions/:submissionId/grade
export const grade = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body
  const updated = await prisma.homeworkSubmission.update({
    where: { id: req.params.submissionId },
    data: { grade, feedback },
  })
  res.json(updated)
})
