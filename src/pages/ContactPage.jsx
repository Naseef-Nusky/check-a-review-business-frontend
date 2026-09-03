import { useState } from 'react'
import { ChevronDown, Mail, MapPin } from 'lucide-react'
import { ApiError, publicApi } from '../services/api'
import { CONTACT_EMAIL } from '../utils/constants'
import { validateContactForm, fieldErrorClass } from '../utils/contactFormValidation'
import { BUSINESS_LOCATIONS } from '../utils/locations'
import { PHONE_COUNTRY_CODES } from '../utils/phoneCountryCodes'

const contactItems = [
  { label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  { label: 'Office', value: '125 Deansgate, Greater Manchester M3 2BY', icon: MapPin },
]

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  websiteUrl: '',
  country: 'United Kingdom',
  phoneCode: '+44',
  phoneCountry: 'United Kingdom',
  phone: '',
  companyName: '',
  jobTitle: '',
  message: '',
  poweredBy: '',
}

function SelectChevron() {
  return <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  )
}

function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-text text-slate-700">
        {label}
      </label>
      {children}
      <FieldError id={`${htmlFor}-error`} message={error} />
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { errors, isValid, normalized } = validateContactForm({ ...form, source: 'business-portal' })
    if (!isValid) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)

    try {
      await publicApi.submitContact({
        firstName: normalized.firstName,
        lastName: normalized.lastName,
        email: normalized.email,
        websiteUrl: normalized.websiteUrl,
        country: normalized.country,
        phoneCode: normalized.phoneCode,
        phone: normalized.phone,
        companyName: normalized.companyName,
        jobTitle: normalized.jobTitle,
        message: normalized.message,
        poweredBy: normalized.poweredBy,
        source: normalized.source,
      })
      setSuccess('Thank you for contacting us. Our sales team will get back to you shortly.')
      setForm(emptyForm)
      setFieldErrors({})
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="section-kicker">Sales</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Get in touch with us</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Tell us about your business and what you need. Our team will help you choose the right plan and get started.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form noValidate onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="First name" htmlFor="firstName" error={fieldErrors.firstName}>
              <input
                id="firstName"
                type="text"
                required
                maxLength={80}
                value={form.firstName}
                onChange={update('firstName')}
                className={`input-field ${fieldErrorClass(fieldErrors.firstName)}`}
                disabled={submitting}
                aria-invalid={fieldErrors.firstName ? 'true' : undefined}
                aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
              />
            </FormField>
            <FormField label="Last name" htmlFor="lastName" error={fieldErrors.lastName}>
              <input
                id="lastName"
                type="text"
                required
                maxLength={80}
                value={form.lastName}
                onChange={update('lastName')}
                className={`input-field ${fieldErrorClass(fieldErrors.lastName)}`}
                disabled={submitting}
                aria-invalid={fieldErrors.lastName ? 'true' : undefined}
                aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
              />
            </FormField>
          </div>

          <FormField label="Business email" htmlFor="email" error={fieldErrors.email}>
            <input
              id="email"
              type="email"
              required
              maxLength={254}
              value={form.email}
              onChange={update('email')}
              className={`input-field ${fieldErrorClass(fieldErrors.email)}`}
              disabled={submitting}
              placeholder="name@yourbusiness.com"
              aria-invalid={fieldErrors.email ? 'true' : undefined}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
          </FormField>

          <FormField label="Website URL" htmlFor="websiteUrl" error={fieldErrors.websiteUrl}>
            <input
              id="websiteUrl"
              type="text"
              required
              maxLength={500}
              value={form.websiteUrl}
              onChange={update('websiteUrl')}
              className={`input-field ${fieldErrorClass(fieldErrors.websiteUrl)}`}
              disabled={submitting}
              placeholder="https://www.yourbusiness.com"
              aria-invalid={fieldErrors.websiteUrl ? 'true' : undefined}
              aria-describedby={fieldErrors.websiteUrl ? 'websiteUrl-error' : undefined}
            />
          </FormField>

          <FormField label="Country" htmlFor="country" error={fieldErrors.country}>
            <div className="relative">
              <select
                id="country"
                required
                value={form.country}
                onChange={update('country')}
                className={`input-field appearance-none pr-10 ${fieldErrorClass(fieldErrors.country)}`}
                disabled={submitting}
                aria-invalid={fieldErrors.country ? 'true' : undefined}
                aria-describedby={fieldErrors.country ? 'country-error' : undefined}
              >
                {BUSINESS_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </FormField>

          <FormField label="Phone number" htmlFor="phone" error={fieldErrors.phone}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(11rem,14rem)_minmax(0,1fr)]">
              <div className="relative">
                <select
                  id="phoneCode"
                  className={`input-field appearance-none pr-10 ${fieldErrorClass(fieldErrors.phone)}`}
                  value={`${form.phoneCode}|${form.phoneCountry || ''}`}
                  onChange={(e) => {
                    const [code, ...nameParts] = e.target.value.split('|')
                    setForm((prev) => ({
                      ...prev,
                      phoneCode: code,
                      phoneCountry: nameParts.join('|'),
                    }))
                    setFieldErrors((prev) => ({ ...prev, phone: '' }))
                    setError('')
                  }}
                  disabled={submitting}
                >
                  {PHONE_COUNTRY_CODES.map((country) => (
                    <option key={`${country.name}-${country.code}`} value={`${country.code}|${country.name}`}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
              <input
                id="phone"
                type="tel"
                required
                maxLength={20}
                value={form.phone}
                onChange={update('phone')}
                className={`input-field ${fieldErrorClass(fieldErrors.phone)}`}
                disabled={submitting}
                aria-invalid={fieldErrors.phone ? 'true' : undefined}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
              />
            </div>
          </FormField>

          <FormField label="Company name" htmlFor="companyName" error={fieldErrors.companyName}>
            <input
              id="companyName"
              type="text"
              required
              maxLength={200}
              value={form.companyName}
              onChange={update('companyName')}
              className={`input-field ${fieldErrorClass(fieldErrors.companyName)}`}
              disabled={submitting}
              aria-invalid={fieldErrors.companyName ? 'true' : undefined}
              aria-describedby={fieldErrors.companyName ? 'companyName-error' : undefined}
            />
          </FormField>

          <FormField label="Job title" htmlFor="jobTitle" error={fieldErrors.jobTitle}>
            <input
              id="jobTitle"
              type="text"
              required
              maxLength={100}
              value={form.jobTitle}
              onChange={update('jobTitle')}
              className={`input-field ${fieldErrorClass(fieldErrors.jobTitle)}`}
              disabled={submitting}
              aria-invalid={fieldErrors.jobTitle ? 'true' : undefined}
              aria-describedby={fieldErrors.jobTitle ? 'jobTitle-error' : undefined}
            />
          </FormField>

          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="poweredBy">Powered by</label>
            <input
              id="poweredBy"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.poweredBy}
              onChange={update('poweredBy')}
            />
          </div>

          <FormField label="Message" htmlFor="message" error={fieldErrors.message}>
            <textarea
              id="message"
              rows={5}
              required
              maxLength={5000}
              value={form.message}
              onChange={update('message')}
              className={`input-field ${fieldErrorClass(fieldErrors.message)}`}
              disabled={submitting}
              placeholder="Tell us about your business and what you are looking for."
              aria-invalid={fieldErrors.message ? 'true' : undefined}
              aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            />
          </FormField>

          <button type="submit" className="btn-primary rounded-full" disabled={submitting}>
            {submitting ? 'Sending...' : 'Contact sales'}
          </button>
        </form>

        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900">Get in touch</h3>
            <dl className="mt-5 space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <item.icon className="h-4 w-4 stroke-[1.5]" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</dt>
                    <dd className="mt-1 text-sm text-slate-900">
                      {item.href ? (
                        <a href={item.href} className="hover:text-primary-600">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
