import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

function sentimentLabel(sentiment) {
  switch (sentiment) {
    case 'positive':
      return { text: 'Mostly positive', className: 'bg-emerald-50 text-emerald-700' }
    case 'negative':
      return { text: 'Mostly negative', className: 'bg-red-50 text-red-700' }
    case 'mixed':
      return { text: 'Mixed', className: 'bg-amber-50 text-amber-800' }
    default:
      return { text: 'Neutral', className: 'bg-slate-100 text-slate-700' }
  }
}

export default function ReviewsPage() {
  const { business, refreshBusiness } = useAuth()
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyDrafts, setReplyDrafts] = useState({})
  const [editingId, setEditingId] = useState('')
  const [savingId, setSavingId] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = business || (await refreshBusiness())
      const [result, aiSummary] = await Promise.all([
        businessApi.getReviews(profile.id),
        businessApi.getReviewSummary(profile.id).catch(() => null),
      ])
      setReviews(result.reviews || [])
      setSummary(aiSummary)
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

  const startEdit = (review) => {
    setEditingId(review.id)
    setReplyDrafts((prev) => ({
      ...prev,
      [review.id]: review.business_reply || '',
    }))
  }

  const cancelEdit = (reviewId) => {
    setEditingId('')
    setReplyDrafts((prev) => {
      const next = { ...prev }
      delete next[reviewId]
      return next
    })
  }

  const saveReply = async (reviewId, isEdit) => {
    const reply = String(replyDrafts[reviewId] || '').trim()
    if (!reply) return
    setSavingId(reviewId)
    setError('')
    try {
      await businessApi.replyToReview(reviewId, reply)
      setEditingId('')
      setReplyDrafts((prev) => {
        const next = { ...prev }
        delete next[reviewId]
        return next
      })
      await load()
    } catch (err) {
      setError(err.message || (isEdit ? 'Failed to update reply' : 'Failed to send reply'))
    } finally {
      setSavingId('')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Reviews</h2>
        <p className="mt-1 text-sm text-ink-muted">Read, reply to, and edit replies on published customer reviews.</p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!loading && summary?.summary ? (
        <div className="card mb-6 border-primary-100 bg-gradient-to-br from-primary-50/70 via-white to-slate-50 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">AI review summary</p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sentimentLabel(summary.sentiment).className}`}>
              {sentimentLabel(summary.sentiment).text}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{summary.summary}</p>
          {(summary.cons?.length > 0) && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Cons</p>
              <ul className="mt-1.5 space-y-1 text-sm text-ink">
                {summary.cons.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center text-sm text-ink-muted">No published reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const hasReply = Boolean(review.business_reply)
            const isEditing = editingId === review.id || !hasReply

            return (
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

                {hasReply && !isEditing ? (
                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">Your reply</p>
                        <p className="mt-1 whitespace-pre-wrap">{review.business_reply}</p>
                        {review.business_reply_at ? (
                          <p className="mt-2 text-xs text-slate-400">
                            Updated {new Date(review.business_reply_at).toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => startEdit(review)}
                      >
                        Edit reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-ink">
                      {hasReply ? 'Edit your reply' : 'Write a public reply'}
                    </label>
                    <textarea
                      className="input-field min-h-[90px]"
                      placeholder="Write a public reply..."
                      value={replyDrafts[review.id] ?? (hasReply ? review.business_reply : '')}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={savingId === review.id}
                        onClick={() => saveReply(review.id, hasReply)}
                      >
                        {savingId === review.id
                          ? hasReply
                            ? 'Saving...'
                            : 'Sending...'
                          : hasReply
                            ? 'Save changes'
                            : 'Reply'}
                      </button>
                      {hasReply ? (
                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          disabled={savingId === review.id}
                          onClick={() => cancelEdit(review.id)}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
