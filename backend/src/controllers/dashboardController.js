// Dashboard controller — role-specific summary stats for the landing page
// of each portal (admin/teacher/student).
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

export const stats = asyncHandler(async (req, res) => {
  const { role, schoolId, id } = req.user

  if (role === 'ADMIN') {
    const [studentCount, staffCount, classCount, dueInvoices, announcements] = await Promise.all([
      prisma.student.count({ where: { class: { schoolId } } }),
      prisma.staff.count({ where: { user: { schoolId } } }),
      prisma.class.count({ where: { schoolId } }),
      prisma.feeInvoice.count({ where: { status: { in: ['DUE', 'OVERDUE'] }, student: { class: { schoolId } } } }),
      prisma.announcement.count({ where: { schoolId } }),
    ])
    return res.json({ studentCount, staffCount, classCount, dueInvoices, announcements })
  }

  if (role === 'TEACHER') {
    const staff = await prisma.staff.findUnique({ where: { userId: id }, include: { subjects: true } })
    const subjectIds = staff?.subjects.map((s) => s.id) ?? []
    const [classesTaught, homeworkCount, timetableToday] = await Promise.all([
      prisma.subject.findMany({ where: { id: { in: subjectIds } }, select: { classId: true }, distinct: ['classId'] }),
      prisma.homework.count({ where: { subjectId: { in: subjectIds } } }),
      prisma.timetable.findMany({ where: { teacherId: staff?.id }, include: { subject: true, class: true } }),
    ])
    return res.json({ classesTaught: classesTaught.length, homeworkCount, timetableToday })
  }

  if (role === 'STUDENT') {
    const student = await prisma.student.findUnique({ where: { userId: id } })
    if (!student) return res.json({})
    const [attendanceCount, homeworkPending, feesDue, results] = await Promise.all([
      prisma.attendance.count({ where: { studentId: student.id, status: 'PRESENT' } }),
      prisma.homework.count({ where: { classId: student.classId, dueDate: { gte: new Date() } } }),
      prisma.feeInvoice.count({ where: { studentId: student.id, status: { in: ['DUE', 'OVERDUE'] } } }),
      prisma.examResult.findMany({ where: { studentId: student.id }, take: 5, orderBy: { id: 'desc' } }),
    ])
    return res.json({ attendanceCount, homeworkPending, feesDue, recentResults: results })
  }

  res.json({})
})
