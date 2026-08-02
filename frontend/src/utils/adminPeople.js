export function getApiErrorMessage(error, fallback = 'Request failed') {
  return error?.response?.data?.message || fallback
}

export function parseDesignation(designation = '') {
  const [departmentRaw, titleRaw] = String(designation).split('::')
  const department = (departmentRaw || 'General').trim() || 'General'
  const title = (titleRaw || designation || 'Teacher').trim() || 'Teacher'
  return { department, title }
}

export function composeDesignation(department, title) {
  return `${String(department || 'General').trim()}::${String(title || 'Teacher').trim()}`
}

export function formatDateInput(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export function normalizeStudent(student) {
  return {
    id: student.id,
    userId: student.user?.id,
    name: student.user?.name || '',
    email: student.user?.email || '',
    phone: student.user?.phone || '',
    admissionNo: student.admissionNo || '',
    dob: formatDateInput(student.dob),
    classId: student.classId,
    className: student.class?.name || '',
    section: student.class?.section || '',
  }
}

export function normalizeStaff(staff) {
  const { department, title } = parseDesignation(staff.designation)
  return {
    id: staff.id,
    userId: staff.user?.id,
    name: staff.user?.name || '',
    email: staff.user?.email || '',
    phone: staff.user?.phone || '',
    designation: staff.designation || '',
    department,
    title,
    subjectCount: staff.subjects?.length || 0,
  }
}
