import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import PasswordInput from '../components/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import LogoUploader from '../components/LogoUploader'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { APP_NAME, PUBLIC_SITE_URL } from '../utils/constants'
import { BUSINESS_LOCATIONS } from '../utils/locations'
import { stashPendingBusinessLogo } from '../utils/pendingLogo'
import { PHONE_COUNTRY_CODES } from '../utils/phoneCountryCodes'

const steps = ['Business details', 'Additional details', 'Personal details', 'Activate account']

const revenueOptions = ['Under £500K', '£500K - £4.99 million', '£5 million - £24.99 million', '£25 million+']
const employeeOptions = ['1-9', '10-49', '50-249', '250-999', '1000+']

function ProgressSteps({ step }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-500">
      {steps.map((label, index) => {
        const complete = index < step
        const current = index === step
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                complete
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : current
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-300 bg-white text-slate-500'
              }`}
            >
              {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span className={current ? 'font-semibold text-slate-900' : ''}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

function SelectChevron() {
  return <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
}

export default function SetupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    location: 'United Kingdom',
    address: '',
    postalCode: '',
    businessName: '',
    website: '',
    mainCategoryId: '',
    category: '',
    jobTitle: '',
    annualRevenue: '',
    employeeCount: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+44',
    phoneCountry: 'United Kingdom',
    phone: '',
    password: '',
  })
  const [categories, setCategories] = useState([])
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, refreshBusiness, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
    }
  }, [logoPreview])

  const handleLogoChange = (file) => {
    if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
    if (!file) {
      setLogoFile(null)
      setLogoPreview('')
      return
    }
    setError('')
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    businessApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const subcategories = useMemo(() => {
    const main = categories.find((item) => item.id === form.mainCategoryId)
    return main?.subcategories || []
  }, [categories, form.mainCategoryId])

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validateStep = () => {
    if (step === 0) {
      if (!form.location || !form.address || !form.businessName || !form.website || !form.mainCategoryId || !form.category) {
        return 'Please complete all business details fields.'
      }
    }

    if (step === 1) {
      if (!form.jobTitle || !form.annualRevenue || !form.employeeCount) {
        return 'Please complete the additional details before continuing.'
      }
    }

    if (step === 2) {
      if (!form.firstName || !form.lastName || !form.phone) {
        return 'Please enter your personal details.'
      }
    }

    if (step === 3) {
      if (!form.email || !form.password) {
        return 'Please enter your email address and password.'
      }
      if (form.password.length < 6) {
        return 'Password must be at least 6 characters.'
      }
    }

    return ''
  }

  const next = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }

    if (step < steps.length - 1) {
      setStep((s) => s + 1)
      return
    }

    setLoading(true)
    try {
      const websiteValue = form.website.trim()
      const website = websiteValue
        ? /^https?:\/\//i.test(websiteValue)
          ? websiteValue
          : `https://${websiteValue}`
        : null

      const result = await businessApi.register({
        email: form.email,
        password: form.password,
        name: form.businessName,
        role: 'business',
        category: form.category,
        website,
        phone: `${form.phoneCode} ${form.phone}`.trim() || null,
        description: `Location: ${form.location}
Address: ${form.address}
ZIP / Postal code: ${form.postalCode || '—'}
Job title: ${form.jobTitle}
Annual revenue: ${form.annualRevenue}
Employees: ${form.employeeCount}
Contact: ${form.firstName} ${form.lastName}`.trim(),
      })

      if (result.requiresEmailVerification) {
        if (logoFile) {
          await stashPendingBusinessLogo(logoFile)
        }
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
        return
      }

      login(result.user, result.token)
      const profile = await refreshBusiness()
      if (logoFile && profile?.id) {
        try {
          await businessApi.uploadLogo(profile.id, logoFile)
          await refreshBusiness()
        } catch (logoErr) {
          console.warn('Logo upload failed after signup:', logoErr)
        }
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create business account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-100">
      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <ProgressSteps step={step} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-center text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {step === 0 && "First, let's add your business details"}
              {step === 1 && 'More details can help us customize your experience'}
              {step === 2 && 'Now, add your personal details so we know who you are'}
              {step === 3 && 'We need to send you a link to activate your account'}
            </h1>

            <p className="mt-4 text-center text-sm text-slate-600">
              Already have a business account?{' '}
              <Link to="/login" className="font-medium text-primary-600 underline-offset-4 hover:underline">
                Log in here
              </Link>
              . Reviewer accounts are separate — you can use the same email for both.
            </p>

            <form onSubmit={next} className="mt-8 space-y-6">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}

              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-text text-slate-700" htmlFor="location">Country</label>
                    <div className="relative">
                      <select id="location" className="input-field appearance-none pr-10" value={form.location} onChange={update('location')}>
                        {BUSINESS_LOCATIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="businessName">Business name</label>
                    <input id="businessName" className="input-field" value={form.businessName} onChange={update('businessName')} />
                    <p className="mt-2 text-xs text-slate-400">This helps customers find and trust your business.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label-text text-slate-700" htmlFor="logo">Business logo</label>
                    <LogoUploader
                      valueFile={logoFile}
                      previewUrl={logoPreview}
                      onChange={handleLogoChange}
                      onError={setError}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="website">Business website</label>
                    <input
                      id="website"
                      type="text"
                      className="input-field"
                      value={form.website}
                      onChange={update('website')}
                      placeholder="yourbusiness.com"
                      inputMode="url"
                      autoComplete="url"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Enter a live website address, e.g. yourbusiness.com. We check DNS before creating the account.
                    </p>
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="address">Address</label>
                    <input
                      id="address"
                      className="input-field"
                      value={form.address}
                      onChange={update('address')}
                      placeholder="Street address"
                      autoComplete="street-address"
                    />
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="postalCode">ZIP / Postal code</label>
                    <input
                      id="postalCode"
                      className="input-field"
                      value={form.postalCode}
                      onChange={update('postalCode')}
                      placeholder="Optional"
                      autoComplete="postal-code"
                    />
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="mainCategory">Main category</label>
                    <div className="relative">
                      <select
                        id="mainCategory"
                        className="input-field appearance-none pr-10"
                        value={form.mainCategoryId}
                        onChange={(e) => setForm((prev) => ({ ...prev, mainCategoryId: e.target.value, category: '' }))}
                      >
                        <option value="">Select main category</option>
                        {categories.map((main) => (
                          <option key={main.id} value={main.id}>{main.name}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label-text text-slate-700" htmlFor="category">Subcategory</label>
                    <div className="relative">
                      <select
                        id="category"
                        className="input-field appearance-none pr-10"
                        value={form.category}
                        onChange={update('category')}
                        disabled={!form.mainCategoryId}
                      >
                        <option value="">Select subcategory</option>
                        {subcategories.map((sub) => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label-text text-slate-700" htmlFor="jobTitle">Your job title</label>
                    <input id="jobTitle" className="input-field" value={form.jobTitle} onChange={update('jobTitle')} placeholder="Marketing manager" />
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="annualRevenue">Annual revenue</label>
                    <div className="relative">
                      <select id="annualRevenue" className="input-field appearance-none pr-10" value={form.annualRevenue} onChange={update('annualRevenue')}>
                        <option value="">Select annual revenue</option>
                        {revenueOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="employeeCount">Number of employees</label>
                    <div className="relative">
                      <select id="employeeCount" className="input-field appearance-none pr-10" value={form.employeeCount} onChange={update('employeeCount')}>
                        <option value="">Select team size</option>
                        {employeeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-text text-slate-700" htmlFor="firstName">First name</label>
                    <input id="firstName" className="input-field" value={form.firstName} onChange={update('firstName')} />
                  </div>

                  <div>
                    <label className="label-text text-slate-700" htmlFor="lastName">Last name</label>
                    <input id="lastName" className="input-field" value={form.lastName} onChange={update('lastName')} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label-text text-slate-700" htmlFor="phone">Phone number</label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(11rem,14rem)_minmax(0,1fr)]">
                      <div className="relative">
                        <select
                          id="phoneCode"
                          className="input-field appearance-none pr-10"
                          value={`${form.phoneCode}|${form.phoneCountry || ''}`}
                          onChange={(e) => {
                            const [code, ...nameParts] = e.target.value.split('|')
                            setForm((prev) => ({
                              ...prev,
                              phoneCode: code,
                              phoneCountry: nameParts.join('|'),
                            }))
                          }}
                        >
                          {PHONE_COUNTRY_CODES.map((country) => (
                            <option key={`${country.name}-${country.code}`} value={`${country.code}|${country.name}`}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                        <SelectChevron />
                      </div>
                      <input id="phone" type="tel" className="input-field" value={form.phone} onChange={update('phone')} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-text text-slate-700" htmlFor="email">Email address</label>
                    <input id="email" type="email" className="input-field" value={form.email} onChange={update('email')} placeholder="name@yourbusiness.com" />
                    <p className="mt-2 text-sm text-slate-500">
                      Use an email that matches your website domain when possible.
                    </p>
                  </div>

                  <div>
                    <PasswordInput
                      id="password"
                      label="Create password"
                      minLength={6}
                      value={form.password}
                      onChange={update('password')}
                    />
                  </div>

                  <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    After you create your account, we will email you a 6-digit verification code. Your business listing
                    is also reviewed by an administrator before it appears in public search.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                {step > 0 ? (
                  <button type="button" className="btn-secondary min-w-24 border-slate-300 bg-white px-7 py-3 text-base" onClick={() => setStep((s) => s - 1)} disabled={loading}>
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <button type="submit" className="inline-flex min-w-24 items-center justify-center rounded-full bg-primary-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
                  {loading ? 'Creating...' : step === steps.length - 1 ? 'Send link' : 'Next'}
                </button>
              </div>

              <p className="pt-2 text-xs leading-relaxed text-slate-500">
                By submitting this form, {APP_NAME} will use your contact details to discuss our products and services. We
                collect, use, and protect your personal data in line with our{' '}
                <a href={`${PUBLIC_SITE_URL}/privacy`} className="font-medium text-primary-700 hover:text-primary-800">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a
                  href={`${PUBLIC_SITE_URL}/terms/business`}
                  className="font-medium text-primary-700 hover:text-primary-800"
                >
                  Business Terms
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
