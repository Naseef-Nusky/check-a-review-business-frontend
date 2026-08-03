import { Link } from 'react-router-dom'
import {
  BarChart3,
  Bot,
  Check,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { PUBLIC_SITE_URL } from '../utils/constants'
import TrustStatsBand from '../components/marketing/TrustStatsBand'

const stats = [
  { label: 'Verified reviews', numeric: 50, suffix: 'K+', decimals: 0, detail: 'From real customers' },
  { label: 'Businesses listed', numeric: 10, suffix: 'K+', decimals: 0, detail: 'Growing every week' },
  { label: 'Average trust score', numeric: 4.7, suffix: '', decimals: 1, detail: 'Out of 5.0' },
]

const growthFeatures = [
  {
    icon: Truck,
    title: 'Collect reviews at scale',
    text: 'Send invitations, track responses, and grow your reputation with automated follow-ups.',
  },
  {
    icon: BarChart3,
    title: 'Turn feedback into insights',
    text: 'See rating trends, sentiment patterns, and what customers love most about your brand.',
  },
  {
    icon: Lightbulb,
    title: 'Stand out in search & AI',
    text: 'Strong review signals help your business appear more credible across search and AI answers.',
  },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Check A Review for Business</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build trust.
              <br />
              Get AI recommended.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Collect verified customer reviews, respond with confidence, and make your business more visible in the age of AI-powered search.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/setup"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View plans
              </Link>
              <Link
                to="/setup"
                className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Get started
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-100 via-white to-slate-100 p-8 shadow-elevated">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-300/40 blur-2xl" />
              <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl" />
              <div className="relative rounded-3xl bg-slate-950 p-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary-200">AI visibility</p>
                    <p className="text-lg font-semibold">Be visible in the age of AI</p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-3xl font-semibold tabular-nums">92%</p>
                    <p className="mt-1 text-sm text-slate-300">Trust score</p>
                  </div>
                  <div className="rounded-2xl bg-primary-500/20 p-4 ring-1 ring-primary-400/30">
                    <p className="text-3xl font-semibold tabular-nums">4.8</p>
                    <p className="mt-1 text-sm text-slate-300">Avg. rating</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate-300">
                  Customer feedback shapes how AI tools describe your brand. Strong reviews mean stronger recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStatsBand
        title="The world's most trusted feedback platform"
        stats={stats}
      />

      {/* AI bridge */}
      <section id="products" className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-200 via-slate-100 to-primary-100">
              <div className="flex h-full items-end p-8">
                <div className="rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur">
                  <p className="text-sm font-medium text-slate-500">Live review stream</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">&quot;Outstanding service from start to finish.&quot;</p>
                  <div className="mt-3 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              The bridge between customer feedback and AI search visibility
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                'Collect verified reviews that build real trust with buyers',
                'Respond publicly to show you care about customer experience',
                'Embed ratings on your site to boost conversions',
                'Use analytics to understand sentiment and improve faster',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            See what customers are saying about your business
          </h2>
          <form
            className="mt-8 flex overflow-hidden rounded-full border border-slate-300 bg-white shadow-sm"
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get('q')
              window.location.href = `${PUBLIC_SITE_URL}/search?q=${encodeURIComponent(String(q || ''))}`
            }}
          >
            <input
              name="q"
              type="search"
              placeholder="Search your company name..."
              className="flex-1 border-0 bg-transparent px-6 py-4 text-sm outline-none"
            />
            <button
              type="submit"
              className="m-1.5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Growth features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            The latest ways we&apos;re helping businesses turn feedback into growth
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {growthFeatures.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/setup" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Get the guide
            </Link>
          </div>
        </div>
      </section>

      {/* AI brand */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              What AI says about your brand depends on what customers say about you
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Reviews are becoming the foundation of how search engines and AI assistants evaluate trust. Check A Review helps you own that narrative.
            </p>
            <Link to="/setup" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              See how
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 p-8 text-white shadow-elevated">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <p className="text-2xl font-semibold">What AI says about you</p>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-primary-50">
              &quot;This business has consistently high ratings for service quality, responsiveness, and value — recommended by verified customers.&quot;
            </p>
            <div className="mt-8 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Powered by real review data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data solutions */}
      <section id="pricing" className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Rating trend</p>
                <div className="mt-3 h-16 rounded-lg bg-gradient-to-t from-primary-200 to-primary-500/30" />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Review volume</p>
                <div className="mt-3 flex h-16 items-end gap-1">
                  {[40, 65, 45, 80, 55, 90].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-primary-400" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="col-span-2 rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-xs text-slate-400">Trust score</p>
                <p className="mt-1 text-3xl font-semibold">92%</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Check A Review Data Solutions</h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Dashboards, exports, and reputation metrics that help your team measure impact and report results to leadership.
            </p>
            <Link to="/setup" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              See tools
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards grid */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-900">Review invitation tools</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Send branded invites and track who has left feedback.</p>
            <Link to="/setup" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
              Go to app
            </Link>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-900">Trusted reviews coalition</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">We champion transparent, verified feedback across the web.</p>
            <a href="#" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
              Read more
            </a>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-900">Find the right plan for your business</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Free, Starter, and Premium tiers for every stage of growth.</p>
            <Link to="/setup" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
              View plans & pricing
            </Link>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-white shadow-elevated">
            <h3 className="text-xl font-semibold">Marketing widgets</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary-50">Show your star rating and latest reviews on your website.</p>
            <Link to="/setup" className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-700">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Ready to unlock the full potential of reviews?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/setup" className="inline-flex rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-600">
              Get started
            </Link>
            <Link to="/setup" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Get a free demo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
