import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { businessApi } from '../services/api'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const rows = await businessApi.getNotifications()
      setNotifications(rows || [])
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const markOne = async (id) => {
    try {
      await businessApi.markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read')
    }
  }

  const markAll = async () => {
    setMarking(true)
    setError('')
    try {
      await businessApi.markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      setError(err.message || 'Failed to mark all as read')
    } finally {
      setMarking(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Notifications</h2>
          <p className="mt-1 text-sm text-ink-muted">
            New reviews and review updates for your business appear here.
          </p>
        </div>
        <button
          type="button"
          onClick={markAll}
          disabled={marking || unreadCount === 0}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {marking ? 'Updating...' : 'Mark all as read'}
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          <Bell className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
          <p className="mt-3 text-sm font-medium text-ink">No notifications yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            When customers leave or edit a review, you will see it here.
          </p>
          <Link to="/reviews" className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
            Go to reviews →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`card p-5 ${item.read ? 'opacity-80' : 'border-primary-200 bg-primary-50/30'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    {!item.read ? (
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!item.read ? (
                    <button
                      type="button"
                      onClick={() => markOne(item.id)}
                      className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Mark read
                    </button>
                  ) : null}
                  <Link
                    to="/reviews"
                    className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                  >
                    View reviews
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
