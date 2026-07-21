import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function ProfilePage() {
  const { business, refreshBusiness } = useAuth()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '',
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const [profile, tree] = await Promise.all([
          business ? Promise.resolve(business) : refreshBusiness(),
          businessApi.getCategories(),
        ])
        if (!active) return
        setCategories(tree)
        const matchingMain = tree.find((main) =>
          main.subcategories.some((sub) => sub.name.toLowerCase() === String(profile.category || '').toLowerCase()),
        )
        setForm({
          name: profile.name || '',
          mainCategoryId: matchingMain?.id || '',
          category: profile.category || '',
          description: profile.description || '',
          website: profile.website || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
        })
      } catch (err) {
        if (active) setError(err.message || 'Failed to load profile')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [business, refreshBusiness])

  const subcategories = useMemo(() => {
    const main = categories.find((item) => item.id === form.mainCategoryId)
    return main?.subcategories || []
  }, [categories, form.mainCategoryId])

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!business?.id) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await businessApi.updateBusiness(business.id, {
        name: form.name,
        category: form.category,
        description: form.description || null,
        website: form.website || null,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
      })
      await refreshBusiness()
      setSuccess('Profile updated')
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading profile...</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Company profile</h2>
        <p className="mt-1 text-sm text-ink-muted">These details appear on your public Check A Review page.</p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={handleSave} className="card max-w-2xl space-y-4 p-6">
        <div>
          <label className="label-text text-slate-700" htmlFor="name">Business name</label>
          <input id="name" required className="input-field" value={form.name} onChange={update('name')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text text-slate-700" htmlFor="mainCategory">Main category</label>
            <select
              id="mainCategory"
              required
              className="input-field"
              value={form.mainCategoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, mainCategoryId: e.target.value, category: '' }))}
            >
              <option value="">Select main category</option>
              {categories.map((main) => (
                <option key={main.id} value={main.id}>{main.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="category">Subcategory</label>
            <select id="category" required className="input-field" value={form.category} onChange={update('category')}>
              <option value="">Select subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label-text text-slate-700" htmlFor="description">Description</label>
          <textarea id="description" className="input-field min-h-[110px]" value={form.description} onChange={update('description')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text text-slate-700" htmlFor="website">Website</label>
            <input id="website" className="input-field" value={form.website} onChange={update('website')} />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="email">Public email</label>
            <input id="email" type="email" className="input-field" value={form.email} onChange={update('email')} />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="phone">Phone</label>
            <input id="phone" className="input-field" value={form.phone} onChange={update('phone')} />
          </div>
          <div>
            <label className="label-text text-slate-700" htmlFor="address">Address</label>
            <input id="address" className="input-field" value={form.address} onChange={update('address')} />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}
