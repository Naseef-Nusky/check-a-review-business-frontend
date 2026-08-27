import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { businessApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('business_user')
    return stored ? JSON.parse(stored) : null
  })
  const [business, setBusiness] = useState(null)
  const [bootstrapping, setBootstrapping] = useState(!!localStorage.getItem('business_token'))

  const login = useCallback((userData, token) => {
    localStorage.setItem('business_user', JSON.stringify(userData))
    localStorage.setItem('business_token', token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('business_user')
    localStorage.removeItem('business_token')
    setUser(null)
    setBusiness(null)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('business_user')
    localStorage.removeItem('business_token')
    setUser(null)
    setBusiness(null)
  }, [])

  const refreshBusiness = useCallback(async () => {
    const profile = await businessApi.getMyProfile()
    setBusiness(profile)
    return profile
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('business_token')
    if (!token) {
      setBootstrapping(false)
      return
    }

    let active = true
    ;(async () => {
      try {
        const me = await businessApi.me()
        if (!active) return
        if (me.role !== 'business') {
          logout()
          return
        }
        login(me, token)
        const profile = await businessApi.getMyProfile()
        if (active) setBusiness(profile)
      } catch {
        if (active) logout()
      } finally {
        if (active) setBootstrapping(false)
      }
    })()

    return () => {
      active = false
    }
  }, [login, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        setBusiness,
        login,
        logout,
        clearSession,
        refreshBusiness,
        bootstrapping,
        isAuthenticated: !!user && user.role === 'business',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
