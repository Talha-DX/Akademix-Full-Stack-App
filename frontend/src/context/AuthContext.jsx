import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('akademix_token')) {
      setIsLoading(false)
      return
    }
    authApi.me()
      .then(({ data }) => setUser(data))
      .catch(() => authService.logout())
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (credentials) => {
    await authService.login(credentials)
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
