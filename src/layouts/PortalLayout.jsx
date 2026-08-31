import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import PortalRouteMeta from '../components/seo/PortalRouteMeta'
import {
  BarChart3,
  Bell,
  Building2,
  Code2,
  CreditCard,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Star,
  Users,
  Globe,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessApi } from '../services/api'
import { APP_NAME } from '../utils/constants'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile', label: 'Company profile', icon: Building2 },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/invitations', label: 'Invitations', icon: MessageSquare },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/domains', label: 'Domains', icon: Globe },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/widget', label: 'Widget', icon: Code2 },
  { to: '/marketing-assets', label: 'Marketing assets', icon: Image },
  { to: '/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function SidebarNav({ unreadCount, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {to === '/notifications' && unreadCount > 0 ? (
            <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarAccount({ user, onLogout }) {
  return (
    <div className="border-t border-slate-800 px-4 py-4">
      <p className="truncate text-sm font-medium text-white">{user?.name || 'Business owner'}</p>
      <p className="truncate text-xs text-slate-400">{user?.email}</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Log out
      </button>
    </div>
  )
}

export default function PortalLayout() {
  const { user, business, logout } = useAuth()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const loadUnread = useCallback(async () => {
    try {
      const rows = await businessApi.getNotifications()
      setUnreadCount((rows || []).filter((n) => !n.read).length)
    } catch {
      setUnreadCount(0)
    }
  }, [])

  useEffect(() => {
    loadUnread()
    const timer = setInterval(loadUnread, 30000)
    return () => clearInterval(timer)
  }, [loadUnread])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileNavOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  return (
    <div className="min-h-screen bg-surface-muted lg:grid lg:grid-cols-[260px_1fr]">
      <PortalRouteMeta />
      <aside className="hidden border-r border-slate-800 bg-slate-950 text-white lg:flex lg:min-h-screen lg:flex-col">
        <div className="flex h-16 shrink-0 items-center px-5">
          <Link to="/">
            <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-8 w-auto object-contain" />
          </Link>
        </div>
        <SidebarNav unreadCount={unreadCount} />
        <SidebarAccount user={user} onLogout={logout} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Business portal</p>
              <h1 className="truncate text-sm font-semibold text-ink">{business?.name || user?.name || 'Your company'}</h1>
            </div>
          </div>
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" strokeWidth={1.5} />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </Link>
        </header>
        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet context={{ refreshUnread: loadUnread }} />
        </main>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-slate-950 text-white shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
              <Link to="/" onClick={() => setMobileNavOpen(false)}>
                <img src="/logo-check-a-review.png" alt={APP_NAME} className="h-7 w-auto object-contain" />
              </Link>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <SidebarNav unreadCount={unreadCount} onNavigate={() => setMobileNavOpen(false)} />
            <SidebarAccount user={user} onLogout={logout} />
          </aside>
        </div>
      ) : null}
    </div>
  )
}
