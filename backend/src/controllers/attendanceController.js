// Attendance controller — daily marking + reports.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

// POST /api/attendance/mark — bulk upsert for a class/date.
export const mark = asyncHandler(async (req, res) => {
  const { classId, date, records } = req.body

  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })

  const results = await prisma.$transaction(
    records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date } },
        create: { studentId: r.studentId, date, status: r.status, markedBy: req.user.id },
        update: { status: r.status, markedBy: req.user.id },
      })
    )
  )
  res.status(201).json(results)
})

// GET /api/attendance?classId=&date=
export const list = asyncHandler(async (req, res) => {
  const { classId, date, studentId } = req.query
  const where = {
    student: { class: { schoolId: req.user.schoolId } },
    ...(classId ? { student: { classId } } : {}),
    ...(studentId ? { studentId } : {}),
    ...(date ? { date: new Date(date) } : {}),
  }
  const records = await prisma.attendance.findMany({
    where,
    include: { student: { include: { user: { select: { name: true } } } } },
    orderBy: { date: 'desc' },
  })
  res.json(records)
})

// GET /api/attendance/student/:studentId — monthly report
export const byStudent = asyncHandler(async (req, res) => {
  const { month, year } = req.query
  const where = { studentId: req.params.studentId }
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1)
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59)
    where.date = { gte: start, lte: end }
  }
  const records = await prisma.attendance.findMany({ where, orderBy: { date: 'asc' } })
  const summary = records.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {})
  res.json({ records, summary })
})
