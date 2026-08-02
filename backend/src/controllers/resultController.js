// Result controller — marks per student/subject/exam, entered by teachers.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

function computeGrade(marks, maxMarks) {
  const pct = (marks / maxMarks) * 100
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'F'
}

export const list = asyncHandler(async (req, res) => {
  const { examId, studentId } = req.query
  const where = {
    exam: { class: { schoolId: req.user.schoolId } },
    ...(examId ? { examId } : {}),
    ...(studentId ? { studentId } : {}),
  }
  const results = await prisma.examResult.findMany({ where, include: { subject: true, exam: true } })
  res.json(results)
})

// POST /api/results — single entry, or /api/results/bulk — array of entries
export const create = asyncHandler(async (req, res) => {
  const { examId, studentId, subjectId, marks, maxMarks } = req.body
  const result = await prisma.examResult.upsert({
    where: { examId_studentId_subjectId: { examId, studentId, subjectId } },
    create: { examId, studentId, subjectId, marks, maxMarks, grade: computeGrade(marks, maxMarks) },
    update: { marks, maxMarks, grade: computeGrade(marks, maxMarks) },
  })
  res.status(201).json(result)
})

export const bulkCreate = asyncHandler(async (req, res) => {
  const entries = req.body.results || []
  const results = await prisma.$transaction(
    entries.map((r) =>
      prisma.examResult.upsert({
        where: { examId_studentId_subjectId: { examId: r.examId, studentId: r.studentId, subjectId: r.subjectId } },
        create: { ...r, grade: computeGrade(r.marks, r.maxMarks || 100) },
        update: { marks: r.marks, maxMarks: r.maxMarks || 100, grade: computeGrade(r.marks, r.maxMarks || 100) },
      })
    )
  )
  res.status(201).json(results)
})

export const update = asyncHandler(async (req, res) => {
  const { marks, maxMarks } = req.body
  const updated = await prisma.examResult.update({
    where: { id: req.params.id },
    data: { marks, maxMarks, grade: computeGrade(marks, maxMarks || 100) },
  })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  await prisma.examResult.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

// GET /api/results/student/:studentId — report card style
export const byStudent = asyncHandler(async (req, res) => {
  const results = await prisma.examResult.findMany({
    where: { studentId: req.params.studentId },
    include: { subject: true, exam: true },
  })
  res.json(results)
})
