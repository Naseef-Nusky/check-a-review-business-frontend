import { useEffect, useState } from 'react'
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
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('classic')

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

  const styleConfig = WIDGET_STYLES.find((style) => style.id === selectedStyle) || WIDGET_STYLES[0]

  // The preview can use a relative path, but the snippet the customer pastes on
  // their own site must be absolute, so prefer the URL the API reports for itself.
  const previewUrl = business?.id ? `${API_BASE_URL}/widget/${business.id}?style=${selectedStyle}` : ''
  const embedUrl = widget?.embedUrl ? `${widget.embedUrl}?style=${selectedStyle}` : ''
  const embedCode = embedUrl
    ? `<iframe src="${embedUrl}" title="Check A Review widget" width="100%" height="${styleConfig.height}" style="border:0;border-radius:12px;"></iframe>`
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

      <div className="card mb-4 overflow-hidden p-0">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-semibold text-ink">Live preview</h3>
          <p className="mt-1 text-sm text-ink-muted">
            This is exactly what visitors see once the widget is embedded on your site.
          </p>
        </div>
        <div className="bg-slate-50 p-6">
          {business?.id ? (
            <iframe
              key={`${business.id}-${selectedStyle}`}
              src={previewUrl}
              title="Check A Review widget preview"
              className="mx-auto block w-full max-w-lg"
              height={styleConfig.height}
              style={{ border: 0 }}
            />
          ) : (
            <p className="py-10 text-center text-sm text-ink-muted">Loading preview...</p>
          )}
        </div>
      </div>

      <div className="card mb-4 p-6">
        <h3 className="font-semibold text-ink">Choose widget style</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Select a design before copying your embed code. The preview above updates automatically.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {WIDGET_STYLES.map((style) => {
            const selected = selectedStyle === style.id
            const dark = style.id === 'dark'
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  setSelectedStyle(style.id)
                  setCopied(false)
                }}
                className={`rounded-2xl border p-4 text-left transition ${
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
          </dl>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink">Embed code</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Paste this into your site&apos;s HTML wherever you want the widget to appear.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {embedCode || 'Loading embed code...'}
          </pre>
          <button type="button" className="btn-primary mt-4" onClick={copy} disabled={!embedCode}>
            {copied ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      </div>
    </div>
  )
}
