export const APP_NAME = 'Check A Review'
export const CONTACT_EMAIL = 'info@checkareview.com'
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
export const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173'

/** Business portal origin (used for SEO canonical URLs) */
export const BUSINESS_SITE_URL =
  import.meta.env.VITE_BUSINESS_SITE_URL || 'http://localhost:5175'

/** Google Search Console HTML tag verification */
export const GOOGLE_SITE_VERIFICATION = 'zAqYnx3X42ATAbzT-ro31y6POhiR67AncXoG-uCdN6o'

export function resolveMediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path) || path.startsWith('blob:') || path.startsWith('data:')) {
    return path
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  try {
    if (/^https?:\/\//i.test(API_BASE_URL)) {
      return `${new URL(API_BASE_URL).origin}${normalized}`
    }
  } catch {
    // fall through
  }
  return normalized
}

export const LOGO_UPLOAD_HINT =
  'PNG, JPG, or WEBP. Max 2MB. Square image recommended (400×400 or 512×512).'
