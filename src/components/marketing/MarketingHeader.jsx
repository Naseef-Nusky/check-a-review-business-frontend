import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { APP_NAME, PUBLIC_SITE_URL } from '../../utils/constants'

const navLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
  { label: 'Integrations', href: '#integrations' },
]

export default function MarketingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-8 w-auto object-contain" />
          <span className="hidden text-sm font-semibold text-white sm:inline">for Business</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={PUBLIC_SITE_URL} className="text-sm font-medium text-slate-300 transition hover:text-white">
            Consumer site
          </a>
          <Link to="/login" className="text-sm font-medium text-white transition hover:text-primary-300">
            Log in
          </Link>
          <Link
            to="/setup"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contact sales
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link to="/setup" className="mt-2 rounded-full bg-primary-500 px-4 py-2.5 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
