import { APP_NAME, BUSINESS_SITE_URL, CONTACT_EMAIL, PUBLIC_SITE_URL } from './constants'

export const DEFAULT_SEO = {
  title: `${APP_NAME} for Business — Collect and showcase reviews`,
  description:
    'Collect customer reviews, respond to feedback, embed trust widgets, and grow your reputation with Check A Review for Business.',
}

export function siteOrigin() {
  return BUSINESS_SITE_URL.replace(/\/$/, '')
}

export function buildCanonical(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteOrigin()}${normalized}`
}

export function formatPageTitle(title) {
  if (!title) return DEFAULT_SEO.title
  if (title.includes(APP_NAME)) return title
  return `${title} | ${APP_NAME} for Business`
}

function upsertMeta(name, content, attribute = 'name') {
  if (content === undefined || content === null || content === '') {
    document.head.querySelector(`meta[${attribute}="${name}"]`)?.remove()
    return
  }
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

export function applyPageMeta({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  path = '/',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  image,
  type = 'website',
} = {}) {
  const pageTitle = formatPageTitle(title)
  const canonical = buildCanonical(path)
  const imageUrl = image || `${siteOrigin()}/logo-check-a-review.png`

  document.title = pageTitle
  document.documentElement.lang = 'en'

  upsertMeta('description', description)
  upsertMeta('robots', robots)
  upsertMeta('googlebot', robots.startsWith('noindex') ? 'noindex, nofollow' : 'index, follow')

  upsertMeta('og:type', type, 'property')
  upsertMeta('og:site_name', `${APP_NAME} for Business`, 'property')
  upsertMeta('og:title', pageTitle, 'property')
  upsertMeta('og:description', description, 'property')
  upsertMeta('og:url', canonical, 'property')
  upsertMeta('og:locale', 'en_GB', 'property')
  upsertMeta('og:image', imageUrl, 'property')

  upsertMeta('twitter:card', 'summary')
  upsertMeta('twitter:title', pageTitle)
  upsertMeta('twitter:description', description)
  upsertMeta('twitter:image', imageUrl)

  upsertLink('canonical', canonical)
}

export function applySiteDefaults() {
  upsertMeta('application-name', `${APP_NAME} for Business`)
  upsertMeta('theme-color', '#0f172a')

  const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || ''
  upsertMeta('google-site-verification', verification)

  if (!document.getElementById('business-site-jsonld')) {
    const script = document.createElement('script')
    script.id = 'business-site-jsonld'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: `${APP_NAME} for Business`,
      url: siteOrigin(),
      logo: `${siteOrigin()}/logo-check-a-review.png`,
      email: CONTACT_EMAIL,
      description: DEFAULT_SEO.description,
      parentOrganization: {
        '@type': 'Organization',
        name: APP_NAME,
        url: PUBLIC_SITE_URL.replace(/\/$/, ''),
      },
    })
    document.head.appendChild(script)
  }
}

const NOINDEX = 'noindex, nofollow'

export const MARKETING_ROUTE_SEO = [
  {
    test: (path) => path === '/',
    meta: {
      title: 'Collect and showcase trusted reviews',
      description:
        'Turn customer feedback into growth. Collect reviews, respond publicly, embed widgets, and build trust with Check A Review for Business.',
      path: '/',
    },
  },
  {
    test: (path) => path === '/pricing',
    meta: {
      title: 'Pricing',
      description:
        'Compare Starter, Plus, and Premium plans. Collect more reviews, embed widgets, and grow trust with monthly billing in GBP.',
      path: '/pricing',
    },
  },
  {
    test: (path) => path === '/contact',
    meta: {
      title: 'Contact sales',
      description:
        'Speak with the Check A Review team about business plans, onboarding, widgets, and enterprise options.',
      path: '/contact',
    },
  },
  {
    test: (path) => path === '/how-it-works',
    meta: {
      title: 'How it works',
      description:
        'See how businesses collect reviews, improve visibility, respond to feedback, and showcase trust with Check A Review.',
      path: '/how-it-works',
    },
  },
  {
    test: (path) => path === '/setup',
    meta: {
      title: 'Create your business account',
      description: 'Register your business on Check A Review and start collecting verified customer reviews.',
      path: '/setup',
    },
  },
  {
    test: (path) => path === '/solutions/engage-with-feedback',
    meta: {
      title: 'Engage with feedback',
      description: 'Collect reviews, respond to customers, and turn feedback into a competitive advantage.',
      path: '/solutions/engage-with-feedback',
    },
  },
  {
    test: (path) => path === '/solutions/accelerate-conversions',
    meta: {
      title: 'Accelerate conversions',
      description: 'Showcase TrustScore and reviews on your website to increase confidence and conversions.',
      path: '/solutions/accelerate-conversions',
    },
  },
  {
    test: (path) => path === '/solutions/improve-with-insights',
    meta: {
      title: 'Improve with insights',
      description: 'Use review analytics and trends to understand customers and improve your service.',
      path: '/solutions/improve-with-insights',
    },
  },
  {
    test: (path) => path === '/features/respond-to-reviews',
    meta: {
      title: 'Respond to reviews',
      description: 'Reply to customer reviews from your business portal and show you value every piece of feedback.',
      path: '/features/respond-to-reviews',
    },
  },
  {
    test: (path) => path === '/features/profile-page',
    meta: {
      title: 'Business profile page',
      description: 'Customize your public business profile with branding, contact details, and verified reviews.',
      path: '/features/profile-page',
    },
  },
  {
    test: (path) => path === '/login',
    meta: {
      title: 'Business login',
      description: `Sign in to your ${APP_NAME} business portal.`,
      path: '/login',
      robots: NOINDEX,
    },
  },
  {
    test: (path) => path === '/verify-email',
    meta: {
      title: 'Verify email',
      description: `Verify your ${APP_NAME} business account email address.`,
      path: '/verify-email',
      robots: NOINDEX,
    },
  },
  {
    test: (path) => path.startsWith('/team/accept/'),
    meta: (path) => ({
      title: 'Accept team invite',
      description: 'Join a business team on Check A Review.',
      path,
      robots: NOINDEX,
    }),
  },
]

export function getMarketingRouteSeo(pathname) {
  const path = pathname || '/'
  for (const route of MARKETING_ROUTE_SEO) {
    if (!route.test(path)) continue
    return typeof route.meta === 'function' ? route.meta(path) : { ...route.meta }
  }
  return null
}

export const PORTAL_SEO = {
  title: 'Business portal',
  description: `Your ${APP_NAME} business dashboard.`,
  robots: NOINDEX,
}
