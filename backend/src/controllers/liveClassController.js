import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'
import { randomUUID } from 'crypto'

const toLiveClass = (row) => ({
  ...row,
  duration: Number(row.duration),
  class: { id: row.classId, name: row.className, section: row.classSection },
  subject: row.subjectId ? { id: row.subjectId, name: row.subjectName } : null,
  teacher: row.teacherId ? { id: row.teacherId, user: { name: row.teacherName } } : null,
})

export const list = asyncHandler(async (req, res) => {
  const { classId } = req.query
  const student = req.user.role === 'STUDENT' ? await prisma.student.findUnique({ where: { userId: req.user.id } }) : null
  const requestedClassId = student?.classId || classId || null
  const rows = await prisma.$queryRaw`
    SELECT lc.*, c."name" AS "className", c."section" AS "classSection", sub."name" AS "subjectName", u."name" AS "teacherName"
    FROM "LiveClass" lc
    JOIN "Class" c ON c."id" = lc."classId"
    LEFT JOIN "Subject" sub ON sub."id" = lc."subjectId"
    LEFT JOIN "Staff" st ON st."id" = lc."teacherId"
    LEFT JOIN "User" u ON u."id" = st."userId"
    WHERE lc."schoolId" = ${req.user.schoolId}
      AND (${requestedClassId}::text IS NULL OR lc."classId" = ${requestedClassId})
    ORDER BY lc."scheduledAt" ASC
  `
  res.json(rows.map(toLiveClass))
})
export const create = asyncHandler(async (req, res) => {
  const { classId, subjectId, teacherId, title, meetingUrl, scheduledAt, duration } = req.body
  const klass = await prisma.class.findFirst({ where: { id: classId, schoolId: req.user.schoolId } })
  if (!klass) return res.status(400).json({ message: 'Invalid class' })
  const id = randomUUID()
  await prisma.$executeRaw`
    INSERT INTO "LiveClass" ("id", "schoolId", "classId", "subjectId", "teacherId", "title", "meetingUrl", "scheduledAt", "duration", "createdAt")
    VALUES (${id}, ${req.user.schoolId}, ${classId}, ${subjectId || null}, ${teacherId || null}, ${title}, ${meetingUrl}, ${new Date(scheduledAt)}, ${Number(duration) || 60}, NOW())
  `
  res.status(201).json({ id })
})
export const update = asyncHandler(async (req, res) => {
  const result = await prisma.$executeRaw`UPDATE "LiveClass" SET "title" = COALESCE(${req.body.title || null}, "title"), "meetingUrl" = COALESCE(${req.body.meetingUrl || null}, "meetingUrl"), "scheduledAt" = COALESCE(${req.body.scheduledAt ? new Date(req.body.scheduledAt) : null}, "scheduledAt"), "duration" = COALESCE(${req.body.duration ? Number(req.body.duration) : null}, "duration") WHERE "id" = ${req.params.id} AND "schoolId" = ${req.user.schoolId}`
  if (!result) return res.status(404).json({ message: 'Live class not found' })
  res.json({ id: req.params.id })
})
export const remove = asyncHandler(async (req, res) => {
  const result = await prisma.$executeRaw`DELETE FROM "LiveClass" WHERE "id" = ${req.params.id} AND "schoolId" = ${req.user.schoolId}`
  if (!result) return res.status(404).json({ message: 'Live class not found' })
  res.status(204).send()
})
