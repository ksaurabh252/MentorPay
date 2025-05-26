import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import AuditLogs from "./pages/Admin/AuditLogs";
import AdminPayouts from "./pages/Admin/AdminPayouts";
import AdminSessions from "./pages/Admin/Sessions";
import Header from "./components/common/Header";
import MentorDashboard from "./components/dashboard/MentorDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import TestModeBanner from "./components/common/TestModeBanner";
import AuthProvider from "./contexts/AuthContext";
import { AuditLogProvider } from "./contexts/AuditLogContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { TaxProvider } from "./contexts/TaxContext";
import { TestModeProvider } from "./contexts/TestModeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MentorSessionForm from "./pages/Mentor/MentorSessionForm";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import TaxAdminPage from "./pages/Admin/TaxAdminPage";
import Unauthorized from "./pages/Unauthorized";


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
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={
                  <ProtectedRoute inverse>
                    <Login />
                  </ProtectedRoute>
                } />
                <Route path="/signup" element={
                  <ProtectedRoute inverse>
                    <Signup />
                  </ProtectedRoute>
                } />
                <Route path="/reset-password" element={
                  <ProtectedRoute inverse>
                    <ResetPassword />
                  </ProtectedRoute>
                } />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSessions />
                  </ProtectedRoute>
                } />
                <Route path="/admin/sessions" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSessions />
                  </ProtectedRoute>
                } />
                <Route path="/admin/payouts" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminPayouts testMode={testMode} setTestMode={setTestMode} />
                  </ProtectedRoute>
                } />
                <Route path="/admin/taxes" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <TaxAdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/audit-logs" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AuditLogProvider>
                      <AuditLogs />
                    </AuditLogProvider>
                  </ProtectedRoute>
                } />

                {/* Mentor routes */}
                <Route path="/mentor/dashboard" element={
                  <ProtectedRoute>
                    <MentorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/mentor/sessions/new" element={
                  <ProtectedRoute>
                    <MentorSessionForm />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={
                  <Navigate to={localStorage.getItem('user')?.role === 'admin' ? '/admin/sessions' : '/mentor/dashboard'} />
                } />
              </Routes>
            </AuthProvider>
          </DarkModeProvider>
        </Router>
      </TestModeProvider>
    </TaxProvider>
  );
}

export default App;