import client from './axios'

// Thin wrapper around backend/src/routes/examRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const examApi = {
  list: (params) => client.get('/exams', { params }),
  getById: (id) => client.get(`/exams/${id}`),
  create: (payload) => client.post('/exams', payload),
  update: (id, payload) => client.put(`/exams/${id}`, payload),
  remove: (id) => client.delete(`/exams/${id}`),
}
