import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../utils/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(
      {
        id: 1,
        name: 'Business Owner',
        email,
        role: 'business',
        businessName: 'Demo Company',
      },
      'demo-business-token'
    )
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/logo-check-a-review.png" alt={APP_NAME} className="mx-auto h-10 w-auto object-contain" />
          <h1 className="mt-6 text-2xl font-semibold text-white">Business portal</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage reviews, invitations, and reputation.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label htmlFor="email" className="label-text text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-text text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account?{' '}
          <Link to="/setup" className="font-medium text-primary-300 hover:text-primary-200">
            Set up your business
          </Link>
        </p>
      </div>
    </div>
  )
}
