const STORAGE_PREFIX = 'akademix-admin-modules:'

const seedData = {
  announcements: [
    { id: 'ann-1', title: 'Mid-term exams begin next Monday', audience: 'All students', priority: 'High', status: 'Published', createdAt: '2026-08-01' },
    { id: 'ann-2', title: 'Parent-teacher meeting rescheduled', audience: 'Parents', priority: 'Medium', status: 'Draft', createdAt: '2026-07-30' },
  ],
  attendance: [
    { id: 'att-1', student: 'Ali Raza', className: 'Grade 8', section: 'A', present: 28, absent: 2, rate: '93%' },
    { id: 'att-2', student: 'Mina Shah', className: 'Grade 9', section: 'B', present: 30, absent: 1, rate: '97%' },
  ],
  fees: [
    { id: 'fee-1', student: 'Ali Raza', category: 'Tuition', amount: 12500, status: 'Paid', dueDate: '2026-08-10' },
    { id: 'fee-2', student: 'Zara Ahmed', category: 'Transport', amount: 3500, status: 'Pending', dueDate: '2026-08-15' },
  ],
  subjects: [
    { id: 'sub-1', name: 'Mathematics', teacher: 'Nadia Farooq', className: 'Grade 8', room: 'B-12' },
    { id: 'sub-2', name: 'Physics', teacher: 'Omar Sheikh', className: 'Grade 9', room: 'S-03' },
  ],
  exams: [
    { id: 'exam-1', title: 'Mid Term Examination', className: 'Grade 8', date: '2026-08-10', duration: '90 min', status: 'Scheduled' },
    { id: 'exam-2', title: 'Physics Lab Practical', className: 'Grade 9', date: '2026-08-12', duration: '60 min', status: 'Draft' },
  ],
  reports: [
    { id: 'rep-1', title: 'Academic performance summary', type: 'Academics', generatedAt: '2026-08-01', owner: 'Admin Office' },
    { id: 'rep-2', title: 'Fee collection trend', type: 'Finance', generatedAt: '2026-08-01', owner: 'Accounts' },
  ],
}

function readEntity(entity) {
  if (typeof window === 'undefined') return seedData[entity]
  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${entity}`)
  if (!raw) {
    window.localStorage.setItem(`${STORAGE_PREFIX}${entity}`, JSON.stringify(seedData[entity]))
    return seedData[entity]
  }
  try {
    return JSON.parse(raw)
  } catch {
    return seedData[entity]
  }
}

function writeEntity(entity, data) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`${STORAGE_PREFIX}${entity}`, JSON.stringify(data))
  }
  return data
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function getAnnouncements() {
  return readEntity('announcements')
}
export function createAnnouncement(payload) {
  const announcements = readEntity('announcements')
  const next = [{ ...payload, id: createId('ann') }, ...announcements]
  return writeEntity('announcements', next)
}
export function updateAnnouncement(id, payload) {
  const announcements = readEntity('announcements')
  const next = announcements.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('announcements', next)
}
export function deleteAnnouncement(id) {
  const announcements = readEntity('announcements')
  const next = announcements.filter((item) => item.id !== id)
  return writeEntity('announcements', next)
}

export function getAttendance() {
  return readEntity('attendance')
}
export function createAttendance(payload) {
  const attendance = readEntity('attendance')
  const next = [{ ...payload, id: createId('att') }, ...attendance]
  return writeEntity('attendance', next)
}
export function updateAttendance(id, payload) {
  const attendance = readEntity('attendance')
  const next = attendance.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('attendance', next)
}
export function deleteAttendance(id) {
  const attendance = readEntity('attendance')
  const next = attendance.filter((item) => item.id !== id)
  return writeEntity('attendance', next)
}

export function getFees() {
  return readEntity('fees')
}
export function createFee(payload) {
  const fees = readEntity('fees')
  const next = [{ ...payload, id: createId('fee') }, ...fees]
  return writeEntity('fees', next)
}
export function updateFee(id, payload) {
  const fees = readEntity('fees')
  const next = fees.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('fees', next)
}
export function deleteFee(id) {
  const fees = readEntity('fees')
  const next = fees.filter((item) => item.id !== id)
  return writeEntity('fees', next)
}

export function getSubjects() {
  return readEntity('subjects')
}
export function createSubject(payload) {
  const subjects = readEntity('subjects')
  const next = [{ ...payload, id: createId('sub') }, ...subjects]
  return writeEntity('subjects', next)
}
export function updateSubject(id, payload) {
  const subjects = readEntity('subjects')
  const next = subjects.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('subjects', next)
}
export function deleteSubject(id) {
  const subjects = readEntity('subjects')
  const next = subjects.filter((item) => item.id !== id)
  return writeEntity('subjects', next)
}

export function getExams() {
  return readEntity('exams')
}
export function createExam(payload) {
  const exams = readEntity('exams')
  const next = [{ ...payload, id: createId('exam') }, ...exams]
  return writeEntity('exams', next)
}
export function updateExam(id, payload) {
  const exams = readEntity('exams')
  const next = exams.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('exams', next)
}
export function deleteExam(id) {
  const exams = readEntity('exams')
  const next = exams.filter((item) => item.id !== id)
  return writeEntity('exams', next)
}

export function getReports() {
  return readEntity('reports')
}
export function createReport(payload) {
  const reports = readEntity('reports')
  const next = [{ ...payload, id: createId('rep') }, ...reports]
  return writeEntity('reports', next)
}
export function deleteReport(id) {
  const reports = readEntity('reports')
  const next = reports.filter((item) => item.id !== id)
  return writeEntity('reports', next)
}
