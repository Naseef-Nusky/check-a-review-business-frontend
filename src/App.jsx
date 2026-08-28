import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingGate from './components/LandingGate'
import MarketingLayout from './layouts/MarketingLayout'
import PortalLayout from './layouts/PortalLayout'
import LoginPage from './pages/LoginPage'
import PricingPage from './pages/PricingPage'
import SetupPage from './pages/SetupPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import HowItWorksPage from './pages/HowItWorksPage'
import EngageWithFeedbackPage from './pages/solutions/EngageWithFeedbackPage'
import AccelerateConversionsPage from './pages/solutions/AccelerateConversionsPage'
import ImproveWithInsightsPage from './pages/solutions/ImproveWithInsightsPage'
import RespondToReviewsPage from './pages/features/RespondToReviewsPage'
import ProfilePageCustomizationPage from './pages/features/ProfilePageCustomizationPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ReviewsPage from './pages/ReviewsPage'
import InvitationsPage from './pages/InvitationsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import WidgetPage from './pages/WidgetPage'
import MarketingAssetsPage from './pages/MarketingAssetsPage'
import NotificationsPage from './pages/NotificationsPage'
import SubscriptionPage from './pages/SubscriptionPage'
import TeamPage from './pages/TeamPage'
import DomainsPage from './pages/DomainsPage'
import AcceptTeamInvitePage from './pages/AcceptTeamInvitePage'

function PublicOnly({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth()
  const [searchParams] = useSearchParams()
  const allowWhileAuthed =
    searchParams.get('token') || searchParams.get('forgot') === '1'

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Loading...
      </div>
    )
  }
  if (isAuthenticated && !allowWhileAuthed) return <Navigate to="/dashboard" replace />
  return children
}

function ResetPasswordRedirect() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  return (
    <Navigate
      to={token ? `/login?token=${encodeURIComponent(token)}` : '/login?forgot=1'}
      replace
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route index element={<LandingGate />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/solutions/engage-with-feedback" element={<EngageWithFeedbackPage />} />
            <Route path="/solutions/accelerate-conversions" element={<AccelerateConversionsPage />} />
            <Route path="/solutions/improve-with-insights" element={<ImproveWithInsightsPage />} />
            <Route path="/features/respond-to-reviews" element={<RespondToReviewsPage />} />
            <Route path="/features/profile-page" element={<ProfilePageCustomizationPage />} />
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <LoginPage />
                </PublicOnly>
              }
            />
            <Route path="/forgot-password" element={<Navigate to="/login?forgot=1" replace />} />
            <Route
              path="/reset-password"
              element={<ResetPasswordRedirect />}
            />
            <Route
              path="/verify-email"
              element={
                <PublicOnly>
                  <VerifyEmailPage />
                </PublicOnly>
              }
            />
            <Route
              path="/setup"
              element={
                <PublicOnly>
                  <SetupPage />
                </PublicOnly>
              }
            />
            <Route path="/team/accept/:token" element={<AcceptTeamInvitePage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<PortalLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="invitations" element={<InvitationsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="domains" element={<DomainsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="widget" element={<WidgetPage />} />
              <Route path="integrations" element={<Navigate to="/dashboard" replace />} />
              <Route path="marketing-assets" element={<MarketingAssetsPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
