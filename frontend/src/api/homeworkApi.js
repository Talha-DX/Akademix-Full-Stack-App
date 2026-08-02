import client from './axios'

// Thin wrapper around backend/src/routes/homeworkRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const homeworkApi = {
  list: (params) => client.get('/homework', { params }),
  getById: (id) => client.get(`/homework/${id}`),
  create: (payload) => client.post('/homework', payload),
  update: (id, payload) => client.put(`/homework/${id}`, payload),
  remove: (id) => client.delete(`/homework/${id}`),
}
