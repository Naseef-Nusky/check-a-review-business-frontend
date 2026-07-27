import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MessageSquare, Star, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function DashboardPage() {
  const { business, refreshBusiness } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const profile = business || (await refreshBusiness())
        if (!profile?.id) return
        const result = await businessApi.getReviews(profile.id)
        if (active) setReviews(result.reviews || [])
      } catch (err) {
        if (active) setError(err.message || 'Failed to load dashboard')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  const stats = [
    { label: 'Average rating', value: Number(business?.average_rating || 0).toFixed(1), icon: Star },
    { label: 'Total reviews', value: String(business?.review_count || 0), icon: MessageSquare },
    { label: 'Trust score', value: `${Math.round(Number(business?.trust_score || 0))}%`, icon: TrendingUp },
    { label: 'Category', value: business?.category || '—', icon: Building2 },
  ]

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {business?.name ? `Overview for ${business.name}` : 'Overview of your reputation and review activity.'}
          </p>
        </div>
        <Link
          to="/profile"
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
        >
          Edit company details
        </Link>
      </div>

      {business && (
        <div className="card mb-6 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-ink">Company details</h3>
              <p className="mt-1 text-sm text-ink-muted">{business.name}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {[business.category, business.website, business.email, business.phone]
                  .filter(Boolean)
                  .join(' · ') || 'Add your website, email, and phone on the profile page.'}
              </p>
            </div>
            <Link to="/profile" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Edit →
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <p className="truncate text-3xl font-semibold tracking-tight text-ink tabular-nums">{loading ? '…' : value}</p>
            <p className="mt-1 text-sm text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold text-ink">Recent reviews</h3>
          {loading ? (
            <p className="mt-2 text-sm text-ink-muted">Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">No published reviews yet. Invite customers to leave feedback.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reviews.slice(0, 5).map((review) => (
                <li key={review.id} className="rounded-xl border border-border px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-ink">{review.author_name || 'Customer'}</p>
                    <p className="text-sm text-ink-muted">{review.rating}/5</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{review.title}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/reviews" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
            Manage reviews →
          </Link>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-ink">Quick actions</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link className="text-primary-600 hover:text-primary-700" to="/invitations">Invite customers to leave a review</Link>
            </li>
            <li>
              <Link className="text-primary-600 hover:text-primary-700" to="/reviews">Reply to customer feedback</Link>
            </li>
            <li>
              <Link className="text-primary-600 hover:text-primary-700" to="/widget">Embed your review widget</Link>
            </li>
            <li>
              <Link className="text-primary-600 hover:text-primary-700" to="/profile">Update company profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
