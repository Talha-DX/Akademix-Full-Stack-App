// Express app setup. Separated from server.js so tests can import the
// app without binding to a port.
import express from 'express'
import cors from 'cors'
import path from 'path'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import staffRoutes from './routes/staffRoutes.js'
import classRoutes from './routes/classRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import timetableRoutes from './routes/timetableRoutes.js'
import homeworkRoutes from './routes/homeworkRoutes.js'
import examRoutes from './routes/examRoutes.js'
import resultRoutes from './routes/resultRoutes.js'
import feeRoutes from './routes/feeRoutes.js'
import announcementRoutes from './routes/announcementRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import schoolRoutes from './routes/schoolRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/timetable', timetableRoutes)
app.use('/api/homework', homeworkRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/results', resultRoutes)
app.use('/api/fees', feeRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/school', schoolRoutes)

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }))

// Central error handler — catches anything passed to next(err),
// including errors from asyncHandler-wrapped controllers.
app.use((err, req, res, next) => {
  console.error(err)
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'A record with that value already exists' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found' })
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

export default app
