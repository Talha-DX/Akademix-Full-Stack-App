import client from './axios'

// Thin wrapper around backend/src/routes/feeRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const feeApi = {
  listStructures: (params) => client.get('/fees/structures', { params }),
  listInvoices: (params) => client.get('/fees/invoices', { params }),
  payInvoice: (id) => client.put(`/fees/invoices/${id}/pay`),
}
