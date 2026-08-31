import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')

  const { login, signup, loginAsGuest, socialLogin } = useAuth()
  const nav = useNavigate()

  const handleTabSwitch = (newTab) => {
    setTab(newTab)
    setErr('')
    setSuccessMsg('')
  }

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return 'Email address is required'
    }
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address (e.g. user@example.com)'
    }
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long'
    }
    if (tab === 'signup') {
      if (!name.trim()) {
        return 'Please enter your full name'
      }
      if (password !== confirmPassword) {
        return 'Passwords do not match'
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setSuccessMsg('')

    const validationError = validate()
    if (validationError) {
      setErr(validationError)
      return
    }

    setLoading(true)
    try {
      if (tab === 'signup') {
        const res = await signup(name.trim(), email.trim(), password, rememberMe)
        if (res.success) {
          setSuccessMsg('Account created successfully! Redirecting...')
          setTimeout(() => nav('/dashboard'), 400)
        }
      } else {
        const res = await login(email.trim(), password, rememberMe)
        if (res.success) {
          setSuccessMsg('Logged in successfully! Redirecting...')
          setTimeout(() => nav('/dashboard'), 400)
        }
      }
    } catch (error) {
      setErr(error.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await loginAsGuest()
    nav('/dashboard')
  }

  const handleExecuteGoogleLogin = async (accountEmail = 'satish.google@gmail.com', accountName = 'Satish Kumar') => {
    setLoading(true)
    setShowGoogleModal(false)
    setErr('')
    setSuccessMsg(`Signing in with Google as ${accountName}...`)
    try {
      const res = await socialLogin('Google', accountEmail, accountName)
      if (res.success) {
        setSuccessMsg(`Welcome, ${accountName}! Redirecting...`)
        setTimeout(() => nav('/dashboard'), 400)
      }
    } catch (error) {
      setErr('Google sign in failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialClick = (provider) => {
    if (provider === 'Google') {
      setShowGoogleModal(true)
    } else {
      setLoading(true)
      socialLogin('Apple', 'satish.apple@icloud.com', 'Satish (Apple ID)')
      nav('/dashboard')
    }
  }

  const handleDemoFill = (demoEmail, demoName) => {
    setEmail(demoEmail)
    setPassword('demopass123')
    setName(demoName)
    setErr('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">🟪</div>
          <h1>Expenses Tracker</h1>
          <p className="muted">Smart financial insights &amp; expense management</p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'login'}
            className={tab === 'login' ? 'active' : ''}
            onClick={() => handleTabSwitch('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'signup'}
            className={tab === 'signup' ? 'active' : ''}
            onClick={() => handleTabSwitch('signup')}
          >
            Create Account
          </button>
        </div>

        {err && <div className="auth-alert error-banner">{err}</div>}
        {successMsg && <div className="auth-alert success-banner">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {tab === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="e.g. Satish Kumar"
                value={name}
                onChange={(e) => { setName(e.target.value); setErr('') }}
                disabled={loading}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="e.g. satish@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr('') }}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={tab === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErr('') }}
                disabled={loading}
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErr('') }}
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>
          )}

          <div className="auth-options">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            {tab === 'login' && (
              <span className="demo-hint" onClick={() => handleDemoFill('satish@example.com', 'Satish')}>
                Fill Demo Credentials
              </span>
            )}
          </div>

          <button type="submit" className="primary-btn submit-btn" disabled={loading}>
            {loading ? 'Processing...' : tab === 'login' ? 'Sign In to Dashboard' : 'Create My Account'}
          </button>
        </form>

        <div className="or">
          <span>or continue with</span>
        </div>

        <div className="social-row">
          <button
            type="button"
            className="social-btn google-btn"
            onClick={() => handleSocialClick('Google')}
            disabled={loading}
          >
            <svg className="social-svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="social-btn apple-btn"
            onClick={() => handleSocialClick('Apple')}
            disabled={loading}
          >
            <svg className="social-svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.7-0.93 2.71 1.01.08 2.03-.49 2.64-1.21z"/>
            </svg>
            Apple
          </button>
        </div>

        <div className="auth-footer-actions">
          <button
            type="button"
            className="guest-link-btn"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            ⚡ Continue as Guest (Skip Login) →
          </button>
        </div>

        <p className="muted small footer-security-note">🔒 256-bit encrypted • Fast &amp; Private</p>
      </div>

      {/* Google OAuth Account Chooser Modal */}
      {showGoogleModal && (
        <div className="google-modal-backdrop" onClick={() => setShowGoogleModal(false)}>
          <div className="google-modal" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <h3>Sign in with Google</h3>
              <p className="google-modal-subtitle">Choose an account to continue to Expense Tracker</p>
            </div>

            <div className="google-accounts-list">
              <button
                type="button"
                className="google-account-item"
                onClick={() => handleExecuteGoogleLogin('satish.google@gmail.com', 'Satish Kumar')}
              >
                <div className="google-avatar">S</div>
                <div className="google-account-details">
                  <span className="google-account-name">Satish Kumar</span>
                  <span className="google-account-email">satish.google@gmail.com</span>
                </div>
                <span className="google-account-arrow">→</span>
              </button>

              <button
                type="button"
                className="google-account-item"
                onClick={() => handleExecuteGoogleLogin('developer@gmail.com', 'App Developer')}
              >
                <div className="google-avatar dev-avatar">D</div>
                <div className="google-account-details">
                  <span className="google-account-name">App Developer</span>
                  <span className="google-account-email">developer@gmail.com</span>
                </div>
                <span className="google-account-arrow">→</span>
              </button>
            </div>

            <div className="google-custom-input">
              <input
                type="email"
                placeholder="Or type another Google email"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
              />
              <button
                type="button"
                className="google-custom-submit"
                disabled={!customGoogleEmail.includes('@')}
                onClick={() => {
                  if (customGoogleEmail.includes('@')) {
                    handleExecuteGoogleLogin(customGoogleEmail, customGoogleEmail.split('@')[0])
                  }
                }}
              >
                Continue
              </button>
            </div>

            <button
              type="button"
              className="google-modal-cancel"
              onClick={() => setShowGoogleModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

