import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'
import { authService } from '../services/authService'
import { getStoredToken } from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!getStoredToken()) {
      setIsLoading(false)
      return
    }
    authApi.me()
      .then(({ data }) => setUser(data))
      .catch(() => authService.logout())
      .finally(() => setIsLoading(false))
  }, [])

  // `credentials` is { email, password, role } — role is which tab (Admin /
  // Teacher / Student) the person picked on the login screen, cross-checked
  // server-side against the account's real role. `remember` controls
  // whether the session survives closing the browser.
  const login = async (credentials, remember = true) => {
    await authService.login(credentials, remember)
    const { data: nextUser } = await authApi.me()
    setUser(nextUser)
    return nextUser
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    localStorage.setItem('akademix_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try { await authApi.logout() } catch { /* token removal still signs the user out locally */ }
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}
