import client from './axios'

export const reportApi = {
  academic: () => client.get('/reports/academic'),
  attendance: () => client.get('/reports/attendance'),
  financial: () => client.get('/reports/financial'),
  student: () => client.get('/reports/student'),
  download: (type) => client.get(`/reports/${type}/pdf`, { responseType: 'blob' }),
}
