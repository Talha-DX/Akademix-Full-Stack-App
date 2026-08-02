import { authApi } from '../api/authApi'

// Thin business-logic layer above api/authApi.js — e.g. token storage.
// Pages/hooks should call this, not the api file directly.
export const authService = {
  async login(credentials) {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('akademix_token', data.token)
    return data.user
  },
  logout() {
    localStorage.removeItem('akademix_token')
  },
}
