// Dashboard controller — role-specific summary stats for the landing page
// of each portal (admin/teacher/student).
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

const toNum = (agg) => Number(agg?._sum?.amount ?? 0)

export const stats = asyncHandler(async (req, res) => {
  const { role, schoolId, id } = req.user

  if (role === 'ADMIN') {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const sixMonthsBack = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    const studentWhere = { class: { schoolId } }
    const staffWhere = { user: { schoolId } }
    const invoiceWhere = { student: { class: { schoolId } } }

    const [
      studentCount,
      staffCount,
      classCount,
      dueInvoices,
      announcements,
      newStudentsThisMonth,
      newStaffThisMonth,
      totalRevenueAgg,
      collectedThisMonthAgg,
      dueThisMonthAgg,
      outstandingTotalAgg,
      outstandingThisMonthAgg,
      trendInvoices,
      classes,
      studentsMarkedToday,
      studentsPresentToday,
      staffMarkedToday,
      staffPresentToday,
      absentStudentsRaw,
      presentStaffRaw,
      newAdmissionsRaw,
    ] = await Promise.all([
      prisma.student.count({ where: studentWhere }),
      prisma.staff.count({ where: staffWhere }),
      prisma.class.count({ where: { schoolId } }),
      prisma.feeInvoice.count({ where: { ...invoiceWhere, status: { in: ['DUE', 'OVERDUE'] } } }),
      prisma.announcement.count({ where: { schoolId } }),

      prisma.student.count({
        where: { ...studentWhere, user: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } } },
      }),
      prisma.staff.count({
        where: { ...staffWhere, user: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } } },
      }),

      // Revenue: all-time collected, and collected this month.
      prisma.feeInvoice.aggregate({ where: { ...invoiceWhere, status: 'PAID' }, _sum: { amount: true } }),
      prisma.feeInvoice.aggregate({
        where: { ...invoiceWhere, paidAt: { gte: startOfMonth, lt: startOfNextMonth } },
        _sum: { amount: true },
      }),
      // What was actually billed (due) this month — the "estimation" side.
      prisma.feeInvoice.aggregate({
        where: { ...invoiceWhere, dueDate: { gte: startOfMonth, lt: startOfNextMonth } },
        _sum: { amount: true },
      }),
      // Outstanding (unpaid) fees, all-time and due this month.
      prisma.feeInvoice.aggregate({
        where: { ...invoiceWhere, status: { in: ['DUE', 'OVERDUE'] } },
        _sum: { amount: true },
      }),
      prisma.feeInvoice.aggregate({
        where: {
          ...invoiceWhere,
          status: { in: ['DUE', 'OVERDUE'] },
          dueDate: { gte: startOfMonth, lt: startOfNextMonth },
        },
        _sum: { amount: true },
      }),

      // Raw invoices touching the last 6 months, bucketed client-side below.
      prisma.feeInvoice.findMany({
        where: { ...invoiceWhere, OR: [{ paidAt: { gte: sixMonthsBack } }, { dueDate: { gte: sixMonthsBack } }] },
        select: { amount: true, paidAt: true, dueDate: true },
      }),

      // Class-wise strength.
      prisma.class.findMany({
        where: { schoolId },
        select: { id: true, name: true, section: true, _count: { select: { students: true } } },
        orderBy: { name: 'asc' },
      }),

      // Today's attendance (students).
      prisma.attendance.count({ where: { date: { gte: todayStart, lt: todayEnd }, student: studentWhere } }),
      prisma.attendance.count({
        where: { date: { gte: todayStart, lt: todayEnd }, status: 'PRESENT', student: studentWhere },
      }),
      // Today's attendance (staff).
      prisma.staffAttendance.count({ where: { date: { gte: todayStart, lt: todayEnd }, staff: staffWhere } }),
      prisma.staffAttendance.count({
        where: { date: { gte: todayStart, lt: todayEnd }, status: 'PRESENT', staff: staffWhere },
      }),

      // Lists.
      prisma.attendance.findMany({
        where: { date: { gte: todayStart, lt: todayEnd }, status: 'ABSENT', student: studentWhere },
        include: {
          student: {
            include: { user: { select: { name: true, avatar: true } }, class: { select: { name: true, section: true } } },
          },
        },
        take: 12,
      }),
      prisma.staffAttendance.findMany({
        where: { date: { gte: todayStart, lt: todayEnd }, status: 'PRESENT', staff: staffWhere },
        include: { staff: { include: { user: { select: { name: true, avatar: true } } } } },
        take: 12,
      }),
      prisma.student.findMany({
        where: { ...studentWhere, user: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } } },
        include: {
          user: { select: { name: true, avatar: true, createdAt: true } },
          class: { select: { name: true, section: true } },
        },
        orderBy: { user: { createdAt: 'desc' } },
        take: 12,
      }),
    ])

    // Bucket the last 6 months of invoices into { billed, collected } per month.
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        collected: 0,
        billed: 0,
      })
    }
    const monthIndex = Object.fromEntries(months.map((m, idx) => [m.key, idx]))
    for (const inv of trendInvoices) {
      const amount = Number(inv.amount)
      if (inv.paidAt) {
        const key = `${inv.paidAt.getFullYear()}-${inv.paidAt.getMonth()}`
        if (key in monthIndex) months[monthIndex[key]].collected += amount
      }
      if (inv.dueDate) {
        const key = `${inv.dueDate.getFullYear()}-${inv.dueDate.getMonth()}`
        if (key in monthIndex) months[monthIndex[key]].billed += amount
      }
    }

    const estimation = toNum(dueThisMonthAgg)
    const collected = toNum(collectedThisMonthAgg)

    return res.json({
      studentCount,
      staffCount,
      classCount,
      dueInvoices,
      announcements,
      newStudentsThisMonth,
      newStaffThisMonth,

      revenue: { total: toNum(totalRevenueAgg), thisMonth: collected },
      outstandingFees: { total: toNum(outstandingTotalAgg), thisMonth: toNum(outstandingThisMonthAgg) },
      feeStatus: { estimation, collected, remaining: Math.max(estimation - collected, 0) },
      feeCollectionPct: estimation ? Math.round((collected / estimation) * 100) : 0,

      revenueTrend: months.map((m) => ({ label: m.label, collected: m.collected, billed: m.billed })),
      classWiseStrength: classes.map((c) => ({ label: `${c.name} - ${c.section}`, value: c._count.students })),

      attendanceToday: {
        studentsMarked: studentsMarkedToday > 0,
        studentsPresent: studentsPresentToday,
        studentsTotal: studentCount,
        studentsPresentPct: studentCount ? Math.round((studentsPresentToday / studentCount) * 100) : 0,
        staffMarked: staffMarkedToday > 0,
        staffPresent: staffPresentToday,
        staffTotal: staffCount,
        staffPresentPct: staffCount ? Math.round((staffPresentToday / staffCount) * 100) : 0,
      },

      absentStudentsToday: absentStudentsRaw.map((r) => ({
        id: r.id,
        name: r.student.user.name,
        avatar: r.student.user.avatar,
        class: `${r.student.class.name} - ${r.student.class.section}`,
      })),
      presentStaffToday: presentStaffRaw.map((r) => ({
        id: r.id,
        name: r.staff.user.name,
        avatar: r.staff.user.avatar,
      })),
      newAdmissions: newAdmissionsRaw.map((s) => ({
        id: s.id,
        name: s.user.name,
        avatar: s.user.avatar,
        class: `${s.class.name} - ${s.class.section}`,
        admissionNo: s.admissionNo,
        joinedAt: s.user.createdAt,
      })),
    })
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
