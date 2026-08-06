import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'
import { renderDataReport } from '../services/pdfService.js'

export const downloadReport = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId
  const type = req.params.type
  let title; let headers; let rows
  if (type === 'financial') {
    const invoices = await prisma.feeInvoice.findMany({ where: { student: { class: { schoolId } } }, include: { student: { include: { user: true, class: true } }, feeStructure: true }, orderBy: { dueDate: 'asc' } })
    title = 'Fee Report'; headers = ['Student', 'Class', 'Category', 'Term', 'Amount', 'Due date', 'Status']
    rows = invoices.map((item) => [item.student.user.name, `${item.student.class.name} ${item.student.class.section}`, item.feeStructure?.category || 'Fee', item.term, Number(item.amount).toFixed(2), item.dueDate.toLocaleDateString(), item.status])
  } else if (type === 'academic') {
    const results = await prisma.examResult.findMany({ where: { exam: { class: { schoolId } } }, include: { student: { include: { user: true, class: true } }, subject: true, exam: true }, orderBy: { exam: { startDate: 'desc' } } })
    title = 'Exam Report'; headers = ['Student', 'Class', 'Exam', 'Subject', 'Marks', 'Grade']
    rows = results.map((item) => [item.student.user.name, `${item.student.class.name} ${item.student.class.section}`, item.exam.name, item.subject.name, `${item.marks}/${item.maxMarks}`, item.grade || '—'])
  } else if (type === 'attendance') {
    const records = await prisma.attendance.findMany({ where: { student: { class: { schoolId } } }, include: { student: { include: { user: true, class: true } } }, orderBy: { date: 'desc' } })
    title = 'Attendance Report'; headers = ['Date', 'Student', 'Class', 'Status']
    rows = records.map((item) => [item.date.toLocaleDateString(), item.student.user.name, `${item.student.class.name} ${item.student.class.section}`, item.status])
  } else return res.status(404).json({ message: 'Unknown report type' })
  const pdf = await renderDataReport({ title, headers, rows, generatedAt: new Date().toLocaleString() })
  res.type('application/pdf').attachment(`${type}-report.pdf`).send(pdf)
})

export const getAcademicReport = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId
  const [examsCount, results, classes] = await Promise.all([
    prisma.exam.count({ where: { class: { schoolId } } }),
    prisma.examResult.findMany({
      where: { exam: { class: { schoolId } } },
      select: { marks: true, maxMarks: true, grade: true },
    }),
    prisma.class.findMany({
      where: { schoolId },
      select: { id: true, name: true, section: true, _count: { select: { students: true, exams: true } } },
    }),
  ])

  const totalMarks = results.reduce((acc, r) => acc + r.marks, 0)
  const totalMax = results.reduce((acc, r) => acc + r.maxMarks, 0)
  const averagePercentage = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0

  res.json({
    totalExams: examsCount,
    totalResultsRecorded: results.length,
    averagePercentage,
    classesSummary: classes,
  })
})

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId
  const attendanceRecords = await prisma.attendance.findMany({
    where: { student: { class: { schoolId } } },
    select: { status: true },
  })

  const total = attendanceRecords.length
  const present = attendanceRecords.filter((r) => r.status === 'PRESENT').length
  const absent = attendanceRecords.filter((r) => r.status === 'ABSENT').length
  const late = attendanceRecords.filter((r) => r.status === 'LATE').length
  const leave = attendanceRecords.filter((r) => r.status === 'LEAVE').length
  const rate = total > 0 ? Math.round((present / total) * 100) : 100

  res.json({
    totalMarked: total,
    present,
    absent,
    late,
    leave,
    attendanceRatePercentage: rate,
  })
})

export const getFinancialReport = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId
  const invoices = await prisma.feeInvoice.findMany({
    where: { student: { class: { schoolId } } },
    select: { amount: true, status: true },
  })

  const totalBilled = invoices.reduce((acc, inv) => acc + Number(inv.amount), 0)
  const totalPaid = invoices.filter((i) => i.status === 'PAID').reduce((acc, inv) => acc + Number(inv.amount), 0)
  const totalPending = totalBilled - totalPaid

  res.json({
    totalInvoices: invoices.length,
    totalBilled,
    totalPaid,
    totalPending,
    collectionRatePercentage: totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100,
  })
})

export const getStudentReport = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId
  const [totalStudents, totalClasses, studentsPerClass] = await Promise.all([
    prisma.student.count({ where: { class: { schoolId } } }),
    prisma.class.count({ where: { schoolId } }),
    prisma.class.findMany({
      where: { schoolId },
      select: { id: true, name: true, section: true, _count: { select: { students: true } } },
    }),
  ])

  res.json({
    totalStudents,
    totalClasses,
    studentsPerClass,
  })
})
