import client from './axios'

// Thin wrapper around backend/src/routes/dashboardRoutes.js — swap the mock
// data in src/data/ for these calls once that route is implemented.
export const dashboardApi = {
  stats: () => client.get('/dashboard'),
}
