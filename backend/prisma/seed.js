import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ---------------- helpers ----------------
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function weightedAttendanceStatus() {
  const r = Math.random()
  if (r < 0.82) return 'PRESENT'
  if (r < 0.92) return 'ABSENT'
  if (r < 0.97) return 'LATE'
  return 'LEAVE'
}

function gradeFor(pct) {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'F'
}

function lastNWeekdays(n) {
  const days = []
  const d = new Date()
  while (days.length < n) {
    d.setDate(d.getDate() - 1)
    const day = d.getDay()
    if (day !== 0 && day !== 6) days.push(new Date(d))
  }
  return days.reverse()
}

const FIRST_NAMES = ['Ali', 'Ahmed', 'Sara', 'Ayesha', 'Bilal', 'Hina', 'Usman', 'Zara', 'Hamza', 'Mariam', 'Omar', 'Fatima', 'Hassan', 'Noor', 'Kamal', 'Sana', 'Adeel', 'Rabia', 'Faisal', 'Amina', 'Tariq', 'Sadia', 'Imran', 'Nida', 'Salman', 'Iqra', 'Waqas', 'Farah', 'Kashif', 'Mahnoor']
const LAST_NAMES = ['Khan', 'Malik', 'Ahmed', 'Raza', 'Butt', 'Sheikh', 'Iqbal', 'Chaudhry', 'Hussain', 'Farooq', 'Javed', 'Aslam', 'Qureshi', 'Baig', 'Awan']
const uniqueName = () => `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`

const SUBJECT_NAMES = ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer Science']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const GRADES = [6, 7, 8, 9, 10]
const SECTIONS = ['A', 'B']

// ---------------- wipe (children first) ----------------
async function wipe() {
  await prisma.liveClass.deleteMany()
  await prisma.homeworkSubmission.deleteMany()
  await prisma.homework.deleteMany()
  await prisma.examResult.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.feeInvoice.deleteMany()
  await prisma.feeStructure.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.certificateTemplate.deleteMany()
  await prisma.timetable.deleteMany()
  await prisma.staffAttendance.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.student.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.class.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.user.deleteMany()
  await prisma.school.deleteMany()
}

async function main() {
  console.log('Wiping existing data...')
  await wipe()

  const password = await bcrypt.hash('password123', 10)

  const school = await prisma.school.create({
    data: { name: 'Akademix Demo School', academicYear: '2025-2026', address: 'Model Town, Lahore' },
  })

  await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@akademix.test', password, role: 'ADMIN', schoolId: school.id },
  })

  // ---------------- staff ----------------
  const DEPARTMENTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science']
  const staffList = []
  for (let i = 1; i <= 8; i++) {
    const dept = DEPARTMENTS[i % DEPARTMENTS.length]
    const staff = await prisma.staff.create({
      data: {
        designation: `${dept}::Senior Teacher`,
        user: { create: { name: uniqueName(), email: `teacher${i}@akademix.test`, password, role: 'TEACHER', schoolId: school.id } },
      },
    })
    staffList.push(staff)
  }

  // ---------------- classes + subjects + timetable ----------------
  const classes = []
  const subjectsByClass = {}
  let teacherCursor = 0

  for (const g of GRADES) {
    for (const s of SECTIONS) {
      const klass = await prisma.class.create({ data: { name: `Grade ${g}`, section: s, schoolId: school.id } })
      classes.push(klass)

      subjectsByClass[klass.id] = []
      for (const subjName of SUBJECT_NAMES) {
        const teacher = staffList[teacherCursor % staffList.length]
        teacherCursor++
        const subject = await prisma.subject.create({ data: { name: subjName, classId: klass.id, teacherId: teacher.id } })
        subjectsByClass[klass.id].push(subject)
      }

      const timetableRows = []
      for (const day of DAYS) {
        subjectsByClass[klass.id].forEach((subject, idx) => {
          timetableRows.push({ classId: klass.id, day, period: idx + 1, subjectId: subject.id, teacherId: subject.teacherId })
        })
      }
      await prisma.timetable.createMany({ data: timetableRows })
    }
  }

  // ---------------- students ----------------
  let admissionSeq = 1
  const studentsByClass = {}
  const allStudents = []

  for (const klass of classes) {
    studentsByClass[klass.id] = []
    const gradeNum = parseInt(klass.name.replace('Grade ', ''), 10)
    for (let i = 0; i < 6; i++) {
      const admissionNo = `AKX-2026-${String(admissionSeq).padStart(6, '0')}`
      const dobYear = new Date().getFullYear() - (gradeNum + 5)
      const student = await prisma.student.create({
        data: {
          admissionNo,
          dob: new Date(`${dobYear}-0${randInt(1, 9)}-1${randInt(0, 9)}`),
          class: { connect: { id: klass.id } },
          user: { create: { name: uniqueName(), email: `student${admissionSeq}@akademix.test`, password, role: 'STUDENT', schoolId: school.id } },
        },
      })
      studentsByClass[klass.id].push(student)
      allStudents.push({ student, klass })
      admissionSeq++
    }
  }

  // ---------------- attendance (students + staff, last 20 weekdays) ----------------
  const days20 = lastNWeekdays(20)

  const attendanceRows = []
  for (const { student } of allStudents) {
    for (const date of days20) attendanceRows.push({ studentId: student.id, date, status: weightedAttendanceStatus(), markedBy: 'Seed Script' })
  }
  await prisma.attendance.createMany({ data: attendanceRows })

  const staffAttendanceRows = []
  for (const staff of staffList) {
    for (const date of days20) staffAttendanceRows.push({ staffId: staff.id, date, status: weightedAttendanceStatus(), markedBy: 'Seed Script' })
  }
  await prisma.staffAttendance.createMany({ data: staffAttendanceRows })

  // ---------------- exams + results ----------------
  for (const klass of classes) {
    const subs = subjectsByClass[klass.id]
    const students = studentsByClass[klass.id]
    for (const [term, offsetDays] of [['Term 1', -40], ['Term 2', 20]]) {
      const exam = await prisma.exam.create({
        data: { name: `${term} Exam`, classId: klass.id, term, startDate: new Date(Date.now() + offsetDays * 86400000) },
      })
      const resultRows = []
      for (const student of students) {
        for (const subject of subs) {
          const marks = randInt(35, 100)
          resultRows.push({ examId: exam.id, studentId: student.id, subjectId: subject.id, marks, maxMarks: 100, grade: gradeFor(marks) })
        }
      }
      await prisma.examResult.createMany({ data: resultRows })
    }
  }

  // ---------------- homework + submissions ----------------
  for (const klass of classes) {
    const students = studentsByClass[klass.id]
    for (const subject of subjectsByClass[klass.id]) {
      for (let h = 1; h <= 2; h++) {
        const homework = await prisma.homework.create({
          data: {
            classId: klass.id,
            subjectId: subject.id,
            title: `${subject.name} Assignment ${h}`,
            description: `Complete the exercises from chapter ${h} and submit before the due date.`,
            dueDate: new Date(Date.now() + randInt(-10, 10) * 86400000),
          },
        })
        const submitters = students.filter(() => Math.random() < 0.7)
        const submissionRows = submitters.map((student) => {
          const graded = Math.random() < 0.6
          return {
            homeworkId: homework.id,
            studentId: student.id,
            fileUrl: `/uploads/homework/demo-${homework.id.slice(0, 8)}-${student.id.slice(0, 8)}.pdf`,
            grade: graded ? gradeFor(randInt(50, 100)) : null,
            feedback: graded ? 'Good work, keep it up.' : null,
          }
        })
        if (submissionRows.length) await prisma.homeworkSubmission.createMany({ data: submissionRows })
      }
    }
  }

  // ---------------- fees ----------------
  for (const klass of classes) {
    const structures = await Promise.all(
      [['Tuition Fee', 5000], ['Transport Fee', 1500], ['Exam Fee', 1000]].map(([category, amount]) =>
        prisma.feeStructure.create({ data: { classId: klass.id, category, amount } })
      )
    )
    const invoiceRows = []
    for (const student of studentsByClass[klass.id]) {
      for (const structure of structures) {
        const status = rand(['PAID', 'PAID', 'DUE', 'OVERDUE'])
        invoiceRows.push({
          studentId: student.id,
          feeStructureId: structure.id,
          term: 'Term 1',
          amount: structure.amount,
          status,
          dueDate: new Date(Date.now() + randInt(-15, 20) * 86400000),
          paidAt: status === 'PAID' ? new Date(Date.now() - randInt(1, 30) * 86400000) : null,
        })
      }
    }
    await prisma.feeInvoice.createMany({ data: invoiceRows })
  }

  // ---------------- certificates ----------------
  const templates = await Promise.all([
    prisma.certificateTemplate.create({ data: { schoolId: school.id, name: 'Bonafide Certificate', type: 'Bonafide', body: '{studentName} is a bonafide student of this institution. Issued on {issuedDate}.' } }),
    prisma.certificateTemplate.create({ data: { schoolId: school.id, name: 'Character Certificate', type: 'Character', body: '{studentName} has shown excellent conduct. Issued on {issuedDate}.' } }),
  ])
  for (let i = 0; i < 15; i++) {
    const { student } = rand(allStudents)
    const template = rand(templates)
    await prisma.certificate.create({ data: { studentId: student.id, type: template.type, body: template.body } })
  }

  // ---------------- live classes ----------------
  for (const klass of classes) {
    const subs = subjectsByClass[klass.id]
    for (const offset of [-2, 3]) {
      const subject = rand(subs)
      await prisma.liveClass.create({
        data: {
          schoolId: school.id,
          classId: klass.id,
          subjectId: subject.id,
          teacherId: subject.teacherId,
          title: `${subject.name} Live Session`,
          meetingUrl: 'https://meet.example.com/demo-room',
          scheduledAt: new Date(Date.now() + offset * 86400000),
          duration: 45,
        },
      })
    }
  }

  // ---------------- announcements ----------------
  await prisma.announcement.createMany({
    data: [
      { title: 'Welcome back!', body: 'Classes resume on Monday. Please bring your updated timetables.', audience: 'ALL', schoolId: school.id },
      { title: 'Parent-Teacher Meeting', body: 'Scheduled for next Friday, 10 AM onwards.', audience: 'ALL', schoolId: school.id },
      { title: 'Staff Meeting', body: 'Monthly staff meeting in the main hall.', audience: 'TEACHER', schoolId: school.id },
      { title: 'Fee Deadline Reminder', body: 'Term 1 fees are due by the end of this month.', audience: 'STUDENT', schoolId: school.id },
      { title: 'Sports Day', body: 'Annual sports day preparations begin next week.', audience: 'ALL', schoolId: school.id },
      { title: 'System Maintenance', body: 'The portal will be briefly unavailable this weekend.', audience: 'ADMIN', schoolId: school.id },
    ],
  })

  console.log('\nSeed complete — every password is: password123\n')
  console.log('  Admin:    admin@akademix.test')
  console.log('  Teachers: teacher1@akademix.test .. teacher8@akademix.test')
  console.log(`  Students: student1@akademix.test .. student${admissionSeq - 1}@akademix.test`)
  console.log(`\n  ${classes.length} classes, ${allStudents.length} students, ${staffList.length} teachers, ${days20.length} days of attendance, exams/fees/homework/certificates/live classes all populated.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())