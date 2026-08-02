import client from './axios'

// Thin wrapper around backend/src/routes/studentRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const studentApi = {
  list: (params) => client.get('/students', { params }),
  getById: (id) => client.get(`/students/${id}`),
  create: (payload) => client.post('/students', payload),
  update: (id, payload) => client.put(`/students/${id}`, payload),
  remove: (id) => client.delete(`/students/${id}`),
}
