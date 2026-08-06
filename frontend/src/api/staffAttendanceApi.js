import client from './axios'
export const staffAttendanceApi = {
  list: (params) => client.get('/staff-attendance', { params }),
  mark: (payload) => client.post('/staff-attendance/mark', payload),
}
