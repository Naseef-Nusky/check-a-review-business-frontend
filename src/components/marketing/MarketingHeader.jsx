import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { APP_NAME, PUBLIC_SITE_URL } from '../../utils/constants'

const menuGroups = [
  {
    label: 'Solutions',
    sections: [
      {
        title: 'By business goal',
        items: [
          { label: 'Engage with feedback', href: '/#products' },
          { label: 'Accelerate conversions', href: '/pricing' },
          { label: 'Improve with insights', href: '/#integrations' },
          { label: 'Drive revenue growth', href: '/#resources' },
          { label: 'Industry: Insurance', href: '/pricing' },
          { label: 'Industry: Retail', href: '/pricing' },
        ],
      },
      {
        title: 'By business size',
        items: [
          { label: 'Small and scaling businesses', href: '/pricing' },
          { label: 'Enterprises', href: '/pricing' },
        ],
      },
    ],
  },
  {
    label: 'Features',
    sections: [
      {
        title: 'Invite reviews',
        items: [
          { label: 'Service reviews', href: '/#products' },
          { label: 'Product reviews', href: '/#products' },
          { label: 'Location reviews', href: '/#products' },
          { label: 'Review invitations', href: '/#products' },
        ],
      },
      {
        title: 'Engage with feedback',
        items: [
          { label: 'Profile page', href: '/#products' },
          { label: 'Respond to reviews', href: '/#products' },
        ],
      },
      {
        title: 'Accelerate conversions',
        items: [
          { label: 'Review SEO & AI Discovery', href: '/#integrations' },
          { label: 'Check A Review widgets', href: '/#integrations' },
          { label: 'Social media tools', href: '/#integrations' },
          { label: 'Marketing assets', href: '/#integrations' },
        ],
      },
      {
        title: 'Improve with insights',
        items: [
          { label: 'Review spotlight', href: '/#resources' },
          { label: 'Market insights', href: '/#resources' },
          { label: 'Review insights', href: '/#resources' },
          { label: 'Data and analytics', href: '/#resources' },
          { label: 'Review tagging', href: '/#resources' },
          { label: 'Visitor insights', href: '/#resources' },
        ],
      },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Resources',
    sections: [
      {
        items: [
          { label: 'Blog', href: '#resources' },
          { label: 'Customer stories', href: '/#resources' },
          { label: 'Guides and reports', href: '/#resources' },
          { label: 'Webinars and videos', href: '/#resources' },
          { label: 'Help Center', href: '/#resources' },
        ],
      },
    ],
  },
  {
    label: 'Partners',
    sections: [
      {
        items: [
          { label: 'Referral program', href: '/#resources' },
          { label: 'Integrations', href: '/#integrations' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    sections: [
      {
        items: [
          { label: 'About Check A Review', href: '/#resources' },
          { label: 'Check A Review for Consumers', href: PUBLIC_SITE_URL },
          { label: 'Check A Review Data Solutions', href: '/pricing' },
        ],
      },
    ],
  },
]

function MenuItem({ item, className, onClick }) {
  if (item.href.startsWith('http')) {
    return (
      <a href={item.href} className={className} onClick={onClick}>
        {item.label}
      </a>
    )
  }

  if (item.href.includes('#')) {
    return (
      <a href={item.href} className={className} onClick={onClick}>
        {item.label}
      </a>
    )
  }

  if (item.href.startsWith('/')) {
    return (
      <Link to={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    )
  }

  return (
    <a href={item.href} className={className} onClick={onClick}>
      {item.label}
    </a>
  )
}

export default function MarketingHeader() {
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)

  const toggleMenu = (label) => {
    setOpenMenu((current) => (current === label ? null : label))
  }

  const closeAllMenus = () => {
    setOpen(false)
    setOpenMenu(null)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={closeAllMenus}>
          <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-8 w-auto object-contain" />
          <span className="hidden text-sm font-semibold text-white sm:inline">for Business</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {menuGroups.map((group) => {
            if (group.href) {
              return (
                <MenuItem
                  key={group.label}
                  item={group}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                />
              )
            }

            const isOpen = openMenu === group.label

            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(group.label)}
                onMouseLeave={() => setOpenMenu((current) => (current === group.label ? null : current))}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  onClick={() => toggleMenu(group.label)}
                  aria-expanded={isOpen}
                >
                  {group.label}
                  <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full z-50 pt-2">
                    <div className="w-[min(92vw,44rem)] rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-slate-950/50">
                      <div className={`grid gap-6 ${group.sections.length > 2 ? 'md:grid-cols-2' : ''}`}>
                        {group.sections.map((section) => (
                          <div key={section.title || section.items[0].label}>
                            {section.title ? (
                              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
                                {section.title}
                              </p>
                            ) : null}
                            <div className="space-y-1">
                              {section.items.map((item) => (
                                <MenuItem
                                  key={item.label}
                                  item={item}
                                  className="block rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                                  onClick={() => setOpenMenu(null)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link to="/login" className="text-sm font-medium text-white transition hover:text-primary-300">
            Log in
          </Link>
          <Link
            to="/setup"
            className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            Create free account
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-white xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {menuGroups.map((group) => (
              <Fragment key={group.label}>
                {group.href ? (
                  <MenuItem
                    item={group}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200"
                    onClick={closeAllMenus}
                  />
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-medium text-white"
                      onClick={() => toggleMenu(group.label)}
                      aria-expanded={openMenu === group.label}
                    >
                      <span>{group.label}</span>
                      <ChevronDown className={`h-4 w-4 transition ${openMenu === group.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openMenu === group.label && (
                      <div className="space-y-4 px-3 pb-3">
                        {group.sections.map((section) => (
                          <div key={section.title || section.items[0].label}>
                            {section.title ? (
                              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
                                {section.title}
                              </p>
                            ) : null}
                            <div className="space-y-1">
                              {section.items.map((item) => (
                                <MenuItem
                                  key={item.label}
                                  item={item}
                                  className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                                  onClick={closeAllMenus}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            ))}
            <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white" onClick={closeAllMenus}>
              Log in
            </Link>
            <Link to="/setup" className="mt-2 rounded-full bg-primary-500 px-4 py-2.5 text-center text-sm font-semibold text-white" onClick={closeAllMenus}>
              Create free account
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
