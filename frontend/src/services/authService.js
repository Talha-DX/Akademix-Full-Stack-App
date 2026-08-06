import { authApi } from '../api/authApi'

// Thin business-logic layer above api/authApi.js — e.g. token storage.
// Pages/hooks should call this, not the api file directly.
export const authService = {
  async login({ email, password, role }, remember = true) {
    const { data } = await authApi.login({ email, password, role })
    const store = remember ? localStorage : sessionStorage
    // Clear the other storage so a stale token can't linger there from a
    // previous login with the opposite "remember me" choice.
    const other = remember ? sessionStorage : localStorage
    other.removeItem('akademix_token')
    store.setItem('akademix_token', data.token)
    return data.user
  },
  logout() {
    localStorage.removeItem('akademix_token')
    sessionStorage.removeItem('akademix_token')
  },
}
