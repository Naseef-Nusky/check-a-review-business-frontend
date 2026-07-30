import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingGate from './components/LandingGate'
import MarketingLayout from './layouts/MarketingLayout'
import PortalLayout from './layouts/PortalLayout'
import LoginPage from './pages/LoginPage'
import PricingPage from './pages/PricingPage'
import SetupPage from './pages/SetupPage'
import HowItWorksPage from './pages/HowItWorksPage'
import EngageWithFeedbackPage from './pages/solutions/EngageWithFeedbackPage'
import AccelerateConversionsPage from './pages/solutions/AccelerateConversionsPage'
import ImproveWithInsightsPage from './pages/solutions/ImproveWithInsightsPage'
import RespondToReviewsPage from './pages/features/RespondToReviewsPage'
import ProfilePageCustomizationPage from './pages/features/ProfilePageCustomizationPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ReviewsPage from './pages/ReviewsPage'
import InvitationsPage from './pages/InvitationsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import WidgetPage from './pages/WidgetPage'
import NotificationsPage from './pages/NotificationsPage'

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
            <Route
              path="/setup"
              element={
                <PublicOnly>
                  <SetupPage />
                </PublicOnly>
              }
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<PortalLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
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
