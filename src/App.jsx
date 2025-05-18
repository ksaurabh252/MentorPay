// app.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import AuthProvider from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import AdminSessions from './pages/Admin/Sessions';
import AdminPayouts from './pages/Admin/Payouts';
import MentorDashboard from './pages/Mentor/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header'; // Import the Header

function App() {
  return (
    <Router>
      <DarkModeProvider>
        <AuthProvider>
          <Header />
          <Routes>
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
            <Route path="/admin/sessions" element={<ProtectedRoute><AdminSessions /></ProtectedRoute>} />
            <Route path="/admin/payouts" element={<ProtectedRoute><AdminPayouts /></ProtectedRoute>} />
            <Route path="/mentor/dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </DarkModeProvider>
    </Router>
  );
}

export default App;