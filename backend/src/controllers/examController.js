// Exam controller — exam definitions per class/term.
import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'

export const list = asyncHandler(async (req, res) => {
  const { classId } = req.query
  const where = { class: { schoolId: req.user.schoolId }, ...(classId ? { classId } : {}) }
  const exams = await prisma.exam.findMany({ where, include: { class: true } })
  res.json(exams)
})

export const getById = asyncHandler(async (req, res) => {
  const exam = await prisma.exam.findFirst({
    where: { id: req.params.id, class: { schoolId: req.user.schoolId } },
    include: { class: true, results: true },
  })
  if (!exam) return res.status(404).json({ message: 'Exam not found' })
  res.json(exam)
})

export const create = asyncHandler(async (req, res) => {
  const { name, classId, term, startDate } = req.body
  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid classId' })
  const exam = await prisma.exam.create({ data: { name, classId, term, startDate } })
  res.status(201).json(exam)
})

export const update = asyncHandler(async (req, res) => {
  const exam = await prisma.exam.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!exam) return res.status(404).json({ message: 'Exam not found' })
  const updated = await prisma.exam.update({ where: { id: exam.id }, data: req.body })
  res.json(updated)
})

export const remove = asyncHandler(async (req, res) => {
  const exam = await prisma.exam.findFirst({ where: { id: req.params.id, class: { schoolId: req.user.schoolId } } })
  if (!exam) return res.status(404).json({ message: 'Exam not found' })
  await prisma.exam.delete({ where: { id: exam.id } })
  res.status(204).send()
})
