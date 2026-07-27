import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  BarChart3,
  Building2,
  Code2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Star,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../utils/constants'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile', label: 'Company profile', icon: Building2 },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/invitations', label: 'Invitations', icon: MessageSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/widget', label: 'Widget', icon: Code2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function PortalLayout() {
  const { user, business, logout } = useAuth()

  return (
    <div className="min-h-screen bg-surface-muted lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-slate-950 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="flex h-16 items-center px-5">
          <Link to="/">
            <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-8 w-auto object-contain" />
          </Link>
        </div>
        <nav className="space-y-1 px-3 pb-6">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-800 px-4 py-4">
          <p className="truncate text-sm font-medium text-white">{user?.name || 'Business owner'}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Business portal</p>
            <h1 className="text-sm font-semibold text-ink">{business?.name || user?.name || 'Your company'}</h1>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
