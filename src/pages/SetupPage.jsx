import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../utils/constants'

const steps = ['Business details', 'Contact', 'Account']

export default function SetupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    businessName: '',
    website: '',
    category: '',
    email: '',
    phone: '',
    password: '',
  })
  const { login } = useAuth()
  const navigate = useNavigate()

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const next = (e) => {
    e.preventDefault()
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
      return
    }
    login(
      {
        id: Date.now(),
        name: form.businessName,
        email: form.email,
        role: 'business',
        businessName: form.businessName,
      },
      'demo-business-token'
    )
    navigate('/')
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
          {step === 0 && (
            <>
              <div>
                <label className="label-text text-slate-700" htmlFor="businessName">Business name</label>
                <input id="businessName" required className="input-field" value={form.businessName} onChange={update('businessName')} />
              </div>
              <div>
                <label className="label-text text-slate-700" htmlFor="website">Website</label>
                <input id="website" type="url" required className="input-field" value={form.website} onChange={update('website')} />
              </div>
              <div>
                <label className="label-text text-slate-700" htmlFor="category">Category</label>
                <input id="category" required className="input-field" value={form.category} onChange={update('category')} />
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
                <input id="phone" type="tel" required className="input-field" value={form.phone} onChange={update('phone')} />
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
              <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn-primary">
              {step === steps.length - 1 ? 'Create account' : 'Next'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
