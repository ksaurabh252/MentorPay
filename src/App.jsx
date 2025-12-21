import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Contexts
import AuthProvider from "./contexts/AuthContext";
import { AuditLogProvider } from "./contexts/AuditLogContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { TaxProvider } from "./contexts/TaxContext";
import { TestModeProvider } from "./contexts/TestModeContext";

// Layouts
import DashboardLayout from "./components/layouts/DashboardLayout";
import AuthLayout from "./components/layouts/AuthLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";

// Admin Pages
import AdminSessions from "./pages/Admin/Sessions";
import AdminPayouts from "./pages/Admin/AdminPayouts";
import TaxAdminPage from "./pages/Admin/TaxAdminPage";
import AuditLogs from "./pages/Admin/AuditLogs";

// Mentor Pages
import MentorDashboard from "./components/dashboard/MentorDashboard";
import MentorSessionForm from "./pages/Mentor/MentorSessionForm";

function App() {
  return (
    <TaxProvider>
      <TestModeProvider>
        <DarkModeProvider>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Public Route */}
                <Route path="/" element={<Home />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Authentication Routes (No Header) */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ResetPassword />} />
                </Route>

                {/* --- PROTECTED ROUTES START HERE --- */}

                {/* Admin Routes (Only for 'admin' role) */}
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

                {/* Mentor Routes (Only for 'mentor' role) */}
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

                {/* Fallback for unknown routes */}
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
