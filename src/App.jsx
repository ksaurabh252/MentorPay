import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import AuthProvider from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import AdminSessions from "./pages/Admin/Sessions";
import AdminPayouts from "./pages/Admin/AdminPayouts";

import MentorDashboard from "../src/components/dashboard/MentorDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Header from "./components/common/Header"; // Import the Header
import AuditLogs from "./pages/Admin/AuditLogs";
import { AuditLogProvider } from "./contexts/AuditLogContext";
import { useState } from "react";
import TestModeBanner from "./components/common/TestModeBanner";
import { TestModeProvider } from "./contexts/TestModeContext";
import { TaxProvider } from "./contexts/TaxContext";
import TaxAdminPage from "./pages/Admin/TaxAdminPage";
import MentorSessionForm from "./pages/Mentor/MentorSessionForm";

function App() {
  const [testMode, setTestMode] = useState(false);
  return (
    <TaxProvider>
      <TestModeProvider>
        <Router>
          <DarkModeProvider>
            <AuthProvider>
              <Header />
              {testMode && <TestModeBanner />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute inverse>
                      <Login />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <ProtectedRoute inverse>
                      <Signup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <ProtectedRoute inverse>
                      <ResetPassword />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/audit-logs"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AuditLogProvider>
                        <AuditLogs />
                      </AuditLogProvider>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sessions"
                  element={
                    <ProtectedRoute>
                      <AdminSessions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payouts"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminPayouts
                        testMode={testMode}
                        setTestMode={setTestMode}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/dashboard"
                  element={
                    <ProtectedRoute>
                      <MentorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/taxes"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TaxAdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/mentor/sessions/new" element={<MentorSessionForm />} />
              </Routes>
            </AuthProvider>
          </DarkModeProvider>
        </Router>
      </TestModeProvider>
    </TaxProvider>
  );
}

export default App;
