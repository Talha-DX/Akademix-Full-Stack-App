import client from './axios'

// Thin wrapper around backend/src/routes/resultRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const resultApi = {
  list: (params) => client.get('/results', { params }),
  getById: (id) => client.get(`/results/${id}`),
  create: (payload) => client.post('/results', payload),
  update: (id, payload) => client.put(`/results/${id}`, payload),
  remove: (id) => client.delete(`/results/${id}`),
  byStudent: (studentId) => client.get(`/results/student/${studentId}`),
}
