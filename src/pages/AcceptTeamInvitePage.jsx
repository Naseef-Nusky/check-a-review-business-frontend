import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { businessApi, ApiError } from '../services/api'

export default function AcceptTeamInvitePage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { login, isAuthenticated, user, refreshBusiness } = useAuth()
  const [invite, setInvite] = useState(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    businessApi
      .getTeamInvite(token)
      .then((data) => setInvite(data))
      .catch((err) => setError(err.message || 'Invitation not found'))
      .finally(() => setLoading(false))
  }, [token])

  const handleAccept = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = await businessApi.acceptTeamInvite(token, {
        name,
        password: invite?.hasExistingAccount ? undefined : password,
      })

      if (data?.token && data?.user) {
        login(data.user, data.token)
      }
      try {
        await refreshBusiness()
      } catch {
        // profile may still load on next dashboard visit
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not accept invitation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <p className="text-sm text-slate-500">Loading invitation...</p>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4">
        <div className="w-full rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <Link to="/login" className="mt-4 inline-block text-sm font-medium text-primary-600">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  const needsAccount = !invite?.hasExistingAccount
  const loggedInAsInvitee =
    isAuthenticated && user?.email?.toLowerCase() === invite?.email?.toLowerCase()

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
      <div className="card w-full p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Join the team</h1>
        <p className="mt-2 text-sm text-slate-600">
          You’ve been invited to <strong>{invite.businessName}</strong> as{' '}
          <strong>{invite.email}</strong>.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {invite.hasExistingAccount && !loggedInAsInvitee ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">
              An account already exists for this email. Log in, then open this invite link again.
            </p>
            <Link to="/login" className="btn-primary inline-flex">
              Log in to accept
            </Link>
          </div>
        ) : (
          <form onSubmit={handleAccept} className="mt-6 space-y-4">
            {needsAccount ? (
              <>
                <div>
                  <label className="label-text">Your name</label>
                  <input
                    className="input-field"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="label-text">Create password</label>
                  <input
                    type="password"
                    className="input-field"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-600">
                Logged in as {user?.email}. Click accept to join this business dashboard.
              </p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Accepting...' : 'Accept invitation'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
