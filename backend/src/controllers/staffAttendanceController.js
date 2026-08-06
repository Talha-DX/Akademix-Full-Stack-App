import { prisma } from '../models/index.js'
import { asyncHandler } from '../utils/helpers.js'
import { randomUUID } from 'crypto'

export const list = asyncHandler(async (req, res) => {
  const { date, staffId } = req.query
  const rows = await prisma.$queryRaw`
    SELECT sa."id", sa."staffId", sa."date", sa."status", sa."markedBy", sa."createdAt",
           json_build_object('id', s."id", 'designation', s."designation", 'user', json_build_object('name', u."name")) AS staff
    FROM "StaffAttendance" sa
    JOIN "Staff" s ON s."id" = sa."staffId"
    JOIN "User" u ON u."id" = s."userId"
    WHERE u."schoolId" = ${req.user.schoolId}
      AND (${date || null}::date IS NULL OR sa."date" = ${date || null}::date)
      AND (${staffId || null}::text IS NULL OR sa."staffId" = ${staffId || null})
    ORDER BY sa."date" DESC
  `
  res.json(rows)
})

export const mark = asyncHandler(async (req, res) => {
  const { date, records } = req.body
  const staffIds = records.map((record) => record.staffId)
  const count = await prisma.staff.count({ where: { id: { in: staffIds }, user: { schoolId: req.user.schoolId } } })
  if (count !== staffIds.length) return res.status(400).json({ message: 'One or more staff members are invalid' })
  await prisma.$transaction(records.map((record) => prisma.$executeRaw`
    INSERT INTO "StaffAttendance" ("id", "staffId", "date", "status", "markedBy", "createdAt")
    VALUES (${randomUUID()}, ${record.staffId}, ${new Date(date)}, CAST(${record.status} AS "AttendanceStatus"), ${req.user.id}, NOW())
    ON CONFLICT ("staffId", "date") DO UPDATE SET "status" = EXCLUDED."status", "markedBy" = EXCLUDED."markedBy"
  `))
  res.status(201).json({ message: 'Staff attendance saved' })
})
