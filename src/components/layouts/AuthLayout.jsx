import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * AuthLayout Component
 *
 * A layout wrapper for authentication pages (login, register, etc.)
 * Handles redirection for already authenticated users.
 */
const AuthLayout = () => {
  // Get the current user from auth context
  const { user } = useAuth();

  // If user is already logged in, redirect them to their appropriate dashboard
  // Admin users go to admin sessions page, mentors go to mentor dashboard
  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/sessions" : "/mentor/dashboard"}
        replace // Replace current history entry to prevent back navigation to auth pages
      />
    );
  }

  // If no user is logged in, render the auth page content
  // Centered layout with responsive background colors for light/dark mode
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Outlet renders the child route components (Login, Register, etc.) */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
