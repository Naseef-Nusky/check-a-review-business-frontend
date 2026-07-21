import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { APP_NAME } from '../utils/constants'

const steps = ['Business details', 'Contact', 'Account']

export default function SetupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    businessName: '',
    website: '',
    mainCategoryId: '',
    category: '',
    email: '',
    phone: '',
    password: '',
  })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, refreshBusiness, isAuthenticated } = useAuth()
  const navigate = useNavigate()

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

  const next = async (e) => {
    e.preventDefault()
    setError('')
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
      return
    }

    setLoading(true)
    try {
      const { user, token } = await businessApi.register({
        email: form.email,
        password: form.password,
        name: form.businessName,
        role: 'business',
        category: form.category,
        website: form.website || null,
        phone: form.phone || null,
      })
      login(user, token)
      await refreshBusiness()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create business account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Link to="/login">
            <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-8 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step {step + 1} of {steps.length}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{steps[step]}</h1>

        <form onSubmit={next} className="card mt-8 space-y-4 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {step === 0 && (
            <>
              <div>
                <label className="label-text text-slate-700" htmlFor="businessName">Business name</label>
                <input id="businessName" required className="input-field" value={form.businessName} onChange={update('businessName')} />
              </div>
              <div>
                <label className="label-text text-slate-700" htmlFor="website">Website</label>
                <input id="website" type="url" className="input-field" value={form.website} onChange={update('website')} placeholder="https://" />
              </div>
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
                <select
                  id="category"
                  required
                  className="input-field"
                  value={form.category}
                  onChange={update('category')}
                  disabled={!form.mainCategoryId}
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="label-text text-slate-700" htmlFor="email">Work email</label>
                <input id="email" type="email" required className="input-field" value={form.email} onChange={update('email')} />
              </div>
              <div>
                <label className="label-text text-slate-700" htmlFor="phone">Phone</label>
                <input id="phone" type="tel" className="input-field" value={form.phone} onChange={update('phone')} />
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="label-text text-slate-700" htmlFor="password">Password</label>
              <input id="password" type="password" required minLength={6} className="input-field" value={form.password} onChange={update('password')} />
            </div>
          )}

          <div className="flex justify-between gap-3 pt-2">
            {step > 0 ? (
              <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)} disabled={loading}>
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : step === steps.length - 1 ? 'Create account' : 'Next'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
