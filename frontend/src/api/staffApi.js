import client from './axios'

// Thin wrapper around backend/src/routes/staffRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const staffApi = {
  list: (params) => client.get('/staff', { params }),
  getById: (id) => client.get(`/staff/${id}`),
  create: (payload) => client.post('/staff', payload),
  update: (id, payload) => client.put(`/staff/${id}`, payload),
  remove: (id) => client.delete(`/staff/${id}`),
}
