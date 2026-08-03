import client from './axios'

export const feeApi = {
  listStructures: (params) => client.get('/fees/structures', { params }),
  createStructure: (payload) => client.post('/fees/structures', payload),
  updateStructure: (id, payload) => client.put(`/fees/structures/${id}`, payload),
  removeStructure: (id) => client.delete(`/fees/structures/${id}`),

  listInvoices: (params) => client.get('/fees/invoices', { params }),
  createInvoice: (payload) => client.post('/fees/invoices', payload),
  payInvoice: (id) => client.put(`/fees/invoices/${id}/pay`),
  downloadReceipt: (id) => client.get(`/fees/invoices/${id}/receipt`, { responseType: 'blob' }),
  removeInvoice: (id) => client.delete(`/fees/invoices/${id}`),
}
