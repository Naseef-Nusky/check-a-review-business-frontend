import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PortalLayout from './layouts/PortalLayout'
import LoginPage from './pages/LoginPage'
import SetupPage from './pages/SetupPage'
import DashboardPage from './pages/DashboardPage'
import PlaceholderPage from './pages/PlaceholderPage'

function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
              <Route index element={<DashboardPage />} />
              <Route
                path="profile"
                element={<PlaceholderPage title="Company profile" description="Update your public business details." />}
              />
              <Route
                path="reviews"
                element={<PlaceholderPage title="Reviews" description="Read and reply to customer reviews." />}
              />
              <Route
                path="invitations"
                element={<PlaceholderPage title="Invitations" description="Invite customers to leave feedback." />}
              />
              <Route
                path="analytics"
                element={<PlaceholderPage title="Analytics" description="Track ratings and trust trends." />}
              />
              <Route
                path="widget"
                element={<PlaceholderPage title="Widget" description="Embed reviews on your website." />}
              />
              <Route
                path="settings"
                element={<PlaceholderPage title="Settings" description="Manage account and notification preferences." />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
