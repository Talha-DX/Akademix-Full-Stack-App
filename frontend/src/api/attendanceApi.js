import client from './axios'

// Thin wrapper around backend/src/routes/attendanceRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const attendanceApi = {
  list: (params) => client.get('/attendance', { params }),
  getById: (id) => client.get(`/attendance/${id}`),
  create: (payload) => client.post('/attendance', payload),
  update: (id, payload) => client.put(`/attendance/${id}`, payload),
  remove: (id) => client.delete(`/attendance/${id}`),
}
