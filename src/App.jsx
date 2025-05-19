import './App.css'
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

function App() {
  const [testMode, setTestMode] = useState(false);
  return (
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
                    <AdminPayouts testMode={testMode} setTestMode={setTestMode} />
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
            </Routes>
          </AuthProvider>

        </DarkModeProvider>
      </Router>
    </TestModeProvider>
  );
}

export default App;
