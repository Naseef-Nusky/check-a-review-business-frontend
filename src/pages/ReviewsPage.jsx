import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function ReviewsPage() {
  const { business, refreshBusiness } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyDrafts, setReplyDrafts] = useState({})
  const [savingId, setSavingId] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = business || (await refreshBusiness())
      const result = await businessApi.getReviews(profile.id)
      setReviews(result.reviews || [])
    } catch (err) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendReply = async (reviewId) => {
    const reply = String(replyDrafts[reviewId] || '').trim()
    if (!reply) return
    setSavingId(reviewId)
    setError('')
    try {
      await businessApi.replyToReview(reviewId, reply)
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }))
      await load()
    } catch (err) {
      setError(err.message || 'Failed to send reply')
    } finally {
      setSavingId('')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Reviews</h2>
        <p className="mt-1 text-sm text-ink-muted">Read and reply to published customer reviews.</p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center text-sm text-ink-muted">No published reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{review.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {review.author_name} · {review.rating}/5 · {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.content}</p>

              {review.business_reply ? (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <p className="font-medium text-ink">Your reply</p>
                  <p className="mt-1">{review.business_reply}</p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <textarea
                    className="input-field min-h-[90px]"
                    placeholder="Write a public reply..."
                    value={replyDrafts[review.id] || ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={savingId === review.id}
                    onClick={() => sendReply(review.id)}
                  >
                    {savingId === review.id ? 'Sending...' : 'Reply'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
