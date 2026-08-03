import client from './axios'

export const profileApi = {
  get: () => client.get('/profile'),
  update: (payload) => client.put('/profile', payload),
}
