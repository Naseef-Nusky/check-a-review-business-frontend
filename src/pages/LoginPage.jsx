import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { businessApi, ApiError } from '../services/api'
import { PUBLIC_SITE_URL } from '../utils/constants'
import PasswordInput from '../components/PasswordInput'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // login | forgot | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const { login, refreshBusiness, clearSession } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const resetToken = searchParams.get('token') || ''

  useEffect(() => {
    const emailFromQuery = searchParams.get('email')
    if (emailFromQuery) setEmail(emailFromQuery)
    if (searchParams.get('verified') === '1') {
      setInfo('Email verified. Please log in to continue.')
    }
  }, [searchParams])

  useEffect(() => {
    if (resetToken) {
      clearSession()
      setMode('reset')
      setResetDone(false)
      setError('')
      setInfo('')
      return
    }
    if (searchParams.get('forgot') === '1') {
      setMode('forgot')
      setForgotSent(false)
      setError('')
      setInfo('')
    }
  }, [searchParams, resetToken, clearSession])

  const openForgotMode = () => {
    setError('')
    setInfo('')
    setForgotSent(false)
    setMode('forgot')
    setSearchParams((params) => {
      const next = new URLSearchParams(params)
      next.delete('token')
      next.set('forgot', '1')
      return next
    }, { replace: true })
  }

  const leaveForgotMode = () => {
    setError('')
    setInfo('')
    setForgotSent(false)
    setMode('login')
    setSearchParams((params) => {
      const next = new URLSearchParams(params)
      next.delete('forgot')
      return next
    }, { replace: true })
  }

  const leaveResetMode = () => {
    setError('')
    setInfo('')
    setResetDone(false)
    setNewPassword('')
    setConfirmPassword('')
    setPassword('')
    setMode('login')
    setSearchParams((params) => {
      const next = new URLSearchParams(params)
      next.delete('token')
      next.delete('forgot')
      return next
    }, { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const { user, token } = await businessApi.login(email, password)
      if (user.role !== 'business') {
        throw new ApiError('This portal is for business accounts only. Use the main website to sign in.', 403)
      }
      login(user, token)
      await refreshBusiness()
      navigate('/dashboard')
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      await businessApi.forgotPassword(email.trim())
      setForgotSent(true)
    } catch (err) {
      setError(err.message || 'Could not send reset link')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!resetToken) {
      setError('Invalid or missing reset link. Please request a new one.')
      return
    }

    setLoading(true)
    try {
      await businessApi.resetPassword(resetToken, newPassword)
      clearSession()
      setResetDone(true)
      setTimeout(() => {
        leaveResetMode()
        setInfo('Password updated. Please sign in with your new password.')
      }, 2000)
    } catch (err) {
      const message = err.message || 'Could not reset password'
      if (/invalid or expired reset token/i.test(message)) {
        setError('This reset link is invalid or has expired. Please request a new one.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const cardTitle =
    mode === 'reset'
      ? resetDone
        ? 'Password updated'
        : 'Choose a new password'
      : mode === 'forgot'
        ? forgotSent
          ? 'Check your email'
          : 'Reset your password'
        : 'Log in to your business account'

  const cardSubtitle =
    mode === 'reset'
      ? resetDone
        ? 'You can now sign in with your new password.'
        : 'Enter a new password for your business account.'
      : mode === 'forgot'
        ? forgotSent
          ? 'If a business account exists for this email, we sent a secure reset link.'
          : 'Enter your business account email and we will send you a reset link.'
        : null

  return (
    <div className="bg-slate-100">
      <section className="px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Manage reviews. Reply faster. Grow trust.
          </h1>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8">
            <p className="text-center text-sm font-medium text-slate-600">{cardTitle}</p>
            {cardSubtitle ? (
              <p className="mt-2 text-center text-sm text-slate-500">{cardSubtitle}</p>
            ) : null}

            {mode === 'login' ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {info}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="label-text text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="owner@company.com"
                  />
                </div>
                <PasswordInput
                  id="password"
                  label="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  labelRight={
                    <button
                      type="button"
                      onClick={openForgotMode}
                      className="text-sm font-medium text-primary-700 hover:text-primary-800"
                    >
                      Forgot password?
                    </button>
                  }
                />
                <button type="submit" className="btn-primary w-full rounded-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Log in'}
                </button>
                <p className="text-center text-sm text-slate-500">
                  Need an account?{' '}
                  <Link to="/setup" className="font-medium text-primary-700 hover:text-primary-800">
                    Set up your business
                  </Link>
                </p>
              </form>
            ) : null}

            {mode === 'forgot' ? (
              forgotSent ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    If a business account exists for <strong>{email}</strong>, a password reset link has been sent.
                    Check your inbox and spam folder.
                  </div>
                  <button
                    type="button"
                    onClick={leaveForgotMode}
                    className="w-full text-center text-sm font-medium text-primary-700 hover:text-primary-800"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="forgot-email" className="label-text text-slate-700">
                      Email
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="owner@company.com"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full rounded-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send reset link'}
                  </button>
                  <button
                    type="button"
                    onClick={leaveForgotMode}
                    className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
                  >
                    Back to sign in
                  </button>
                </form>
              )
            ) : null}

            {mode === 'reset' ? (
              resetDone ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    Your password has been updated. Please sign in with your new password.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <PasswordInput
                    id="new-password"
                    label="New password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <PasswordInput
                    id="confirm-password"
                    label="Confirm new password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="submit" className="btn-primary w-full rounded-full" disabled={loading}>
                    {loading ? 'Updating...' : 'Update password'}
                  </button>
                  <button
                    type="button"
                    onClick={leaveResetMode}
                    className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
                  >
                    Back to sign in
                  </button>
                  {error ? (
                    <p className="text-center text-sm text-slate-500">
                      Link expired?{' '}
                      <button
                        type="button"
                        onClick={openForgotMode}
                        className="font-medium text-primary-700 hover:text-primary-800"
                      >
                        Request a new reset link
                      </button>
                    </p>
                  ) : null}
                </form>
              )
            ) : null}
          </div>

          <div className="mt-14">
            <h2 className="text-xl font-semibold text-slate-900">Looking for a customer account?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Reviewer and business logins are separate. You can keep a reviewer account and also create a business
              account with the same email.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`${PUBLIC_SITE_URL}/login`}
                className="rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Reviewer log in
              </a>
              <a
                href={`${PUBLIC_SITE_URL}/register`}
                className="rounded-full border-2 border-primary-500 px-6 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
              >
                Create reviewer account
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
