import { useEffect, useMemo, useState } from 'react'
import LogoUploader from '../components/LogoUploader'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { resolveMediaUrl } from '../utils/constants'
import { BUSINESS_LOCATIONS } from '../utils/locations'

const REVENUE_OPTIONS = ['Under £500K', '£500K - £4.99 million', '£5 million - £24.99 million', '£25 million+']
const EMPLOYEE_OPTIONS = ['1-9', '10-49', '50-249', '250-999', '1000+']

function parseLocationFromDescription(description = '') {
  const match = String(description).match(/Location:\s*(.+)/i)
  return match?.[1]?.split('\n')[0]?.trim() || ''
}

function parseFieldFromDescription(description = '', label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = String(description).match(new RegExp(`${escaped}:\\s*(.+)`, 'i'))
  return match?.[1]?.split('\n')[0]?.trim() || ''
}

function parseProfileSummary(description = '') {
  return String(description)
    .split('\n')
    .filter(
      (line) =>
        line.trim() &&
        !/^(Location|Job title|Annual revenue|Employees|Contact):\s*/i.test(line.trim()),
    )
    .join(' ')
    .trim()
}

function buildDescription({
  summary = '',
  location = '',
  jobTitle = '',
  annualRevenue = '',
  employeeCount = '',
  contactName = '',
}) {
  const parts = []
  if (summary.trim()) parts.push(summary.trim())
  if (location.trim()) parts.push(`Location: ${location.trim()}`)
  if (jobTitle.trim()) parts.push(`Job title: ${jobTitle.trim()}`)
  if (annualRevenue.trim()) parts.push(`Annual revenue: ${annualRevenue.trim()}`)
  if (employeeCount.trim()) parts.push(`Employees: ${employeeCount.trim()}`)
  if (contactName.trim()) parts.push(`Contact: ${contactName.trim()}`)
  return parts.join('\n')
}

export default function ProfilePage() {
  const { business, refreshBusiness } = useAuth()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '',
    location: '',
    mainCategoryId: '',
    category: '',
    description: '',
    jobTitle: '',
    annualRevenue: '',
    employeeCount: '',
    contactName: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    brandColor: '#FF4081',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [canBrandMatch, setCanBrandMatch] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [profile, tree] = await Promise.all([
          refreshBusiness(),
          businessApi.getCategories(),
        ])
        if (!active) return
        setCategories(tree || [])
        const matchingMain = (tree || []).find((main) =>
          main.subcategories.some(
            (sub) => sub.name.toLowerCase() === String(profile?.category || '').toLowerCase(),
          ),
        )
        const locationFromDesc = parseLocationFromDescription(profile?.description)
        setForm({
          name: profile?.name || '',
          location: locationFromDesc || profile?.address || '',
          mainCategoryId: matchingMain?.id || '',
          category: profile?.category || '',
          description: parseProfileSummary(profile?.description),
          jobTitle: parseFieldFromDescription(profile?.description, 'Job title'),
          annualRevenue: parseFieldFromDescription(profile?.description, 'Annual revenue'),
          employeeCount: parseFieldFromDescription(profile?.description, 'Employees'),
          contactName: parseFieldFromDescription(profile?.description, 'Contact'),
          website: profile?.website || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
          brandColor: profile?.brand_color || '#FF4081',
        })
        setLogoFile(null)
        setLogoPreview(profile?.logo_url ? resolveMediaUrl(profile.logo_url) : '')
        if (profile?.id) {
          const sub = await businessApi.getSubscription(profile.id).catch(() => null)
          if (active) setCanBrandMatch(Boolean(sub?.entitlements?.flags?.brandMatch))
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load profile')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [refreshBusiness])

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
    }
  }, [logoPreview])

  const subcategories = useMemo(() => {
    const main = categories.find((item) => item.id === form.mainCategoryId)
    return main?.subcategories || []
  }, [categories, form.mainCategoryId])

  const categoryOptions = useMemo(() => {
    const names = subcategories.map((sub) => sub.name)
    if (form.category && !names.some((n) => n.toLowerCase() === form.category.toLowerCase())) {
      return [{ id: `custom-${form.category}`, name: form.category }, ...subcategories]
    }
    return subcategories
  }, [subcategories, form.category])

  const update = (field) => (e) => {
    setSuccess('')
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleLogoChange = async (file) => {
    if (!business?.id) return

    if (!file) {
      setUploadingLogo(true)
      setError('')
      setSuccess('')
      try {
        await businessApi.updateBusiness(business.id, { logo_url: '' })
        await refreshBusiness()
        if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
        setLogoFile(null)
        setLogoPreview('')
        setSuccess('Logo removed')
      } catch (err) {
        setError(err.message || 'Failed to remove logo')
      } finally {
        setUploadingLogo(false)
      }
      return
    }

    setUploadingLogo(true)
    setError('')
    setSuccess('')
    try {
      await businessApi.uploadLogo(business.id, file)
      const updated = await refreshBusiness()
      if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
      setLogoFile(null)
      setLogoPreview(updated?.logo_url ? resolveMediaUrl(updated.logo_url) : URL.createObjectURL(file))
      setSuccess('Logo updated')
    } catch (err) {
      setError(err.message || 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!business?.id) {
      setError('Business profile not loaded. Please refresh and try again.')
      return
    }
    if (!form.name.trim()) {
      setError('Business name is required')
      return
    }
    if (!form.category.trim()) {
      setError('Please select a category')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const address = (form.address || form.location || '').trim()
      const description = buildDescription({
        summary: form.description,
        location: form.location,
        jobTitle: form.jobTitle,
        annualRevenue: form.annualRevenue,
        employeeCount: form.employeeCount,
        contactName: form.contactName,
      })

      await businessApi.updateBusiness(business.id, {
        name: form.name.trim(),
        category: form.category,
        description,
        website: form.website.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address,
        ...(canBrandMatch ? { brandColor: form.brandColor } : {}),
      })
      await refreshBusiness()
      setForm((prev) => ({
        ...prev,
        description,
        address,
      }))
      setSuccess('Company details saved. Your public profile is updated.')
    } catch (err) {
      setError(err.message || 'Failed to update company details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading company details...</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Company profile</h2>
        <p className="mt-1 text-sm text-ink-muted">
          All fields below are editable. Save anytime — changes appear on your public Check A Review page.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="card max-w-3xl space-y-5 p-6">
        <div>
          <label className="label-text text-slate-700" htmlFor="logo">
            Business logo
          </label>
          <LogoUploader
            valueFile={logoFile}
            previewUrl={logoPreview}
            onChange={handleLogoChange}
            onError={setError}
            disabled={uploadingLogo || saving}
          />
          {uploadingLogo ? <p className="mt-2 text-xs text-slate-400">Uploading logo...</p> : null}
        </div>

        <div>
          <label className="label-text text-slate-700" htmlFor="brandColor">
            Brand color
          </label>
          {canBrandMatch ? (
            <input
              id="brandColor"
              type="color"
              className="h-10 w-20 cursor-pointer rounded border border-border bg-white p-1"
              value={form.brandColor || '#FF4081'}
              onChange={update('brandColor')}
            />
          ) : (
            <p className="mt-1 text-sm text-ink-muted">
              Matching your public profile to your brand is included from Plus.{' '}
              <a href="/subscription" className="font-semibold text-primary-600 hover:underline">
                Upgrade
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="label-text text-slate-700" htmlFor="name">
            Business name
          </label>
          <input
            id="name"
            required
            className="input-field"
            value={form.name}
            onChange={update('name')}
            placeholder="Your company name"
          />
        </div>

        <div>
          <label className="label-text text-slate-700" htmlFor="location">
            Location / country
          </label>
          <select id="location" className="input-field" value={form.location} onChange={update('location')}>
            <option value="">Select location</option>
            {BUSINESS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
            {form.location && !BUSINESS_LOCATIONS.includes(form.location) ? (
              <option value={form.location}>{form.location}</option>
            ) : null}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text text-slate-700" htmlFor="mainCategory">
              Main category
            </label>
            <select
              id="mainCategory"
              className="input-field"
              value={form.mainCategoryId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, mainCategoryId: e.target.value, category: '' }))
              }
            >
              <option value="">Select main category</option>
              {categories.map((main) => (
                <option key={main.id} value={main.id}>
                  {main.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="category">
              Subcategory
            </label>
            <select
              id="category"
              required
              className="input-field"
              value={form.category}
              onChange={update('category')}
            >
              <option value="">Select subcategory</option>
              {categoryOptions.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label-text text-slate-700" htmlFor="description">
            Company profile
          </label>
          <input
            id="description"
            className="input-field"
            value={form.description}
            onChange={update('description')}
            placeholder="Short one-line summary about your business"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text text-slate-700" htmlFor="jobTitle">
              Job title
            </label>
            <input
              id="jobTitle"
              className="input-field"
              value={form.jobTitle}
              onChange={update('jobTitle')}
              placeholder="Owner, Founder, Manager"
            />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="contactName">
              Contact name
            </label>
            <input
              id="contactName"
              className="input-field"
              value={form.contactName}
              onChange={update('contactName')}
              placeholder="Primary contact person"
            />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="annualRevenue">
              Annual revenue
            </label>
            <select
              id="annualRevenue"
              className="input-field"
              value={form.annualRevenue}
              onChange={update('annualRevenue')}
            >
              <option value="">Select annual revenue</option>
              {REVENUE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              {form.annualRevenue && !REVENUE_OPTIONS.includes(form.annualRevenue) ? (
                <option value={form.annualRevenue}>{form.annualRevenue}</option>
              ) : null}
            </select>
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="employeeCount">
              Employees
            </label>
            <select
              id="employeeCount"
              className="input-field"
              value={form.employeeCount}
              onChange={update('employeeCount')}
            >
              <option value="">Select employee range</option>
              {EMPLOYEE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              {form.employeeCount && !EMPLOYEE_OPTIONS.includes(form.employeeCount) ? (
                <option value={form.employeeCount}>{form.employeeCount}</option>
              ) : null}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text text-slate-700" htmlFor="website">
              Website
            </label>
            <input
              id="website"
              className="input-field"
              value={form.website}
              onChange={update('website')}
              placeholder="https://yourbusiness.com"
            />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="email">
              Public email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={update('email')}
              placeholder="hello@yourbusiness.com"
            />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className="input-field"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+1 555 000 0000"
            />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              className="input-field"
              value={form.address}
              onChange={update('address')}
              placeholder="City, street, or mailing address"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={saving || uploadingLogo}>
            {saving ? 'Saving...' : 'Save company details'}
          </button>
          <p className="text-xs text-slate-400">You can update these details whenever you need.</p>
        </div>
      </form>
    </div>
  )
}
