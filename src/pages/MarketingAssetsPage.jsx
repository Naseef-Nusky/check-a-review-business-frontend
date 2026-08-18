import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Image } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

function downloadSvg(filename, svg) {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function MarketingAssetsPage() {
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
        if (active) setError(err.message || 'Failed to load assets')
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  const allowed = Boolean(entitlements?.flags?.marketingAssets)
  const name = business?.name || 'Your business'
  const score = Math.round(Number(business?.trust_score) || 0)

  const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="220">
  <rect width="640" height="220" rx="24" fill="#0F172A"/>
  <text x="40" y="70" fill="#FFFFFF" font-size="28" font-family="Arial">${name.replace(/[<>]/g, '')}</text>
  <text x="40" y="120" fill="#FF4081" font-size="48" font-family="Arial" font-weight="700">${score}%</text>
  <text x="40" y="165" fill="#94A3B8" font-size="18" font-family="Arial">TrustScore · Check A Review</text>
</svg>`

  const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160">
  <rect width="480" height="160" rx="20" fill="#FFFFFF" stroke="#E2E8F0"/>
  <text x="28" y="55" fill="#0F172A" font-size="22" font-family="Arial">Rated on Check A Review</text>
  <text x="28" y="105" fill="#FF4081" font-size="36" font-family="Arial">${Number(business?.average_rating || 0).toFixed(1)} ★</text>
</svg>`

  return (
    <div>
      <div className="mb-8 flex items-start gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Image className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Marketing assets</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Download TrustScore artwork to power ads, email, and landing pages.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!allowed ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Marketing assets start on Starter.{' '}
          <Link to="/subscription" className="font-semibold text-primary-600 hover:underline">
            Upgrade your plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-semibold text-ink">TrustScore badge</h3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border" dangerouslySetInnerHTML={{ __html: badgeSvg }} />
            <button type="button" className="btn-primary mt-4" onClick={() => downloadSvg('trustscore-badge.svg', badgeSvg)}>
              Download SVG
            </button>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">Star rating ad unit</h3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border" dangerouslySetInnerHTML={{ __html: starSvg }} />
            <button type="button" className="btn-primary mt-4" onClick={() => downloadSvg('star-rating-ad.svg', starSvg)}>
              Download SVG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
