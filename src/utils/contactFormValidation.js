import { BUSINESS_LOCATIONS } from './locations'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_RE = /^[a-zA-ZÀ-ÿ\s'-]+$/

export function normalizeWebsiteUrl(input) {
  let raw = String(input || '').trim()
  if (!raw) return null
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
  try {
    const url = new URL(raw)
    const hostname = url.hostname.replace(/^www\./, '')
    if (!hostname || !hostname.includes('.') || hostname.length > 253) return null
    return raw
  } catch {
    return null
  }
}

function validateName(value, label) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return `Please enter your ${label.toLowerCase()}`
  if (trimmed.length > 80) return `${label} must be 80 characters or fewer`
  if (!NAME_RE.test(trimmed)) return `${label} can only contain letters, spaces, hyphens, and apostrophes`
  return ''
}

function validatePhone(phone, phoneCode) {
  const local = String(phone || '').trim()
  if (!local) return 'Please enter your phone number'

  const digits = local.replace(/\D/g, '')
  if (digits.length < 6) return 'Enter a valid phone number (at least 6 digits)'
  if (digits.length > 15) return 'Phone number is too long'

  const code = String(phoneCode || '').trim()
  if (code && !/^\+\d{1,4}$/.test(code)) return 'Select a valid country code'

  return ''
}

export function validateContactForm(form) {
  const errors = {}

  const firstNameError = validateName(form.firstName, 'First name')
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validateName(form.lastName, 'Last name')
  if (lastNameError) errors.lastName = lastNameError

  const email = String(form.email || '').trim()
  if (!email) errors.email = 'Please enter your business email'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address'
  else if (email.length > 254) errors.email = 'Email address is too long'

  const websiteRaw = String(form.websiteUrl || '').trim()
  if (!websiteRaw) errors.websiteUrl = 'Please enter your website URL'
  else if (!normalizeWebsiteUrl(websiteRaw)) {
    errors.websiteUrl = 'Enter a valid website URL, e.g. mybusiness.com'
  }

  const country = String(form.country || '').trim()
  if (!country) errors.country = 'Please select your country'
  else if (!BUSINESS_LOCATIONS.includes(country)) errors.country = 'Please select a valid country'

  const phoneError = validatePhone(form.phone, form.phoneCode)
  if (phoneError) errors.phone = phoneError

  const companyName = String(form.companyName || '').trim()
  if (!companyName) errors.companyName = 'Please enter your company name'
  else if (companyName.length > 200) errors.companyName = 'Company name must be 200 characters or fewer'

  const jobTitle = String(form.jobTitle || '').trim()
  if (!jobTitle) errors.jobTitle = 'Please enter your job title'
  else if (jobTitle.length > 100) errors.jobTitle = 'Job title must be 100 characters or fewer'

  const message = String(form.message || '').trim()
  if (!message) errors.message = 'Please enter a message'
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters'
  else if (message.length > 5000) errors.message = 'Message must be 5000 characters or fewer'

  const normalizedWebsite = websiteRaw ? normalizeWebsiteUrl(websiteRaw) : ''
  const phoneCode = String(form.phoneCode || '').trim()
  const phone = String(form.phone || '').trim()
  const fullPhone = phoneCode && !phone.startsWith('+') ? `${phoneCode} ${phone}`.trim() : phone

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    normalized: {
      firstName: String(form.firstName || '').trim(),
      lastName: String(form.lastName || '').trim(),
      email: email.toLowerCase(),
      websiteUrl: normalizedWebsite || websiteRaw,
      country,
      phoneCode,
      phone,
      fullPhone,
      companyName,
      jobTitle,
      message,
      poweredBy: String(form.poweredBy || '').trim(),
      source: form.source || 'website',
    },
  }
}

export function fieldErrorClass(hasError) {
  return hasError ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : ''
}
