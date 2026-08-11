import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi, ApiError } from '../services/api'

export default function TeamPage() {
  const { business, user, refreshBusiness } = useAuth()
  const [members, setMembers] = useState([])
  const [seats, setSeats] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const isOwner = Boolean(
    seats?.isOwner || business?.is_owner || (business?.user_id && user?.id && business.user_id === user.id),
  )
  const atSeatLimit = Boolean(seats && !seats.canInvite)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = business || (await refreshBusiness())
      const data = await businessApi.getTeam(profile.id)
      setMembers(data?.members || [])
      setSeats(data?.seats || null)
    } catch (err) {
      setError(err.message || 'Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeCreate = () => {
    if (saving) return
    setOpenCreate(false)
    setFormError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  const openCreatePopup = () => {
    setFormError('')
    setSuccess('')
    setOpenCreate(true)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!business?.id || atSeatLimit) return
    setSaving(true)
    setFormError('')
    setSuccess('')
    try {
      await businessApi.createTeamMember(business.id, { name, email, password })
      setName('')
      setEmail('')
      setPassword('')
      setFormError('')
      setOpenCreate(false)
      setSuccess('User created. They can log in to the business portal with that email and password.')
      await load()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (memberId) => {
    if (!business?.id) return
    if (!window.confirm('Remove this person from your team?')) return
    setError('')
    setSuccess('')
    try {
      await businessApi.removeTeamMember(business.id, memberId)
      setSuccess('Team member removed')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to remove member')
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Team</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Create logins for your team. Seat limits follow your plan.
          </p>
        </div>
        {isOwner || loading ? (
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2"
            disabled={loading}
            onClick={openCreatePopup}
          >
            <Plus className="h-4 w-4" />
            Create user
          </button>
        ) : null}
      </div>

      {seats ? (
        <div className="card mb-6 p-5">
          <p className="text-sm text-slate-700">
            Using <span className="font-semibold">{seats.usedSeats}</span> of{' '}
            <span className="font-semibold">{seats.maxUsersLabel}</span> user
            {seats.maxUsers === 1 ? '' : 's'} on your{' '}
            <span className="font-semibold capitalize">{seats.plan}</span> plan.
          </p>
          {atSeatLimit ? (
            <p className="mt-2 text-sm text-amber-700">
              You’re at your seat limit.{' '}
              <Link to="/subscription" className="font-medium text-primary-600 hover:underline">
                Upgrade your plan
              </Link>{' '}
              to add more people.
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      {!loading && !isOwner ? (
        <div className="card mb-6 p-5 text-sm text-slate-600">
          Only the business owner can create or remove team members.
        </div>
      ) : null}

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading team...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {isOwner ? <th className="px-4 py-3 font-medium" /> : null}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-slate-900">{member.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{member.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">{member.role}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">{member.status}</td>
                  {isOwner ? (
                    <td className="px-4 py-3 text-right">
                      {member.role !== 'owner' && !member.is_account_owner ? (
                        <button
                          type="button"
                          className="text-sm font-medium text-red-600 hover:underline"
                          onClick={() => handleRemove(member.id)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              ))}
              {members.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 5 : 4} className="px-4 py-8 text-center text-slate-500">
                    No team members yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {openCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close create user popup"
            onClick={closeCreate}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 id="create-user-title" className="text-lg font-semibold text-slate-900">
                  Create user
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add a team login for this business dashboard.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={closeCreate}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {atSeatLimit ? (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your {seats?.plan || 'current'} plan allows {seats?.maxUsersLabel || 1} user
                {seats?.maxUsers === 1 ? '' : 's'} and you already use {seats?.usedSeats}.{' '}
                <Link to="/subscription" className="font-medium text-primary-600 hover:underline">
                  Upgrade plan
                </Link>{' '}
                to create more users.
              </div>
            ) : null}

            {formError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label-text">Full name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving || atSeatLimit}
                  autoFocus
                />
              </div>
              <div>
                <label className="label-text">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={saving || atSeatLimit}
                />
              </div>
              <div>
                <label className="label-text">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={saving || atSeatLimit}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={closeCreate} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving || atSeatLimit}>
                  {saving ? 'Creating...' : 'Create user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
