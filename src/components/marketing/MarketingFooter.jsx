import { Link } from 'react-router-dom'
import { APP_NAME, PUBLIC_SITE_URL } from '../../utils/constants'

const columns = [
  {
    title: 'About us',
    links: ['Our story', 'Press', 'Careers', 'Contact'],
  },
  {
    title: 'Product',
    links: ['Review management', 'Invitations', 'Analytics', 'Widgets'],
  },
  {
    title: 'Business',
    links: ['Pricing', 'Enterprise', 'Partners', 'Developers'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Guides', 'Case studies', 'Help center'],
  },
  {
    title: 'Support',
    links: ['Contact sales', 'Status', 'Legal', 'Privacy'],
  },
]

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
                  <li key={link}>
                    <a href="#" className="text-sm transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-7 w-auto object-contain opacity-90" />
            <span className="text-sm">© {new Date().getFullYear()} {APP_NAME}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href={PUBLIC_SITE_URL} className="hover:text-white">Consumer site</a>
            <Link to="/login" className="hover:text-white">Business login</Link>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
