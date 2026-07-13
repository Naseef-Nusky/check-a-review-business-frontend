import { createContext, useCallback, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('business_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((userData, token) => {
    localStorage.setItem('business_user', JSON.stringify(userData))
    localStorage.setItem('business_token', token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('business_user')
    localStorage.removeItem('business_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
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
