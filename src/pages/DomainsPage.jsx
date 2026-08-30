import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi, ApiError } from '../services/api'

export default function DomainsPage() {
  const { business, user, refreshBusiness } = useAuth()
  const [domains, setDomains] = useState([])
  const [limits, setLimits] = useState(null)
  const [domainInput, setDomainInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const isOwner = Boolean(
    limits?.isOwner || business?.is_owner || (business?.user_id && user?.id && business.user_id === user.id),
  )
  const atLimit = Boolean(limits && !limits.canAdd)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = business || (await refreshBusiness())
      const data = await businessApi.getDomains(profile.id)
      setDomains(data?.domains || [])
      setLimits(data?.limits || null)
      await refreshBusiness().catch(() => null)
    } catch (err) {
      setError(err.message || 'Failed to load domains')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeAdd = () => {
    if (saving) return
    setOpenAdd(false)
    setFormError('')
    setDomainInput('')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!business?.id || atLimit) return
    setSaving(true)
    setFormError('')
    setSuccess('')
    try {
      await businessApi.addDomain(business.id, domainInput)
      setDomainInput('')
      setOpenAdd(false)
      setSuccess('Domain added. Plan limits follow your subscription’s Domains allowance.')
      await load()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to add domain')
    } finally {
      setSaving(false)
    }
  }

  const handleSetPrimary = async (domainId) => {
    if (!business?.id) return
    setError('')
    setSuccess('')
    try {
      await businessApi.setPrimaryDomain(business.id, domainId)
      setSuccess('Primary domain updated')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to set primary domain')
    }
  }

  const handleRemove = async (domainId) => {
    if (!business?.id) return
    if (!window.confirm('Remove this domain from your account?')) return
    setError('')
    setSuccess('')
    try {
      await businessApi.removeDomain(business.id, domainId)
      setSuccess('Domain removed')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to remove domain')
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Domains</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Manage websites linked to this business. Limits follow your plan’s Domains allowance.
            We confirm each domain exists in DNS before it is added.
          </p>
        </div>
        {isOwner || loading ? (
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2"
            disabled={loading}
            onClick={() => {
              setFormError('')
              setOpenAdd(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add domain
          </button>
        ) : null}
      </div>

      {limits ? (
        <div className="card mb-6 p-5">
          <p className="text-sm text-slate-700">
            Using <span className="font-semibold">{limits.usedDomains}</span> of{' '}
            <span className="font-semibold">{limits.maxDomainsLabel}</span> domain
            {limits.maxDomains === 1 ? '' : 's'} on your{' '}
            <span className="font-semibold capitalize">{limits.plan}</span> plan.
          </p>
          {atLimit ? (
            <p className="mt-2 text-sm text-amber-700">
              You’re at your domain limit.{' '}
              <Link to="/subscription" className="font-medium text-primary-600 hover:underline">
                Upgrade your plan
              </Link>{' '}
              to add more websites.
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
          Only the business owner can add or remove domains.
        </div>
      ) : null}

      <div className="card table-scroll">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading domains...</p>
        ) : (
          <table className="min-w-[36rem] w-full text-left text-sm">
            <thead className="border-b border-border bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Primary</th>
                {isOwner ? <th className="px-4 py-3 font-medium" /> : null}
              </tr>
            </thead>
            <tbody>
              {domains.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <span>{item.domain}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {item.is_primary ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Primary
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  {isOwner ? (
                    <td className="px-4 py-3 text-right space-x-3">
                      {!item.is_primary ? (
                        <button
                          type="button"
                          className="text-sm font-medium text-primary-600 hover:underline"
                          onClick={() => handleSetPrimary(item.id)}
                        >
                          Make primary
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-sm font-medium text-red-600 hover:underline"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 3 : 2} className="px-4 py-8 text-center text-slate-500">
                    No domains yet. Add your first website domain.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {openAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close add domain popup"
            onClick={closeAdd}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-domain-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 id="add-domain-title" className="text-lg font-semibold text-slate-900">
                  Add domain
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Example: cleanpro.co.uk or cleanpro.com. Unused or misspelled domains are rejected.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={closeAdd}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {atLimit ? (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your {limits?.plan || 'current'} plan allows {limits?.maxDomainsLabel || 1} domain
                {limits?.maxDomains === 1 ? '' : 's'}.{' '}
                <Link to="/subscription" className="font-medium text-primary-600 hover:underline">
                  Upgrade plan
                </Link>{' '}
                to add more.
              </div>
            ) : null}

            {formError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label-text">Website domain</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="mybusiness.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  disabled={saving || atLimit}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={closeAdd} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving || atLimit}>
                  {saving ? 'Checking domain...' : 'Add domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
