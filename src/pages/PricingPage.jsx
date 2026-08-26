import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { businessApi } from '../services/api'

function formatCellValue(value) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Check className="h-4 w-4" strokeWidth={2.75} />
      </span>
    ) : (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }

  const text = String(value ?? '').trim()
  if (!text) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }

  const normalized = text.toLowerCase()
  if (['true', 'yes', 'included', '✓', 'check', 'checked'].includes(normalized)) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Check className="h-4 w-4" strokeWidth={2.75} />
      </span>
    )
  }
  if (['false', 'no', 'not included', '—', '-', 'x'].includes(normalized)) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }

  // Keep numeric/limit values like 1, 3, Unlimited as text (Users / Domains)
  return <span className="text-sm font-medium text-slate-700">{text}</span>
}

export default function PricingPage() {
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError('')
    businessApi
      .getPricingContent()
      .then((data) => setPricing(data))
      .catch((err) => setError(err.message || 'Failed to load pricing page'))
      .finally(() => setLoading(false))
  }, [])

  const planKeys = useMemo(() => pricing?.plans?.map((plan) => plan.key) || [], [pricing])
  const planCount = Math.max(planKeys.length, 1)
  const comparisonGridStyle = {
    gridTemplateColumns: `minmax(180px, 1.5fr) repeat(${planCount}, minmax(120px, 1fr))`,
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
          <p className="mt-4 text-sm text-slate-500">Loading pricing...</p>
        </div>
      </div>
    )
  }

  if (error || !pricing) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-700">{error || 'Pricing page is unavailable right now.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Pricing</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {pricing.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {pricing.heroSubtitle}
            </p>
            <p className="mt-4 text-sm font-medium text-primary-600">{pricing.trustBadge}</p>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {pricing.plans.map((plan) => (
              <article
                key={plan.key}
                className={`rounded-3xl border p-6 shadow-sm ${
                  plan.highlighted
                    ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-100/60'
                    : 'border-border bg-white'
                }`}
              >
                <div className="flex min-h-8 items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>
                  {plan.badge ? (
                    <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  {plan.price}
                  {plan.period ? (
                    <span className="ml-1 text-base font-medium text-slate-500">{plan.period}</span>
                  ) : null}
                </p>
                {(plan.users || plan.domains) ? (
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {[
                      plan.users ? `${plan.users} user${String(plan.users) === '1' ? '' : 's'}` : null,
                      plan.domains ? `${plan.domains} domain${String(plan.domains) === '1' ? '' : 's'}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                ) : null}
                <p className="mt-4 min-h-16 text-sm leading-relaxed text-slate-600">{plan.description}</p>
                <Link
                  to={
                    String(plan.ctaLabel || '')
                      .toLowerCase()
                      .includes('demo') || String(plan.price || '').toLowerCase().includes('contact')
                      ? '/setup'
                      : '/setup'
                  }
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.ctaLabel || 'Get started'}
                </Link>
                {(plan.notes || []).length ? (
                  <div className="mt-4 space-y-1">
                    {plan.notes.map((note) => (
                      <p key={note} className="text-xs leading-relaxed text-slate-400">
                        {note}
                      </p>
                    ))}
                  </div>
                ) : null}
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {(plan.features || []).map((feature, featureIndex) => {
                    const label = typeof feature === 'string' ? feature : feature?.label || ''
                    const included =
                      typeof feature === 'string' ? true : feature?.included !== false
                    if (!label) return null
                    return (
                      <li
                        key={`${plan.key}-feature-${featureIndex}`}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            included
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {included ? (
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          ) : (
                            <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                          )}
                        </span>
                        <span className={included ? '' : 'text-slate-400'}>{label}</span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">{pricing.billingNote}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            How our pricing works
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricing.steps.map((step, index) => (
              <div key={`${step.title}-${index}`} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-sm font-semibold text-primary-700">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Compare plans</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Choose the plan that matches your business
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-border bg-white shadow-soft">
            <div className="grid border-b border-border bg-slate-900 text-white" style={comparisonGridStyle}>
              <div className="px-5 py-4 text-sm font-semibold">Features</div>
              {pricing.plans.map((plan) => (
                <div key={`head-${plan.key}`} className="px-5 py-4 text-center text-sm font-semibold">
                  {plan.name}
                </div>
              ))}
            </div>

            {pricing.comparisonSections.map((section) => (
              <div key={section.title} className="border-b border-border last:border-b-0">
                <div className="bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {section.title}
                </div>
                {section.rows.map((row) => (
                  <div
                    key={`${section.title}-${row.label}`}
                    className="grid border-t border-border first:border-t-0"
                    style={comparisonGridStyle}
                  >
                    <div className="px-5 py-4 text-sm font-medium text-slate-700">{row.label}</div>
                    {planKeys.map((planKey) => (
                      <div key={`${row.label}-${planKey}`} className="flex items-center justify-center px-5 py-4 text-center">
                        {formatCellValue(row.values?.[planKey])}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-4">
            {pricing.faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={faq.question} className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-border px-6 py-5 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to grow with more trusted reviews?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Start with a free account, then upgrade when you are ready for more invitations, more insights, and more conversion tools.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/setup" className="inline-flex rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-600">
              Create free account
            </Link>
            <Link to="/login" className="inline-flex rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
              Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
