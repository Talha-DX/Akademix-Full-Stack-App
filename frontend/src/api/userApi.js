import client from './axios'

// Thin wrapper around backend/src/routes/userRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const userApi = {
  list: (params) => client.get('/users', { params }),
  getById: (id) => client.get(`/users/${id}`),
  create: (payload) => client.post('/users', payload),
  update: (id, payload) => client.put(`/users/${id}`, payload),
  remove: (id) => client.delete(`/users/${id}`),
}
