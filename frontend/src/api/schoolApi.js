import client from './axios'

export const schoolApi = {
  getSettings: () => client.get('/school/settings'),
  updateSettings: (payload) => client.put('/school/settings', payload),
}
