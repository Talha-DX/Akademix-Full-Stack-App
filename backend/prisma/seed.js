import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const school = await prisma.school.create({
    data: { name: 'Akademix School', academicYear: '2025-2026', address: 'Demo City' },
  })

  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@akademix.test', password, role: 'ADMIN', schoolId: school.id },
  })

  const klass = await prisma.class.create({
    data: { name: 'Grade 6', section: 'A', schoolId: school.id },
  })

  const teacherUser = await prisma.staff.create({
    data: {
      designation: 'Class Teacher',
      user: { create: { name: 'Jane Teacher', email: 'teacher@akademix.test', password, role: 'TEACHER', schoolId: school.id } },
    },
  })

  const subject = await prisma.subject.create({
    data: { name: 'Mathematics', classId: klass.id, teacherId: teacherUser.id },
  })

  // Create Student connected to Class
  await prisma.student.create({
    data: {
      admissionNo: 'AKX-2026-000001',
      dob: new Date('2014-05-10'),
      class: {
        connect: { id: klass.id },
      },
      user: {
        create: {
          name: 'Sam Student',
          email: 'student@akademix.test',
          password,
          role: 'STUDENT',
          schoolId: school.id,
        },
      },
    },
  })

  console.log('Seed complete. Login with:')
  console.log('  admin@akademix.test / password123')
  console.log('  teacher@akademix.test / password123')
  console.log('  student@akademix.test / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
