import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function InvitationsPage() {
  const { business, refreshBusiness } = useAuth()
  const [email, setEmail] = useState('')
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [quota, setQuota] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = business || (await refreshBusiness())
      const [rows, sub] = await Promise.all([
        businessApi.getInvitations(profile.id),
        businessApi.getSubscription(profile.id).catch(() => null),
      ])
      setInvitations(rows || [])
      setQuota(sub?.entitlements || null)
    } catch (err) {
      setError(err.message || 'Failed to load invitations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!business?.id) return
    setSending(true)
    setError('')
    setSuccess('')
    try {
      await businessApi.sendInvitation(business.id, email)
      setEmail('')
      setSuccess('Invitation sent')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Invitations</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Invite customers by email to leave a review.
          {quota
            ? ` ${quota.usage.invitationsThisMonth}/${quota.limits.invitationsPerMonthLabel} used this month.`
            : ''}
        </p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={handleSend} className="card mb-6 flex flex-col gap-3 p-5 sm:flex-row">
        <input
          type="email"
          required
          className="input-field flex-1"
          placeholder="customer@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={sending || (quota?.remaining?.invitations === 0)}
        >
          {sending ? 'Sending...' : 'Send invite'}
        </button>
      </form>

      <div className="card table-scroll">
        <table className="min-w-[36rem] w-full text-left text-sm">
          <thead className="border-b border-border bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-muted">Loading...</td>
              </tr>
            ) : invitations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-muted">No invitations yet.</td>
              </tr>
            ) : (
              invitations.map((invite) => (
                <tr key={invite.id} className="border-b border-border">
                  <td className="px-4 py-3 font-medium text-ink">{invite.email}</td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{invite.status}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {invite.sent_at ? new Date(invite.sent_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
