import { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'

export default function SettingsPage() {
  const { user, login, logout } = useAuth()
  const needsPassword = user?.has_password === false

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setChangingPassword(true)
    try {
      const payload = { password: passwordForm.newPassword }
      if (!needsPassword) {
        payload.currentPassword = passwordForm.currentPassword
      }

      const result = await businessApi.changePassword(payload)
      if (!result?.user || !result?.token) {
        throw new Error('Password saved, but session refresh failed. Please sign in again.')
      }

      login(result.user, result.token)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordMessage(
        result.first_password
          ? 'Password added. You can now also sign in with email.'
          : 'Password updated successfully.',
      )
    } catch (err) {
      setPasswordError(
        err.message || (needsPassword ? 'Failed to add password' : 'Failed to update password'),
      )
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Settings</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Manage your business account password and sign-in details.
        </p>
      </div>

      <section className="card p-6">
        <h3 className="text-base font-semibold text-ink">Account</h3>
        <p className="mt-1 text-sm text-ink-muted">Signed in as {user?.email || '—'}</p>
        {user?.name ? (
          <p className="mt-1 text-sm text-slate-600">{user.name}</p>
        ) : null}
      </section>

      <form onSubmit={handleChangePassword} className="card space-y-4 p-6">
        <div>
          <h3 className="text-base font-semibold text-ink">
            {needsPassword ? 'Add password' : 'Change password'}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {needsPassword
              ? 'Add a password so you can sign in with email next time.'
              : 'Update the password you use to sign in. You will stay signed in on this device.'}
          </p>
        </div>

        {passwordError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {passwordError}
          </div>
        ) : null}
        {passwordMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {passwordMessage}
          </div>
        ) : null}

        {!needsPassword ? (
          <PasswordInput
            id="currentPassword"
            label="Current password"
            required
            autoComplete="current-password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
            }
          />
        ) : null}

        <PasswordInput
          id="newPassword"
          label={needsPassword ? 'Password' : 'New password'}
          required
          minLength={8}
          autoComplete="new-password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
        />

        <PasswordInput
          id="confirmPassword"
          label={needsPassword ? 'Confirm password' : 'Confirm new password'}
          required
          minLength={8}
          autoComplete="new-password"
          value={passwordForm.confirmPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
          }
        />

        <button
          type="submit"
          disabled={changingPassword}
          className="rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {changingPassword
            ? needsPassword
              ? 'Adding...'
              : 'Updating...'
            : needsPassword
              ? 'Add password'
              : 'Update password'}
        </button>
      </form>

      <section className="card p-6">
        <h3 className="text-base font-semibold text-ink">Sign out</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Sign out of the business portal on this device.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Sign out
        </button>
      </section>
    </div>
  )
}
