import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function AnalyticsPage() {
  const { business, refreshBusiness } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const profile = business || (await refreshBusiness())
        const analytics = await businessApi.getAnalytics(profile.id)
        if (active) setData(analytics)
      } catch (err) {
        if (active) setError(err.message || 'Failed to load analytics')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Analytics</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Track ratings and review trends for your business.
          {data?.entitlements?.flags?.advancedAnalytics
            ? ' Premium dashboards are included on your plan.'
            : ' Upgrade to Premium for richer dashboards, insights, and trends.'}
        </p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <p className="text-sm text-ink-muted">Loading analytics...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold text-ink">Rating breakdown</h3>
            <ul className="mt-4 space-y-2">
              {(data?.ratingBreakdown || []).length === 0 ? (
                <li className="text-sm text-ink-muted">No published ratings yet.</li>
              ) : (
                data.ratingBreakdown.map((row) => (
                  <li key={row.rating} className="flex items-center justify-between text-sm">
                    <span>{row.rating} star</span>
                    <span className="font-medium tabular-nums">{row.count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-ink">Monthly trend</h3>
            <ul className="mt-4 space-y-2">
              {(data?.monthlyTrend || []).length === 0 ? (
                <li className="text-sm text-ink-muted">Not enough data yet.</li>
              ) : (
                data.monthlyTrend.map((row) => (
                  <li key={`${row.month}-${row.count}`} className="flex items-center justify-between text-sm">
                    <span>{row.month}</span>
                    <span className="font-medium tabular-nums">{row.count} reviews</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          {data?.entitlements?.flags?.advancedAnalytics ? (
            <>
              <div className="card p-6">
                <h3 className="font-semibold text-ink">Invitation conversion this month</h3>
                <p className="mt-4 text-3xl font-semibold text-ink">
                  {data?.invitationStats?.invited_this_month || 0}
                  <span className="ml-2 text-base font-medium text-ink-muted">sent</span>
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {data?.invitationStats?.reviewed_this_month || 0} turned into reviews.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold text-ink">Richer insights</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Your Customer Success Manager can help you read rating mix, invitation timing, and TrustScore
                  trends. {data?.entitlements?.flags?.optimizedInvites
                    ? 'Your plan also includes tools for optimized invitations and actionable insight planning.'
                    : null}
                </p>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
