import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi, ApiError } from '../services/api'

function formatCurrencyAmount(cents, currency) {
  const code = String(currency || 'GBP').toUpperCase()
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format((Number(cents) || 0) / 100)
  } catch {
    return `${code} ${((Number(cents) || 0) / 100).toFixed(2)}`
  }
}

function ActionButton({ children, disabled, onClick, secondary = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        secondary
          ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          : 'bg-primary-500 text-white hover:bg-primary-600'
      }`}
    >
      {children}
    </button>
  )
}

export default function SubscriptionPage() {
  const { business } = useAuth()
  const [searchParams] = useSearchParams()
  const [subscription, setSubscription] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [workingPlan, setWorkingPlan] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const currentPlan = subscription?.plan || 'free'

  const load = async () => {
    if (!business?.id) return
    setLoading(true)
    setError('')
    try {
      const [sub, history] = await Promise.all([
        businessApi.getSubscription(business.id),
        businessApi.getPayments(business.id).catch(() => []),
      ])
      setSubscription(sub)
      setPayments(history || [])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load subscription')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [business?.id])

  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'success') {
      setMessage('Payment received via Square. Your plan will update after confirmation.')
      load()
    }
  }, [searchParams])

  const squareReady = useMemo(() => Boolean(subscription?.squareConfigured), [subscription])
  const catalog = subscription?.catalog || []
  const entitlements = subscription?.entitlements
  const primaryCurrency = catalog.find((plan) => plan.currency)?.currency || 'GBP'

  const upgrade = async (plan) => {
    if (!business?.id) return
    setWorkingPlan(plan)
    setError('')
    setMessage('')
    try {
      const result = await businessApi.createCheckout(business.id, plan)
      if (result?.url) {
        if (result.sandboxMode) {
          setMessage(
            'Opening Square sandbox testing panel. Click “Test payment” there — do not use “Preview link”, because the preview page cannot charge cards.',
          )
        }
        window.location.href = result.url
        return
      }
      throw new Error('Square checkout URL missing')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to start Square checkout')
    } finally {
      setWorkingPlan('')
    }
  }

  const cancel = async () => {
    if (!business?.id) return
    if (!window.confirm('Cancel your paid Square subscription and return to the Free plan?')) return
    setWorkingPlan('cancel')
    setError('')
    try {
      const updated = await businessApi.cancelSubscription(business.id)
      setSubscription((prev) => ({ ...prev, ...updated }))
      setMessage('Subscription cancelled. You are now on the Free plan.')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to cancel subscription')
    } finally {
      setWorkingPlan('')
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading subscription...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-start gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <CreditCard className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Subscription</h1>
          <p className="mt-1 text-sm text-slate-500">
            Paid plans are priced and billed monthly in {primaryCurrency}. Plus and Premium are billed per
            domain.
          </p>
        </div>
      </div>

      {subscription?.status === 'past_due' ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your monthly renewal payment failed. Retry payment below to keep {currentPlan} active.
        </div>
      ) : null}
      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {!squareReady ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Square billing is not fully configured on the API yet. Add Square keys to the backend `.env`, then sync plans from Billing plans.
        </div>
      ) : null}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Current plan</p>
        <p className="mt-1 text-xl font-semibold capitalize text-slate-900">{currentPlan}</p>
        <p className="mt-1 text-sm capitalize text-slate-500">Status: {subscription?.status || 'active'}</p>
        {subscription?.current_period_end && currentPlan !== 'free' ? (
          <p className="mt-1 text-sm text-slate-600">
            {subscription.status === 'past_due'
              ? 'Monthly renewal payment failed. Retry checkout to keep this plan.'
              : `Auto-renews monthly on ${new Date(subscription.current_period_end).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}.`}
          </p>
        ) : currentPlan !== 'free' ? (
          <p className="mt-1 text-sm text-slate-600">This plan renews automatically every month through Square.</p>
        ) : null}
        {entitlements ? (
          <p className="mt-2 text-sm text-slate-600">
            {entitlements.usage.invitationsThisMonth}/{entitlements.limits.invitationsPerMonthLabel} invitations this
            month · {entitlements.usage.users}/{entitlements.limits.usersLabel} users · {entitlements.usage.domains}/
            {entitlements.limits.domainsLabel} domains · {entitlements.limits.widgetsLabel} widgets
          </p>
        ) : null}
        {currentPlan !== 'free' ? (
          <button
            type="button"
            className="mt-4 text-sm font-medium text-slate-600 underline"
            onClick={cancel}
            disabled={workingPlan === 'cancel'}
          >
            {workingPlan === 'cancel' ? 'Cancelling...' : 'Switch to Free'}
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {catalog.map((plan) => {
          const isCurrent = currentPlan === plan.key
          const pastDue = subscription?.status === 'past_due'
          const checkoutable = ['buy', 'trial', 'demo'].includes(plan.checkout)
          const canRetry = pastDue && isCurrent
          return (
            <div
              key={plan.key}
              className={`flex flex-col rounded-2xl border p-5 ${
                isCurrent ? 'border-primary-500 bg-primary-50/40 ring-1 ring-primary-500' : 'border-slate-200 bg-white'
              }`}
            >
              {isCurrent ? (
                <span className="w-fit rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-medium text-white">
                  Current
                </span>
              ) : plan.tagline ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{plan.tagline}</p>
              ) : null}
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {plan.priceLabel}
                {plan.monthlyAmountCents ? (
                  <span className="text-sm font-medium text-slate-500"> {plan.periodLabel}</span>
                ) : null}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {(plan.features || []).map((feature) => (
                  <li key={feature} className="text-sm text-slate-600">
                    {feature}
                  </li>
                ))}
              </ul>
              {(plan.notes || []).map((note) => (
                <p key={note} className="mt-3 text-xs text-slate-400">
                  {note}
                </p>
              ))}
              {plan.checkout === 'sales' ? (
                <ActionButton disabled>
                  {plan.ctaLabel || 'Coming soon'}
                </ActionButton>
              ) : (
                <>
                  <ActionButton
                    disabled={(!canRetry && isCurrent) || Boolean(workingPlan) || !squareReady || !checkoutable}
                    onClick={() => upgrade(plan.key)}
                  >
                    {workingPlan === plan.key
                      ? 'Redirecting to Square...'
                      : canRetry
                        ? 'Retry monthly payment'
                        : isCurrent
                          ? 'Current plan'
                          : plan.checkout === 'trial'
                            ? 'Try free for 14 days'
                            : plan.ctaLabel || 'Buy now'}
                  </ActionButton>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Payment history</h2>
        {payments.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Square payments will appear here after checkout.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-2 py-2 font-medium">Date</th>
                  <th className="px-2 py-2 font-medium">Plan</th>
                  <th className="px-2 py-2 font-medium">Amount</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Square ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100">
                    <td className="px-2 py-2 text-slate-700">
                      {payment.created_at ? new Date(payment.created_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-2 py-2 capitalize text-slate-700">{payment.plan || '—'}</td>
                    <td className="px-2 py-2 text-slate-700">
                      {typeof payment.amount === 'number'
                        ? formatCurrencyAmount(payment.amount, payment.currency || primaryCurrency)
                        : '—'}
                    </td>
                    <td className="px-2 py-2 capitalize text-slate-700">{payment.status || '—'}</td>
                    <td className="px-2 py-2 font-mono text-xs text-slate-500">
                      {payment.square_payment_id || payment.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
