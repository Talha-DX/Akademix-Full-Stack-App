// Student controller — admissions + student records.
import { prisma } from '../models/index.js'
import { hashPassword } from '../utils/bcrypt.js'
import { asyncHandler, paginate, paginatedResponse, generateAdmissionNumber } from '../utils/helpers.js'
import { renderIdCard } from '../services/pdfService.js'

const include = { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } }, class: true }

export const list = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = paginate(req.query)
  const where = {
    class: { schoolId: req.user.schoolId },
    ...(req.query.classId ? { classId: req.query.classId } : {}),
  }
  const [data, total] = await Promise.all([
    prisma.student.findMany({ where, include, skip, take, orderBy: { admissionNo: 'asc' } }),
    prisma.student.count({ where }),
  ])
  res.json(paginatedResponse(data, total, page, limit))
})

export const getById = asyncHandler(async (req, res) => {
  const student = await prisma.student.findFirst({
    where: { id: req.params.id, class: { schoolId: req.user.schoolId } },
    include,
  })
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json(student)
})

export const create = asyncHandler(async (req, res) => {
  const { name, email, password, classId, dob, phone } = req.body

  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })

  const school = await prisma.school.findUnique({ where: { id: req.user.schoolId } })

  let admissionNo = generateAdmissionNumber(school?.academicYear)
  let attempts = 0
  while (await prisma.student.findUnique({ where: { admissionNo } })) {
    admissionNo = generateAdmissionNumber(school?.academicYear)
    attempts++
    if (attempts > 10) break
  }

  const student = await prisma.student.create({
    data: {
      admissionNo,
      dob: new Date(dob),
      class: { connect: { id: klass.id } },
      user: {
        create: {
          name, email, phone, role: 'STUDENT', schoolId: req.user.schoolId,
          password: await hashPassword(password),
        },
      },
    },
    include,
  })
  res.status(201).json(student)
})

export const update = asyncHandler(async (req, res) => {
  const { name, phone, classId, dob } = req.body
  const student = await prisma.student.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!student) return res.status(404).json({ message: 'Student not found' })

  let klass
  if (classId) {
    klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
    if (!klass) return res.status(400).json({ message: 'Invalid classId' })
  }

  const updated = await prisma.student.update({
    where: { id: student.id },
    data: {
      ...(klass ? { class: { connect: { id: klass.id } } } : {}),
      ...(dob ? { dob: new Date(dob) } : {}),
      user: { update: { name, phone } },
    },
    include,
  })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  const student = await prisma.student.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!student) return res.status(404).json({ message: 'Student not found' })
  await prisma.student.delete({ where: { id: student.id } })
  await prisma.user.delete({ where: { id: student.userId } }).catch(() => {})
  res.status(204).send()
})

export const downloadIdCard = asyncHandler(async (req, res) => {
  const student = await prisma.student.findFirst({
    where: { id: req.params.id, class: { schoolId: req.user.schoolId }, ...(req.user.role === 'STUDENT' ? { userId: req.user.id } : {}) },
    include: { user: true, class: true },
  })
  if (!student) return res.status(404).json({ message: 'Student not found' })
  const pdf = await renderIdCard({ studentName: student.user.name, className: `${student.class.name} ${student.class.section}`, admissionNo: student.admissionNo })
  res.type('application/pdf').attachment(`id-card-${student.id}.pdf`).send(pdf)
})
