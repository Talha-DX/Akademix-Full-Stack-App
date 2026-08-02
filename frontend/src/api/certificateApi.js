import client from './axios'

// Thin wrapper around backend/src/routes/certificateRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const certificateApi = {
  list: (params) => client.get('/certificates', { params }),
  getById: (id) => client.get(`/certificates/${id}`),
  create: (payload) => client.post('/certificates', payload),
  update: (id, payload) => client.put(`/certificates/${id}`, payload),
  remove: (id) => client.delete(`/certificates/${id}`),
}
