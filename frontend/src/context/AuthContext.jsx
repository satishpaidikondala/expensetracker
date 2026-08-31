import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user') || sessionStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null
  })

  const saveAuth = (userData, userToken, remember = true) => {
    const storage = remember ? localStorage : sessionStorage
    const otherStorage = remember ? sessionStorage : localStorage
    
    // Clear the opposite storage
    otherStorage.removeItem('user')
    otherStorage.removeItem('token')

    storage.setItem('user', JSON.stringify(userData))
    if (userToken) {
      storage.setItem('token', userToken)
    }
    setUser(userData)
    setToken(userToken || null)
  }

  const login = async (email, password = '', remember = true) => {
    const fallbackName = email.includes('@') ? email.split('@')[0] : email
    try {
      const data = await authService.login(email, password)
      const u = {
        email: data.email || email,
        name: data.name || data.userId || fallbackName,
        userId: data.userId || fallbackName,
        provider: data.provider || 'LOCAL',
        role: data.role || 'ROLE_USER',
      }
      saveAuth(u, data.token, remember)
      return { success: true, user: u }
    } catch (err) {
      if (err.status) {
        // Real server error (401 invalid credentials, 400 bad request, etc.) -> rethrow to UI
        throw err
      }
      // Fallback local mode only when backend server is completely unreachable
      const fallbackToken = 'dev-token-' + Date.now()
      const u = {
        email,
        name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
        userId: fallbackName,
        provider: 'LOCAL',
      }
      saveAuth(u, fallbackToken, remember)
      return { success: true, user: u }
    }
  }

  const signup = async (name, email, password = '', remember = true) => {
    const displayName = name.trim() || (email.includes('@') ? email.split('@')[0] : email)
    try {
      const data = await authService.register(displayName, email, password)
      const u = {
        email: data.email || email,
        name: data.name || displayName,
        userId: data.userId || displayName.toLowerCase().replace(/\s+/g, '_'),
        provider: data.provider || 'LOCAL',
        role: data.role || 'ROLE_USER',
      }
      saveAuth(u, data.token, remember)
      return { success: true, user: u }
    } catch (err) {
      if (err.status) {
        // Real server error (e.g. 409 Email already exists, 400 Validation error) -> rethrow to UI
        throw err
      }
      // Fallback local mode only when backend server is completely unreachable
      const fallbackToken = 'dev-token-' + Date.now()
      const u = {
        email,
        name: displayName,
        userId: displayName.toLowerCase().replace(/\s+/g, '_'),
        provider: 'LOCAL',
      }
      saveAuth(u, fallbackToken, remember)
      return { success: true, user: u }
    }
  }

  const loginAsGuest = async () => {
    const guestUser = {
      name: 'Guest Explorer',
      email: 'guest@expensetracker.app',
      userId: 'guest',
      isGuest: true,
    }
    try {
      const data = await authService.login('guest@expensetracker.app', 'guestpass')
      saveAuth({ ...guestUser, name: data.name || guestUser.name }, data.token, false)
      return { success: true, user: guestUser }
    } catch {
      saveAuth(guestUser, 'guest-token-' + Date.now(), false)
      return { success: true, user: guestUser }
    }
  }

  const socialLogin = async (provider = 'Google', customEmail, customName) => {
    const email = customEmail || (provider.toLowerCase() === 'google' ? 'satish.google@gmail.com' : `${provider.toLowerCase()}user@apple.com`)
    const name = customName || (provider.toLowerCase() === 'google' ? 'Satish Kumar (Google)' : `${provider} User`)
    const fallbackName = name
    try {
      const data = await authService.socialAuth(provider, email, name)
      const u = {
        email: data.email || email,
        name: data.name || fallbackName,
        userId: data.userId || (email.includes('@') ? email.split('@')[0] : email),
        provider,
      }
      saveAuth(u, data.token || `${provider.toLowerCase()}-token-` + Date.now(), true)
      return { success: true, user: u }
    } catch (err) {
      // Fallback local mode
      const fallbackToken = `${provider.toLowerCase()}-dev-token-` + Date.now()
      const u = {
        email,
        name: fallbackName,
        userId: email.includes('@') ? email.split('@')[0] : email,
        provider,
      }
      saveAuth(u, fallbackToken, true)
      return { success: true, user: u }
    }
  }

  const logout = async () => {
    try {
      const t = token || localStorage.getItem('token') || sessionStorage.getItem('token')
      if (t) await authService.logout(t)
    } catch {}
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        loginAsGuest,
        socialLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

