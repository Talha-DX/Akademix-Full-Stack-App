import client from './axios'

export const attendanceApi = {
  list: (params) => client.get('/attendance', { params }),
  byStudent: (studentId, params) => client.get(`/attendance/student/${studentId}`, { params }),
  mark: (payload) => client.post('/attendance/mark', payload),
}
