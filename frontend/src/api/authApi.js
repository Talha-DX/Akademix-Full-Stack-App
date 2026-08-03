import client from './axios'

export const authApi = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (payload) => client.post('/auth/register', payload),
  logout: () => client.post('/auth/logout'),
  me: () => client.get('/auth/me'),
  forgotPassword: (payload) => client.post('/auth/forgot-password', payload),
  resetPassword: (payload) => client.post('/auth/reset-password', payload),
  changePassword: (payload) => client.post('/auth/change-password', payload),
}
