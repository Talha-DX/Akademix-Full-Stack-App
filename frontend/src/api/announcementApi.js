import client from './axios'

// Thin wrapper around backend/src/routes/announcementRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const announcementApi = {
  list: (params) => client.get('/announcements', { params }),
  getById: (id) => client.get(`/announcements/${id}`),
  create: (payload) => client.post('/announcements', payload),
  update: (id, payload) => client.put(`/announcements/${id}`, payload),
  remove: (id) => client.delete(`/announcements/${id}`),
}
