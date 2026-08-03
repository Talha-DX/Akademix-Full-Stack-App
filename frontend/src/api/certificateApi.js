import client from './axios'

export const certificateApi = {
  list: (params) => client.get('/certificates', { params }),
  create: (payload) => client.post('/certificates', payload),
  downloadPdf: (id) => client.get(`/certificates/${id}/pdf`, { responseType: 'blob' }),
  remove: (id) => client.delete(`/certificates/${id}`),
}
