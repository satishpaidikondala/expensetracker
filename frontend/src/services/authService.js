async function handleResponse(res, defaultErrMsg) {
  let data
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok) {
    const errorMsg = (data && (data.message || data.error || data.detail)) || defaultErrMsg
    const error = new Error(errorMsg)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

export const authService = {
  login: async (email, password) => {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(res, 'Invalid email or password')
  },

  register: async (name, email, password) => {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    return handleResponse(res, 'Registration failed. Please check your information.')
  },

  socialAuth: async (provider = 'Google', email, name, avatarUrl) => {
    const res = await fetch('/auth/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, email, name, avatarUrl })
    })
    return handleResponse(res, 'Social authentication failed')
  },

  getProfile: async (token) => {
    const res = await fetch('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return handleResponse(res, 'Failed to retrieve profile')
  },

  logout: async (token) => {
    if (!token) return
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {}
  },

  validate: async (token) => {
    const res = await fetch('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return handleResponse(res, 'Token validation failed')
  },
}
