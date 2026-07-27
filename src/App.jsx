import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingGate from './components/LandingGate'
import MarketingLayout from './layouts/MarketingLayout'
import PortalLayout from './layouts/PortalLayout'
import LoginPage from './pages/LoginPage'
import PricingPage from './pages/PricingPage'
import SetupPage from './pages/SetupPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ReviewsPage from './pages/ReviewsPage'
import InvitationsPage from './pages/InvitationsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import WidgetPage from './pages/WidgetPage'

function PublicOnly({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth()
  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Loading...
      </div>
    )
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route index element={<LandingGate />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Route>

          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route path="/setup" element={<SetupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<PortalLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="invitations" element={<InvitationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="widget" element={<WidgetPage />} />
              <Route path="settings" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
