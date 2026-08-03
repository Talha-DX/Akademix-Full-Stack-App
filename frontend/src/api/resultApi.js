import client from './axios'

export const resultApi = {
  list: (params) => client.get('/results', { params }),
  byStudent: (studentId) => client.get(`/results/student/${studentId}`),
  downloadReportCard: (studentId, params) => client.get(`/results/student/${studentId}/report-card`, { params, responseType: 'blob' }),
  create: (payload) => client.post('/results', payload),
  bulkCreate: (payload) => client.post('/results/bulk', payload),
  update: (id, payload) => client.put(`/results/${id}`, payload),
  remove: (id) => client.delete(`/results/${id}`),
}
