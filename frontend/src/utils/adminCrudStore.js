const STORAGE_PREFIX = 'akademix-admin:'

const seedData = {
  classes: [
    {
      id: 'class-101',
      name: 'Grade 8',
      section: 'A',
      teacher: 'Nadia Farooq',
      capacity: 32,
      status: 'Active',
    },
    {
      id: 'class-102',
      name: 'Grade 9',
      section: 'B',
      teacher: 'Omar Sheikh',
      capacity: 28,
      status: 'Active',
    },
    {
      id: 'class-103',
      name: 'Grade 10',
      section: 'C',
      teacher: 'Hina Malik',
      capacity: 24,
      status: 'On hold',
    },
  ],
  students: [
    {
      id: 'student-101',
      name: 'Ali Raza',
      className: 'Grade 8',
      section: 'A',
      rollNo: '08A-01',
      email: 'ali@akademix.edu',
      guardian: 'Khalid Raza',
      phone: '+92 300 1111111',
      status: 'Active',
    },
    {
      id: 'student-102',
      name: 'Mina Shah',
      className: 'Grade 9',
      section: 'B',
      rollNo: '09B-02',
      email: 'mina@akademix.edu',
      guardian: 'Shahzad Shah',
      phone: '+92 300 2222222',
      status: 'Active',
    },
    {
      id: 'student-103',
      name: 'Zara Ahmed',
      className: 'Grade 10',
      section: 'C',
      rollNo: '10C-03',
      email: 'zara@akademix.edu',
      guardian: 'Farah Ahmed',
      phone: '+92 300 3333333',
      status: 'Pending',
    },
  ],
  staff: [
    {
      id: 'staff-101',
      name: 'Nadia Farooq',
      role: 'Head of Mathematics',
      department: 'Mathematics',
      email: 'nadia@akademix.edu',
      phone: '+92 300 4444444',
      subject: 'Mathematics',
      status: 'Active',
    },
    {
      id: 'staff-102',
      name: 'Omar Sheikh',
      role: 'Physics Teacher',
      department: 'Science',
      email: 'omar@akademix.edu',
      phone: '+92 300 5555555',
      subject: 'Physics',
      status: 'Active',
    },
    {
      id: 'staff-103',
      name: 'Hina Malik',
      role: 'English Teacher',
      department: 'Languages',
      email: 'hina@akademix.edu',
      phone: '+92 300 6666666',
      subject: 'English',
      status: 'On leave',
    },
  ],
  users: [
    {
      id: 'user-101',
      name: 'Amina Khan',
      email: 'amina@akademix.edu',
      role: 'ADMIN',
      status: 'Active',
      lastLogin: '2h ago',
    },
    {
      id: 'user-102',
      name: 'Nadia Farooq',
      email: 'nadia@akademix.edu',
      role: 'TEACHER',
      status: 'Active',
      lastLogin: 'Today',
    },
    {
      id: 'user-103',
      name: 'Ali Raza',
      email: 'ali@akademix.edu',
      role: 'STUDENT',
      status: 'Active',
      lastLogin: 'Yesterday',
    },
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

export function getClasses() {
  return readEntity('classes')
}

export function createClass(payload) {
  const classes = readEntity('classes')
  const next = [{ ...payload, id: createId('class') }, ...classes]
  return writeEntity('classes', next)
}

export function updateClass(id, payload) {
  const classes = readEntity('classes')
  const next = classes.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('classes', next)
}

export function deleteClass(id) {
  const classes = readEntity('classes')
  const next = classes.filter((item) => item.id !== id)
  return writeEntity('classes', next)
}

export function getStudents() {
  return readEntity('students')
}

export function createStudent(payload) {
  const students = readEntity('students')
  const next = [{ ...payload, id: createId('student') }, ...students]
  return writeEntity('students', next)
}

export function updateStudent(id, payload) {
  const students = readEntity('students')
  const next = students.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('students', next)
}

export function deleteStudent(id) {
  const students = readEntity('students')
  const next = students.filter((item) => item.id !== id)
  return writeEntity('students', next)
}

export function getStaff() {
  return readEntity('staff')
}

export function createStaff(payload) {
  const staff = readEntity('staff')
  const next = [{ ...payload, id: createId('staff') }, ...staff]
  return writeEntity('staff', next)
}

export function updateStaff(id, payload) {
  const staff = readEntity('staff')
  const next = staff.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('staff', next)
}

export function deleteStaff(id) {
  const staff = readEntity('staff')
  const next = staff.filter((item) => item.id !== id)
  return writeEntity('staff', next)
}

export function getUsers() {
  return readEntity('users')
}

export function createUser(payload) {
  const users = readEntity('users')
  const next = [{ ...payload, id: createId('user') }, ...users]
  return writeEntity('users', next)
}

export function updateUser(id, payload) {
  const users = readEntity('users')
  const next = users.map((item) => (item.id === id ? { ...item, ...payload } : item))
  return writeEntity('users', next)
}

export function deleteUser(id) {
  const users = readEntity('users')
  const next = users.filter((item) => item.id !== id)
  return writeEntity('users', next)
}

export function resetAdminData() {
  Object.entries(seedData).forEach(([entity, value]) => writeEntity(entity, value))
}
