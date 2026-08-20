import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function Cta({ to, children, variant = 'dark' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition'
  const styles =
    variant === 'dark'
      ? 'bg-slate-900 text-white hover:bg-slate-800'
      : variant === 'primary'
        ? 'bg-primary-500 text-white hover:bg-primary-600'
        : 'border border-border bg-white text-slate-700 hover:bg-slate-50'

  return (
    <Link to={to} className={`${base} ${styles}`}>
      {children}
    </Link>
  )
}

export function PageHero({ kicker, title, description, primary, secondary, visual }) {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {primary ? (
              <Cta to={primary.to} variant="dark">
                {primary.label}
              </Cta>
            ) : null}
            {secondary ? (
              <Cta to={secondary.to} variant="primary">
                {secondary.label}
              </Cta>
            ) : null}
          </div>
        </div>
        <div className="lg:justify-self-end">{visual}</div>
      </div>
    </section>
  )
}

export function StatBand({ stats }) {
  return (
    <section className="border-y border-border bg-slate-50 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {stats.map(({ icon: Icon, value, text, source }) => (
          <div key={text} className="flex gap-4">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm ring-1 ring-slate-200">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base leading-relaxed text-slate-900">
                <span className="font-semibold text-primary-600">{value}</span> {text}
              </p>
              <p className="mt-1.5 text-xs text-slate-500">{source}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FeatureRow({ kicker, title, description, bullets = [], visual, reverse = false, tone = 'white' }) {
  return (
    <section className={tone === 'muted' ? 'bg-slate-50 py-20' : 'bg-white py-20'}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className={reverse ? 'lg:order-2' : ''}>
          {kicker ? <p className="section-kicker">{kicker}</p> : null}
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">{description}</p>
          {bullets.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={reverse ? 'lg:order-1' : ''}>{visual}</div>
      </div>
    </section>
  )
}

export function CapabilityGrid({ title, description, items }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
          {description ? <p className="mt-4 text-base leading-relaxed text-slate-600">{description}</p> : null}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title: itemTitle, text }) => (
            <div key={itemTitle} className="rounded-3xl border border-border bg-white p-6 shadow-soft">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{itemTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StepList({ title, description, steps }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
          {description ? <p className="mt-4 text-base leading-relaxed text-slate-600">{description}</p> : null}
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl bg-white p-6 shadow-soft">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function CustomerStory({ company, summary, body, metric, image, imageAlt }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`overflow-hidden rounded-3xl bg-slate-900 text-white ${
            image ? 'grid gap-0 lg:grid-cols-2 lg:items-stretch' : ''
          }`}
        >
          {image ? (
            <div className="relative min-h-[14rem] overflow-hidden lg:min-h-full">
              <img
                src={image}
                alt={imageAlt || company || 'Customer story'}
                className="absolute inset-0 h-full w-full object-cover object-center"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
            </div>
          ) : null}
          <div className={`p-8 sm:p-12 ${image ? '' : 'grid gap-10 lg:grid-cols-3 lg:items-center'}`}>
            <div className={image ? '' : 'lg:col-span-2'}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Customer story</p>
              <p className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">{summary}</p>
              <p className="mt-5 text-sm leading-relaxed text-slate-300">{body}</p>
              <p className="mt-6 text-sm font-medium text-slate-400">{company}</p>
            </div>
            <div className={`rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 ${image ? 'mt-8' : ''}`}>
              <p className="text-4xl font-semibold text-primary-400">{metric.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{metric.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CrossLinks({ title, links }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group rounded-3xl border border-border bg-white p-8 shadow-soft transition hover:border-primary-200"
            >
              <h3 className="text-lg font-semibold text-slate-900">{link.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{link.text}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                {link.action}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ClosingCta({ title, description, primary, secondary }) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        {description ? <p className="mt-4 text-base leading-relaxed text-slate-600">{description}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Cta to={primary.to} variant="primary">
            {primary.label}
          </Cta>
          {secondary ? (
            <Cta to={secondary.to} variant="ghost">
              {secondary.label}
            </Cta>
          ) : null}
        </div>
      </div>
    </section>
  )
}
