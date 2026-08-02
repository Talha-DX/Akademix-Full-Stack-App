import client from './axios'

// Thin wrapper around backend/src/routes/subjectRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const subjectApi = {
  list: (params) => client.get('/subjects', { params }),
  getById: (id) => client.get(`/subjects/${id}`),
  create: (payload) => client.post('/subjects', payload),
  update: (id, payload) => client.put(`/subjects/${id}`, payload),
  remove: (id) => client.delete(`/subjects/${id}`),
}
