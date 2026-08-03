import client from './axios'

export const homeworkApi = {
  list: (params) => client.get('/homework', { params }),
  getById: (id) => client.get(`/homework/${id}`),
  create: (payload) => {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    return client.post('/homework', payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
  },
  update: (id, payload) => client.put(`/homework/${id}`, payload),
  remove: (id) => client.delete(`/homework/${id}`),
  submit: (id, payload) => {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    return client.post(`/homework/${id}/submit`, payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
  },
  submissions: (id) => client.get(`/homework/${id}/submissions`),
  grade: (submissionId, payload) => client.put(`/homework/submissions/${submissionId}/grade`, payload),
}
