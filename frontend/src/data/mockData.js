// Static, front-end-only mock data.
// Replace with real API calls (see src/api) once the backend is wired up.

export const rolePortals = [
  {
    role: 'Admin',
    tagline: 'Runs the whole institute',
    description: 'Configure the school profile, manage staff, set fee structures, and see every metric in one place.',
    stats: [
      { label: 'Students enrolled', value: '1,284' },
      { label: 'Staff on record', value: '96' },
      { label: 'Fee collected', value: '82%' },
    ],
    widget: { kind: 'admin' },
  },
  {
    role: 'Teacher',
    tagline: 'Runs the classroom',
    description: 'Mark attendance, enter exam marks, assign homework, and message parents without leaving the app.',
    stats: [
      { label: 'Classes today', value: '5' },
      { label: 'Homework due', value: '3' },
      { label: 'Avg. attendance', value: '94%' },
    ],
    widget: { kind: 'teacher' },
  },
  {
    role: 'Student',
    tagline: 'Keeps up with school',
    description: 'Check the timetable, submit homework, and view exam results the moment they are published.',
    stats: [
      { label: 'Attendance', value: '96%' },
      { label: 'Pending homework', value: '2' },
      { label: 'Last exam avg.', value: '87%' },
    ],
    widget: { kind: 'student' },
  },
]

export const featureGroups = [
  {
    title: 'Admissions & Records',
    description: 'Enroll students, auto-generate credentials, and keep every academic record in one place.',
    items: ['Admissions', 'Classes & Subjects', 'Student Records', 'Institute Profile'],
  },
  {
    title: 'Daily Operations',
    description: 'The routines that run every school day, digitized and synced across every role.',
    items: ['Attendance', 'Timetable', 'Homework', 'Behaviour & Skills'],
  },
  {
    title: 'Academics & Exams',
    description: 'Plan exams, publish results, and issue certificates without a spreadsheet.',
    items: ['Exams & Results', 'Certificates'],
  },
  {
    title: 'Finance & Staff',
    description: 'Fee structures and employee records that stay in sync.',
    items: ['Fees', 'Employees'],
  },
  {
    title: 'Communication',
    description: 'Keep parents and staff informed from one place.',
    items: ['Messaging', 'Live Class'],
  },
  {
    title: 'Reporting & Sales',
    description: 'See the whole institute at a glance.',
    items: ['Reports', 'Institute Profile'],
  },
]

export const stats = [
  { value: '3', label: 'Role-based portals', suffix: '' },
  { value: '22', label: 'Academic & admin modules', suffix: '+' },
  { value: '0', label: 'Registers or spreadsheets needed', suffix: '' },
  { value: '99.9', label: 'Platform uptime', suffix: '%' },
]

export const testimonials = [
  {
    quote: 'Attendance used to be a register and a headache. Now it takes the homeroom teacher two minutes.',
    name: 'Ayesha Raza',
    role: 'Vice Principal, Greenfield Academy',
  },
  {
    quote: 'Parents stopped calling the front desk to ask about fee status — they just check the app.',
    name: 'Bilal Ahmed',
    role: 'Administrator, Al-Noor School System',
  },
  {
    quote: 'Result day went from three days of manual tallying to a same-afternoon publish.',
    name: 'Sana Khalid',
    role: 'Exam Coordinator, City Grammar School',
  },
]

// Full admin module list, mirroring a complete school-ERP module set
// (dashboard, academics, staff, finance, communication, exams, reporting).
export const adminSidebar = [
  { label: 'Dashboard', key: 'overview', icon: 'LayoutDashboard' },
  {
    label: 'General Settings',
    key: 'settings',
    icon: 'Settings',
    children: [
      { label: 'Institute Profile', key: 'settings-profile' },
      { label: 'Roles & Permissions', key: 'settings-roles' },
    ],
  },
  {
    label: 'Classes',
    key: 'classes',
    icon: 'LayoutGrid',
    children: [
      { label: 'Class List', key: 'classes-list' },
      { label: 'Add Class', key: 'classes-add' },
    ],
  },
  {
    label: 'Subjects',
    key: 'subjects',
    icon: 'BookOpen',
    children: [
      { label: 'Subject List', key: 'subjects-list' },
    ],
  },
  {
    label: 'Students',
    key: 'students',
    icon: 'GraduationCap',
    children: [
      { label: 'Student List', key: 'students-list' },
      { label: 'Add Student', key: 'students-add' },
      { label: 'Admissions', key: 'students-admissions' },
      { label: 'Promote Students', key: 'students-promote' },
      { label: 'ID Cards', key: 'students-id-cards' },
    ],
  },
  {
    label: 'Employees',
    key: 'employees',
    icon: 'Briefcase',
    children: [
      { label: 'Employee List', key: 'employees-list' },
      { label: 'Add Employee', key: 'employees-add' },
      { label: 'Departments', key: 'employees-departments' },
      { label: 'Designations', key: 'employees-designations' },
    ],
  },
  {
    label: 'Fees',
    key: 'fees',
    icon: 'Wallet',
    children: [
      { label: 'Fee Structure', key: 'fees-structure' },
      { label: 'Fee Collection', key: 'fees-collection' },
      { label: 'Fee Reports', key: 'fees-reports' },
    ],
  },
  {
    label: 'Attendance',
    key: 'attendance',
    icon: 'CalendarCheck',
    children: [
      { label: 'Student Attendance', key: 'attendance-students' },
      { label: 'Staff Attendance', key: 'attendance-staff' },
    ],
  },
  {
    label: 'Timetable',
    key: 'timetable',
    icon: 'CalendarDays',
    children: [
      { label: 'Class Timetable', key: 'timetable-class' },
      { label: 'Teacher Timetable', key: 'timetable-teacher' },
    ],
  },
  { label: 'Homework', key: 'homework', icon: 'BookMarked' },
  { label: 'Behaviour & Skills', key: 'behaviour', icon: 'Sparkles' },
  { label: 'Messaging', key: 'messaging', icon: 'MessagesSquare' },
  { label: 'Live Class', key: 'live-class', icon: 'Video' },
  {
    label: 'Exams',
    key: 'exams',
    icon: 'ClipboardList',
    children: [
      { label: 'Exam Schedule', key: 'exams-schedule' },
      { label: 'Marks Entry', key: 'exams-marks' },
      { label: 'Results', key: 'exams-results' },
    ],
  },
  {
    label: 'Reports',
    key: 'reports',
    icon: 'BarChart3',
    children: [
      { label: 'Attendance Report', key: 'reports-attendance' },
      { label: 'Fee Report', key: 'reports-fee' },
      { label: 'Exam Report', key: 'reports-exam' },
    ],
  },
  {
    label: 'Certificates',
    key: 'certificates',
    icon: 'Award',
    children: [
      { label: 'Certificate Templates', key: 'certificates-templates' },
      { label: 'Generate Certificate', key: 'certificates-generate' },
    ],
  },
]

// Flattens the (possibly nested) sidebar into a lookup of key -> label,
// used by dashboard pages to resolve a page title / placeholder heading.
export function flattenNav(nav) {
  const out = []
  for (const item of nav) {
    out.push({ key: item.key, label: item.label })
    if (item.children) {
      for (const child of item.children) out.push(child)
    }
  }
  return out
}

export const teacherSidebar = [
  { label: 'Dashboard', key: 'overview', icon: 'LayoutDashboard' },
  {
    label: 'Attendance',
    key: 'attendance',
    icon: 'CalendarCheck',
    children: [
      { label: 'Mark Attendance', key: 'mark-attendance' },
    ],
  },
  { label: 'My Timetable', key: 'timetable', icon: 'CalendarDays' },
  {
    label: 'Homework',
    key: 'homework-group',
    icon: 'BookMarked',
    children: [
      { label: 'Create Homework', key: 'create-homework' },
      { label: 'My Homework', key: 'homework' },
      { label: 'Check Submissions', key: 'check-submissions' },
    ],
  },
  {
    label: 'Exams',
    key: 'exams-group',
    icon: 'ClipboardList',
    children: [
      { label: 'My Exams', key: 'exams' },
      { label: 'Enter Marks', key: 'enter-marks' },
    ],
  },
  {
    label: 'Students',
    key: 'students-group',
    icon: 'GraduationCap',
    children: [
      { label: 'My Students', key: 'my-students' },
      { label: 'Student Progress', key: 'student-progress' },
    ],
  },
  { label: 'My Profile', key: 'profile', icon: 'Settings' },
]

export const studentSidebar = [
  { label: 'Dashboard', key: 'overview', icon: 'LayoutDashboard' },
  { label: 'My Attendance', key: 'attendance', icon: 'CalendarCheck' },
  { label: 'My Timetable', key: 'timetable', icon: 'CalendarDays' },
  {
    label: 'Homework',
    key: 'homework-group',
    icon: 'BookMarked',
    children: [
      { label: 'My Homework', key: 'homework' },
      { label: 'Submit Homework', key: 'submit-homework' },
    ],
  },
  {
    label: 'Exams',
    key: 'exams-group',
    icon: 'ClipboardList',
    children: [
      { label: 'My Exams', key: 'exams' },
      { label: 'My Results', key: 'results' },
    ],
  },
  {
    label: 'Fees',
    key: 'fees-group',
    icon: 'Wallet',
    children: [
      { label: 'My Fees', key: 'fees' },
      { label: 'Fee Payment', key: 'fee-payment' },
    ],
  },
  { label: 'My Certificates', key: 'certificates', icon: 'Award' },
  { label: 'My Profile', key: 'profile', icon: 'Settings' },
]

export const classAttendanceToday = [
  { name: 'Grade 8 - A', present: 28, total: 30 },
  { name: 'Grade 8 - B', present: 25, total: 29 },
  { name: 'Grade 9 - A', present: 30, total: 30 },
  { name: 'Grade 9 - B', present: 22, total: 28 },
]

export const homeworkList = [
  { subject: 'Mathematics', title: 'Algebra worksheet — Ch. 4', due: 'Tomorrow', status: 'pending' },
  { subject: 'Physics', title: 'Lab report — Motion', due: 'Fri', status: 'pending' },
  { subject: 'English', title: 'Essay — Book review', due: 'Submitted', status: 'submitted' },
]

export const examResults = [
  { subject: 'Mathematics', marks: 88, grade: 'A' },
  { subject: 'Physics', marks: 79, grade: 'B+' },
  { subject: 'English', marks: 92, grade: 'A+' },
  { subject: 'Biology', marks: 84, grade: 'A' },
]

export const feeInvoices = [
  { term: 'Term 1', amount: 'Rs. 24,000', status: 'Paid' },
  { term: 'Term 2', amount: 'Rs. 24,000', status: 'Paid' },
  { term: 'Term 3', amount: 'Rs. 24,000', status: 'Due 15 Aug' },
]
