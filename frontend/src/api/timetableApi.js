import client from './axios'

export const timetableApi = {
  list: (params) => client.get('/timetable', { params }),
  byClass: (classId) => client.get('/timetable', { params: { classId } }),
  byTeacher: (teacherId) => client.get('/timetable', { params: { teacherId } }),
  create: (payload) => client.post('/timetable', payload),
  update: (id, payload) => client.put(`/timetable/${id}`, payload),
  remove: (id) => client.delete(`/timetable/${id}`),
}
