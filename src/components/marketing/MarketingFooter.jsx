import { Link } from 'react-router-dom'
import { APP_NAME, PUBLIC_SITE_URL, CONTACT_EMAIL } from '../../utils/constants'

const columns = [
  {
    title: 'About us',
    links: [
      { label: 'How it works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Respond to reviews', href: '/features/respond-to-reviews' },
      { label: 'Profile page', href: '/features/profile-page' },
      { label: 'Invitations', href: '/how-it-works' },
      { label: 'Widgets', href: '/solutions/accelerate-conversions' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Engage with feedback', href: '/solutions/engage-with-feedback' },
      { label: 'Accelerate conversions', href: '/solutions/accelerate-conversions' },
      { label: 'Improve with insights', href: '/solutions/improve-with-insights' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Help for businesses', href: `${PUBLIC_SITE_URL}/help/businesses` },
      { label: 'Trust Centre', href: `${PUBLIC_SITE_URL}/trust-centre` },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: 'Contact sales', href: '/setup' },
      { label: 'Privacy', href: `${PUBLIC_SITE_URL}/privacy` },
      { label: 'Business terms', href: `${PUBLIC_SITE_URL}/terms/business` },
      { label: 'Reviewer terms', href: `${PUBLIC_SITE_URL}/terms` },
    ],
  },
]

function FooterLink({ href, children, className }) {
  if (href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  if (href.includes('#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

export default function MarketingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} className="text-sm transition hover:text-white">
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-7 w-auto object-contain opacity-90" />
            </Link>
            <span className="text-sm">© {new Date().getFullYear()} {APP_NAME}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a>
            <a href={PUBLIC_SITE_URL} className="hover:text-white">Consumer site</a>
            <Link to="/login" className="hover:text-white">Business login</Link>
            <Link to="/pricing" className="hover:text-white">Pricing</Link>
            <a href={`${PUBLIC_SITE_URL}/privacy`} className="hover:text-white">Privacy</a>
            <a href={`${PUBLIC_SITE_URL}/terms/business`} className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
