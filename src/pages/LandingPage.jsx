import { Link } from 'react-router-dom'
import {
  BarChart3,
  Check,
  Lightbulb,
  Search,
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
    image: '/Collect-reviews.png',
    imageAlt: 'Business owner collecting customer reviews on a laptop',
  },
  {
    icon: BarChart3,
    title: 'Turn feedback into insights',
    text: 'See rating trends, sentiment patterns, and what customers love most about your brand.',
    image: '/Insights-analytics.png',
    imageAlt: 'Team reviewing analytics and customer feedback insights',
  },
  {
    icon: Lightbulb,
    title: 'Stand out in search & AI',
    text: 'Strong review signals help your business appear more credible across search and AI answers.',
    image: '/Search-AI-visibility.png',
    imageAlt: 'Business owner improving search and AI visibility with reviews',
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
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
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
            <div className="relative overflow-hidden rounded-[2rem] shadow-elevated ring-1 ring-slate-200/80">
              <img
                src="/home-hero.png"
                alt="Business owner reviewing customer insights on a laptop"
                className="aspect-[4/3] w-full object-cover object-center"
                width={1600}
                height={1200}
                decoding="async"
                fetchPriority="high"
              />
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
            <div className="overflow-hidden rounded-3xl shadow-elevated ring-1 ring-slate-200/80">
              <img
                src="/Live-review-stream.png"
                alt="Business owner checking live customer reviews on laptop and phone"
                className="aspect-[4/3] w-full object-cover object-center"
                width={1600}
                height={1200}
                loading="lazy"
                decoding="async"
              />
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
            {growthFeatures.map(({ icon: Icon, title, text, image, imageAlt }) => (
              <div key={title} className="text-center">
                {image ? (
                  <div className="mx-auto overflow-hidden rounded-3xl shadow-soft ring-1 ring-slate-200/80">
                    <img
                      src={image}
                      alt={imageAlt || title}
                      className="aspect-[4/3] w-full object-cover object-center"
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                )}
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
          <div className="overflow-hidden rounded-3xl shadow-elevated ring-1 ring-slate-200/80">
            <img
              src="/What-AI-says-about-your-brand.png"
              alt="How AI describes a brand based on customer reviews"
              className="aspect-[4/3] w-full object-cover object-center"
              width={1600}
              height={1200}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Data solutions */}
      <section id="pricing" className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="overflow-hidden rounded-3xl shadow-elevated ring-1 ring-slate-200/80">
            <img
              src="/Data-Solutions-analytics.png"
              alt="Check A Review data solutions analytics dashboard"
              className="aspect-[4/3] w-full object-cover object-center"
              width={1600}
              height={1200}
              loading="lazy"
              decoding="async"
            />
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
          {[
            {
              title: 'Review invitation tools',
              text: 'Send branded invites and track who has left feedback.',
              cta: { to: '/setup', label: 'Go to app' },
              image: '/Review-invitations.png',
              imageAlt: 'Sending branded review invitations from a laptop',
            },
            {
              title: 'Trusted reviews coalition',
              text: 'We champion transparent, verified feedback across the web.',
              cta: { href: '#', label: 'Read more' },
              image: '/about-trust.png',
              imageAlt: 'Building trust through verified customer reviews',
            },
            {
              title: 'Find the right plan for your business',
              text: 'Starter, Plus, Premium, and Enterprise for every stage of growth.',
              cta: { to: '/setup', label: 'View plans & pricing' },
              image: '/about-vision.png',
              imageAlt: 'Choosing the right Check A Review plan for your business',
            },
            {
              title: 'Marketing widgets',
              text: 'Show your star rating and latest reviews on your website.',
              cta: { to: '/setup', label: 'Learn more' },
              image: '/Marketing-widgets.png',
              imageAlt: 'Website marketing widget showing star ratings and reviews',
              accent: true,
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`overflow-hidden rounded-3xl shadow-soft ${
                card.accent ? 'bg-white ring-1 ring-primary-200' : 'bg-white'
              }`}
            >
              <div className="overflow-hidden">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="aspect-[16/10] w-full object-cover object-center"
                  width={1200}
                  height={750}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.text}</p>
                {card.cta.to ? (
                  <Link
                    to={card.cta.to}
                    className={`mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold ${
                      card.accent
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {card.cta.label}
                  </Link>
                ) : (
                  <a
                    href={card.cta.href}
                    className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {card.cta.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img
            src="/Final-CTA-mood.png"
            alt=""
            className="h-full w-full object-cover object-center"
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to unlock the full potential of reviews?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/setup" className="inline-flex rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-600">
              Get started
            </Link>
            <Link to="/setup" className="text-sm font-semibold text-white/90 hover:text-white">
              Get a free demo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
