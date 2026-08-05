import client from './axios'
export const liveClassApi = {
  list: (params) => client.get('/live-classes', { params }),
  create: (payload) => client.post('/live-classes', payload),
  update: (id, payload) => client.put(`/live-classes/${id}`, payload),
  remove: (id) => client.delete(`/live-classes/${id}`),
}
