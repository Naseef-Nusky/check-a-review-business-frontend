import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, X } from 'lucide-react'
import PasswordInput from '../components/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import LogoUploader from '../components/LogoUploader'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { APP_NAME } from '../utils/constants'
import { BUSINESS_LOCATIONS } from '../utils/locations'

const steps = ['Business details', 'Additional details', 'Personal details', 'Activate account']

const revenueOptions = ['Under $500K', '$500K - $4.99 million', '$5 million - $24.99 million', '$25 million+']
const employeeOptions = ['1-9', '10-49', '50-249', '250-999', '1000+']
const phoneCodes = ['+1', '+44', '+61', '+91', '+971']

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
    phoneCode: '+91',
    phone: '',
    password: '',
  })
  const [categories, setCategories] = useState([])
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPlusModal, setShowPlusModal] = useState(false)
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
      if (!form.location || !form.businessName || !form.website || !form.mainCategoryId || !form.category) {
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
      if (step === 1) {
        setShowPlusModal(true)
      }
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
Job title: ${form.jobTitle}
Annual revenue: ${form.annualRevenue}
Employees: ${form.employeeCount}
Contact: ${form.firstName} ${form.lastName}`.trim(),
      })

      if (result.requiresEmailVerification) {
        // Logo can be uploaded from the profile page after email verification.
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
                    <label className="label-text text-slate-700" htmlFor="location">Business location</label>
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
                    <p className="mt-2 text-xs text-slate-400">Enter your website address only, e.g. yourbusiness.com</p>
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
                    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                      <div className="relative">
                        <select id="phoneCode" className="input-field appearance-none pr-10" value={form.phoneCode} onChange={update('phoneCode')}>
                          {phoneCodes.map((code) => (
                            <option key={code} value={code}>{code}</option>
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
                By submitting this form, {APP_NAME} will use your contact details to discuss our products and services. We collect, use, and protect your personal data in line with our privacy policy.
              </p>
            </form>
          </div>
        </div>
      </section>

      {showPlusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <h2 className="text-3xl font-semibold text-slate-900">Try Plus for 14 days - on us</h2>
              <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-700" onClick={() => setShowPlusModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-6 px-8 py-7 md:grid-cols-[200px_minmax(0,1fr)]">
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-32 rounded-3xl bg-yellow-300 shadow-lg">
                  <div className="absolute -left-5 top-10 h-24 w-20 rotate-[-18deg] rounded-2xl border-4 border-slate-900 bg-white shadow-md" />
                  <div className="absolute -right-8 bottom-6 h-20 w-28 rounded-2xl bg-white p-3 shadow-md">
                    <div className="h-3 w-14 rounded bg-primary-200" />
                    <div className="mt-2 flex gap-1 text-emerald-500">★★★★★</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">More tools to showcase your business</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Based on the details you shared, similar businesses choose Plus to get more invitations, marketing tools, and analytics to grow and showcase their reputation.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  {[
                    '300 review invitations',
                    '10 trust widgets for websites, email, and social',
                    '59 integrations for your eCommerce and sales tools',
                    'Customizable business profile page',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button type="button" className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200" onClick={() => setShowPlusModal(false)}>
                No, thanks
              </button>
              <button type="button" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800" onClick={() => setShowPlusModal(false)}>
                Try Plus for 14 days - free
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
