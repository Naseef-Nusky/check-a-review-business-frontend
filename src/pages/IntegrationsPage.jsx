import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plug } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function IntegrationsPage() {
  const { business, refreshBusiness } = useAuth()
  const [entitlements, setEntitlements] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const profile = business || (await refreshBusiness())
        const sub = await businessApi.getSubscription(profile.id)
        if (active) setEntitlements(sub?.entitlements || null)
      } catch (err) {
        if (active) setError(err.message || 'Failed to load integrations')
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  const allowed = entitlements?.integrations || []
  const limitLabel = entitlements?.limits?.integrationsLabel || '0'

  return (
    <div>
      <div className="mb-8 flex items-start gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Plug className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Integrations</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Your {entitlements?.name || 'plan'} includes {limitLabel} marketing and eCommerce integrations.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!allowed.length ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Integrations start on Starter.{' '}
          <Link to="/subscription" className="font-semibold text-primary-600 hover:underline">
            Upgrade your plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allowed.map((name) => (
            <div key={name} className="rounded-2xl border border-border bg-white p-4">
              <p className="font-semibold text-ink">{name}</p>
              <p className="mt-1 text-sm text-ink-muted">Included on your plan. Contact support to connect this tool.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
