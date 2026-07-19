import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = useCallback(async (username, password) => {
    const data = await api.login({ username, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    return data
  }, [])

  const signup = useCallback(async ({ username, email, password }) => {
    await api.signup({ username, email, password })
    return login(username, password)
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
    }),
    [token, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
