import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { API_BASE_URL } from '../utils/constants'

const WIDGET_STYLES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Business summary and recent reviews on a light background.',
    height: 360,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'A short rating bar for headers, product pages, and footers.',
    height: 140,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Full review card designed for dark website sections.',
    height: 360,
  },
]

export default function WidgetPage() {
  const { business, refreshBusiness } = useAuth()
  const [widget, setWidget] = useState(null)
  const [domainStatus, setDomainStatus] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('classic')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const profile = business || (await refreshBusiness())
        const status = await businessApi.getWidgetDomainStatus(profile.id)
        if (!active) return
        setDomainStatus(status)

        if (!status?.hasDomains) {
          setWidget(null)
          setError('')
          return
        }
        if ((status.widgets || []).length) {
          setSelectedStyle(status.widgets[0].id)
        }

        const data = await businessApi.getWidget(profile.id, { preview: true })
        if (active) {
          setWidget(data)
          setError('')
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load widget')
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  const availableWidgets = domainStatus?.widgets?.length ? domainStatus.widgets : WIDGET_STYLES
  const styleConfig = availableWidgets.find((style) => style.id === selectedStyle) || availableWidgets[0] || WIDGET_STYLES[0]
  const hasDomains = Boolean(domainStatus?.hasDomains)
  const widgetsLocked = Number(domainStatus?.widgetsAllowed) === 0
  const domains = domainStatus?.domains || []

  // Preview uses preview=1 so portal can load without being a registered customer domain.
  const previewUrl = business?.id
    ? `${API_BASE_URL}/widget/${business.id}?style=${selectedStyle}&preview=1`
    : ''
  // Public embed must NOT include preview=1 — it only works on registered domains.
  const embedUrl = widget?.embedUrl
    ? `${widget.embedUrl}?style=${selectedStyle}`
    : business?.id && hasDomains
      ? `${API_BASE_URL}/widget/${business.id}?style=${selectedStyle}`
      : ''
  const embedCode = embedUrl
    ? `<iframe src="${embedUrl}" title="Check A Review widget" width="100%" height="${styleConfig.height}" style="border:0;border-radius:12px;"></iframe>`
    : ''

  const copy = async () => {
    if (!embedCode || !hasDomains) return
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Review widget</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Embed your rating summary only on domains registered for this business.
        </p>
      </div>

      {!hasDomains ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add at least one domain before you can use the widget.{' '}
          <Link to="/domains" className="font-semibold text-primary-600 hover:underline">
            Go to Domains
          </Link>
        </div>
      ) : widgetsLocked ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Widgets start on Starter. Your plan includes {domainStatus?.widgetsAllowed ?? 0} widgets.{' '}
          <Link to="/subscription" className="font-semibold text-primary-600 hover:underline">
            Upgrade
          </Link>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Widget allowed on: <span className="font-medium">{domains.join(', ')}</span>
          {domainStatus?.widgetsAllowed ? ` · ${domainStatus.widgetsAllowed} widget styles on this plan` : ''}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card mb-4 overflow-hidden p-0">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-semibold text-ink">Live preview</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Portal preview only. On live websites, the widget loads only on your registered domains.
          </p>
        </div>
        <div className="bg-slate-50 p-6">
          {business?.id && hasDomains && !widgetsLocked ? (
            <iframe
              key={`${business.id}-${selectedStyle}`}
              src={previewUrl}
              title="Check A Review widget preview"
              className="mx-auto block w-full max-w-lg"
              height={styleConfig.height}
              style={{ border: 0 }}
            />
          ) : (
            <p className="py-10 text-center text-sm text-ink-muted">
              {hasDomains ? 'Loading preview...' : 'Add a domain to unlock the widget preview.'}
            </p>
          )}
        </div>
      </div>

      <div className="card mb-4 p-6">
        <h3 className="font-semibold text-ink">Choose widget style</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Select a design before copying your embed code. The preview above updates automatically.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {availableWidgets.map((style) => {
            const selected = selectedStyle === style.id
            const dark = style.id === 'dark' || style.layout === 'dark'
            return (
              <button
                key={style.id}
                type="button"
                disabled={!hasDomains || widgetsLocked}
                onClick={() => {
                  setSelectedStyle(style.id)
                  setCopied(false)
                }}
                className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected
                    ? 'border-primary-400 bg-primary-50 ring-4 ring-primary-500/10'
                    : 'border-border bg-white hover:border-slate-300'
                }`}
                aria-pressed={selected}
              >
                <div
                  className={`mb-4 overflow-hidden rounded-lg border ${
                    dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className={`flex items-center gap-2 p-2.5 ${style.id === 'compact' ? '' : 'border-b border-inherit'}`}>
                    <span className={`h-5 w-5 rounded ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className="flex-1">
                      <span className={`block h-1.5 w-16 rounded ${dark ? 'bg-slate-500' : 'bg-slate-300'}`} />
                      <span className="mt-1 block h-1.5 w-12 rounded bg-primary-400" />
                    </div>
                  </div>
                  {style.id !== 'compact' && (
                    <div className="space-y-1.5 p-2.5">
                      <span className={`block h-1.5 w-full rounded ${dark ? 'bg-slate-700' : 'bg-slate-100'}`} />
                      <span className={`block h-1.5 w-4/5 rounded ${dark ? 'bg-slate-700' : 'bg-slate-100'}`} />
                    </div>
                  )}
                  <div className="h-3 bg-slate-950" />
                </div>
                <span className="text-sm font-semibold text-ink">{style.name}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{style.description}</span>
              </button>
            )
          })}
        </div>
      </div>

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
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Allowed domains</dt>
              <dd className="font-medium text-right">{domains.length ? domains.join(', ') : 'None'}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink">Embed code</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Paste this only on your registered domains. Other websites will be blocked.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {hasDomains ? embedCode || 'Loading embed code...' : 'Add a domain to unlock your embed code.'}
          </pre>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={copy}
            disabled={!embedCode || !hasDomains || widgetsLocked}
          >
            {copied ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      </div>
    </div>
  )
}
