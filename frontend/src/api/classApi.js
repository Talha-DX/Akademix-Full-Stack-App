import client from './axios'

// Thin wrapper around backend/src/routes/classRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const classApi = {
  list: (params) => client.get('/classes', { params }),
  getById: (id) => client.get(`/classes/${id}`),
  create: (payload) => client.post('/classes', payload),
  update: (id, payload) => client.put(`/classes/${id}`, payload),
  remove: (id) => client.delete(`/classes/${id}`),
}
