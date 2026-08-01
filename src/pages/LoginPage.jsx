import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { businessApi, ApiError } from '../services/api'
import { PUBLIC_SITE_URL } from '../utils/constants'
import PasswordInput from '../components/PasswordInput'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, refreshBusiness } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const emailFromQuery = searchParams.get('email')
    if (emailFromQuery) setEmail(emailFromQuery)
    if (searchParams.get('verified') === '1') {
      setInfo('Email verified. Please log in to continue.')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
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

  return (
    <div className="bg-slate-100">
      <section className="px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Manage reviews. Reply faster. Grow trust.
          </h1>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8">
            <p className="text-center text-sm font-medium text-slate-600">
              Log in to your business account
            </p>

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
              />
              <button
                type="submit"
                className="btn-primary w-full rounded-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Log in'}
              </button>
              <p className="text-center text-sm text-slate-500">
                Need an account?{' '}
                <Link to="/setup" className="font-medium text-primary-700 hover:text-primary-800">
                  Set up your business
                </Link>
              </p>
            </form>
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
