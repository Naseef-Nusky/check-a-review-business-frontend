import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flag, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

const REPORT_REASONS = [
  'Fake or misleading review',
  'Inappropriate or offensive content',
  'Spam or advertising',
  'Conflicts of interest (competitor or owner)',
  'Contains personal or private information',
  'Other',
]

function ReportModal({ reviewId, onClose }) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason) { setError('Please select a reason'); return }
    setSubmitting(true)
    setError('')
    try {
      await businessApi.reportReview(reviewId, { reason, details })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:px-4 sm:py-10" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Report this review</h2>
            <p className="mt-0.5 text-sm text-slate-500">Our moderation team will review your report.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        {submitted ? (
          <div className="rounded-xl bg-green-50 px-4 py-5 text-center">
            <p className="font-medium text-green-800">Report submitted</p>
            <p className="mt-1 text-sm text-green-700">Our team will review your report shortly.</p>
            <button type="button" onClick={onClose} className="mt-4 rounded-xl bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason <span className="text-red-500">*</span></label>
              <select className="input-field" value={reason} onChange={(e) => setReason(e.target.value)} required>
                <option value="">Select a reason…</option>
                {REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Additional details (optional)</label>
              <textarea className="input-field min-h-[80px] resize-y" placeholder="Describe the issue…" value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

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
  const [canReply, setCanReply] = useState(false)
  const [planName, setPlanName] = useState('Free')
  const [reportingId, setReportingId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = business || (await refreshBusiness())
      const [result, aiSummary, subscription] = await Promise.all([
        businessApi.getReviews(profile.id),
        businessApi.getReviewSummary(profile.id).catch(() => null),
        businessApi.getSubscription(profile.id).catch(() => null),
      ])
      setReviews(result.reviews || [])
      setSummary(aiSummary)
      setCanReply(Boolean(subscription?.entitlements?.flags?.canReplyToReviews))
      setPlanName(subscription?.entitlements?.name || subscription?.plan || 'Free')
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
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Customer reviews</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          Manage the feedback that shapes your reputation. Read what customers say, reply in public,
          and show future buyers that your business listens and improves.
        </p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!loading && !canReply ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Public replies are not available on your plan</p>
          <p className="mt-1 text-amber-800">
            Your {planName} plan lets you read reviews here. Upgrade to publish replies on your public profile.
          </p>
          <Link to="/subscription" className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
            View plans & upgrade
          </Link>
        </div>
      ) : null}

      {!loading && summary?.summary ? (
        <div className="card mb-6 border-primary-100 bg-gradient-to-br from-primary-50/70 via-white to-slate-50 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Reputation insights</p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sentimentLabel(summary.sentiment).className}`}>
              {sentimentLabel(summary.sentiment).text}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{summary.summary}</p>
          {(summary.cons?.length > 0) && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Areas to improve</p>
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
        <p className="text-sm text-ink-muted">Loading your customer feedback...</p>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm font-medium text-ink">No published reviews yet</p>
          <p className="mt-2 text-sm text-ink-muted">
            Invite customers to share their experience. New reviews will appear here so you can reply
            and build trust on your public profile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const hasReply = Boolean(review.business_reply)
            const isEditing = canReply && (editingId === review.id || !hasReply)

            return (
              <div key={review.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{review.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {review.author_name} · {review.rating}/5 · {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!hasReply ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      Awaiting your reply
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Replied
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.content}</p>

                {hasReply && !isEditing ? (
                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">Your public reply</p>
                        <p className="mt-1 whitespace-pre-wrap">{review.business_reply}</p>
                        {review.business_reply_at ? (
                          <p className="mt-2 text-xs text-slate-400">
                            Last updated {new Date(review.business_reply_at).toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>
                      {canReply ? (
                        <button
                          type="button"
                          className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          onClick={() => startEdit(review)}
                        >
                          Edit reply
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : canReply ? (
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-ink">
                      {hasReply ? 'Update your public reply' : 'Reply to this customer'}
                    </label>
                    <p className="text-xs text-ink-muted">
                      Your response appears on your public profile and helps shoppers see how you handle feedback.
                    </p>
                    <textarea
                      className="input-field min-h-[90px]"
                      placeholder={
                        hasReply
                          ? 'Refine your reply so it sounds clear, helpful, and on-brand...'
                          : 'Thank the customer, address their points, and show how you will help...'
                      }
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
                            : 'Publishing...'
                          : hasReply
                            ? 'Save reply'
                            : 'Publish reply'}
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
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Upgrade your plan to publish a public reply on this review.
                  </div>
                )}

                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setReportingId(review.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Flag className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Report this review
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {reportingId && (
        <ReportModal reviewId={reportingId} onClose={() => setReportingId(null)} />
      )}
    </div>
  )
}
