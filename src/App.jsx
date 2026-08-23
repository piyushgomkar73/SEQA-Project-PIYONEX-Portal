import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Clients from './pages/clients/Clients';
import AddClient from './pages/clients/AddClient';
import ClientDetail from './pages/clients/ClientDetail';
import Onboarding from './pages/onboarding/Onboarding';
import Tasks from './pages/tasks/Tasks';
import Instances from './pages/instances/Instances';
import Configuration from './pages/configuration/Configuration';
import UsersPage from './pages/users/Users';
import ActivityLogs from './pages/logs/Logs';
import Reports from './pages/reports/Reports';
import SettingsPage from './pages/settings/Settings';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppProvider>
          <HashRouter>
            <Routes>
              {/* Public Login Route */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected Portal Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/new" element={<AddClient />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="instances" element={<Instances />} />
                <Route path="configuration" element={<Configuration />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="logs" element={<ActivityLogs />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            <ToastContainer />
          </HashRouter>
        </AppProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
