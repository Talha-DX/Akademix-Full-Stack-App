import client from './axios'

// Thin wrapper around backend/src/routes/timetableRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const timetableApi = {
  list: (params) => client.get('/timetable', { params }),
  getById: (id) => client.get(`/timetable/${id}`),
  create: (payload) => client.post('/timetable', payload),
  update: (id, payload) => client.put(`/timetable/${id}`, payload),
  remove: (id) => client.delete(`/timetable/${id}`),
}
