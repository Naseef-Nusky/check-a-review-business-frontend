import { useEffect, useMemo, useState } from 'react'
import LogoUploader from '../components/LogoUploader'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { resolveMediaUrl } from '../utils/constants'
import { BUSINESS_LOCATIONS } from '../utils/locations'

function parseLocationFromDescription(description = '') {
  const match = String(description).match(/Location:\s*(.+)/i)
  return match?.[1]?.split('\n')[0]?.trim() || ''
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
    website: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
          description: profile?.description || '',
          website: profile?.website || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
        })
        setLogoFile(null)
        setLogoPreview(profile?.logo_url ? resolveMediaUrl(profile.logo_url) : '')
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
      await refreshBusiness()
      if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
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
      await businessApi.updateBusiness(business.id, {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        website: form.website.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: (form.address || form.location || '').trim(),
      })
      await refreshBusiness()
      setSuccess('Company details saved')
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
          Edit your company details anytime. Changes appear on your public Check A Review page.
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
              disabled={!form.mainCategoryId && categoryOptions.length === 0}
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
            Description
          </label>
          <textarea
            id="description"
            className="input-field min-h-[120px]"
            value={form.description}
            onChange={update('description')}
            placeholder="Tell customers what your business does"
          />
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
