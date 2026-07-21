import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { API_BASE_URL } from '../utils/constants'

export default function WidgetPage() {
  const { business, refreshBusiness } = useAuth()
  const [widget, setWidget] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const profile = business || (await refreshBusiness())
        const data = await businessApi.getWidget(profile.id)
        if (active) setWidget(data)
      } catch (err) {
        if (active) setError(err.message || 'Failed to load widget')
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  const embedCode = business?.id
    ? `<iframe src="${API_BASE_URL}/widget/${business.id}" title="Check A Review widget" width="100%" height="320" style="border:0;border-radius:12px;"></iframe>`
    : ''

  const copy = async () => {
    if (!embedCode) return
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Review widget</h2>
        <p className="mt-1 text-sm text-ink-muted">Embed your rating summary on your website.</p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold text-ink">Live preview data</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Average rating</dt>
              <dd className="font-medium">{widget?.averageRating ?? business?.average_rating ?? 0}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Review count</dt>
              <dd className="font-medium">{widget?.reviewCount ?? business?.review_count ?? 0}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Trust score</dt>
              <dd className="font-medium">{widget?.trustScore ?? business?.trust_score ?? 0}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink">Embed code</h3>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{embedCode}</pre>
          <button type="button" className="btn-primary mt-4" onClick={copy} disabled={!embedCode}>
            {copied ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      </div>
    </div>
  )
}
