import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ===== CONTEXT PROVIDERS =====
// Global state management for various application features
import AuthProvider from "./contexts/AuthContext"; // Authentication state and user management
import { AuditLogProvider } from "./contexts/AuditLogContext"; // Audit logging for admin actions
import { DarkModeProvider } from "./contexts/DarkModeContext"; // Theme switching (light/dark mode)
import { TaxProvider } from "./contexts/TaxContext"; // Tax calculation and management
import { TestModeProvider } from "./contexts/TestModeContext"; // Test/demo mode functionality

// ===== LAYOUT COMPONENTS =====
// Wrapper components that provide consistent UI structure
import DashboardLayout from "./components/layouts/DashboardLayout"; // Layout for authenticated pages with navigation
import AuthLayout from "./components/layouts/AuthLayout"; // Layout for authentication pages (login/signup)

// ===== PUBLIC PAGES =====
// Pages accessible without authentication
import Home from "./pages/Home"; // Landing/home page
import Login from "./pages/Login"; // User login page
import Signup from "./pages/Signup"; // User registration page
import ResetPassword from "./pages/ResetPassword"; // Password reset page
import Unauthorized from "./pages/Unauthorized"; // Access denied page

// ===== ADMIN PAGES =====
// Pages restricted to admin role only
import AdminSessions from "./pages/Admin/Sessions"; // Session management for admins
import AdminPayouts from "./pages/Admin/AdminPayouts"; // Payout processing and history
import TaxAdminPage from "./pages/Admin/TaxAdminPage"; // Tax configuration and reporting
import AuditLogs from "./pages/Admin/AuditLogs"; // System audit trail viewer

// ===== MENTOR PAGES =====
// Pages restricted to mentor role only
import MentorDashboard from "./components/dashboard/MentorDashboard"; // Mentor's main dashboard
import MentorSessionForm from "./pages/Mentor/MentorSessionForm"; // Form to create new mentoring sessions

/**
 * Main Application Component
 *
 * Handles routing and global state management through context providers.
 * Implements role-based access control for different user types.
 *
 * Context Provider Hierarchy (outer to inner):
 * 1. TaxProvider - Tax calculations and settings
 * 2. TestModeProvider - Demo/test functionality
 * 3. DarkModeProvider - UI theme management
 * 4. Router - React Router navigation
 * 5. AuthProvider - Authentication and user state
 */
function App() {
  return (
    <TaxProvider>
      <TestModeProvider>
        <DarkModeProvider>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Public Routes - accessible without authentication */}
                <Route path="/" element={<Home />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Authentication Routes (No main navigation) */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ResetPassword />} />
                </Route>

                {/* Admin Routes (admin role only) */}
                <Route element={<DashboardLayout allowedRoles={["admin"]} />}>
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/sessions" replace />}
                  />
                  <Route path="/admin/sessions" element={<AdminSessions />} />
                  <Route path="/admin/payouts" element={<AdminPayouts />} />
                  <Route path="/admin/taxes" element={<TaxAdminPage />} />
                  <Route
                    path="/admin/audit-logs"
                    element={
                      <AuditLogProvider>
                        <AuditLogs />
                      </AuditLogProvider>
                    }
                  />
                </Route>

                {/* Mentor Routes (mentor role only) */}
                <Route element={<DashboardLayout allowedRoles={["mentor"]} />}>
                  <Route
                    path="/mentor/dashboard"
                    element={<MentorDashboard />}
                  />
                  <Route
                    path="/mentor/sessions/new"
                    element={<MentorSessionForm />}
                  />
                </Route>

                {/* Fallback route for unknown URLs */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AuthProvider>
          </Router>
        </DarkModeProvider>
      </TestModeProvider>
    </TaxProvider>
  );
}

export default App;
