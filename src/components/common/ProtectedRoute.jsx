import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  inverse = false,
  redirectPath = "/",
  unauthorizedPath = "/unauthorized",
  mentorRedirect = "/mentor/dashboard"

}) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // For routes that should only be accessible when NOT logged in (login/signup)
  if (inverse) {
    return user ? <Navigate to={redirectPath} replace /> : children;
  }

  // If no user is logged in, redirect to login with return location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect mentors trying to access admin routes
  if (location.pathname.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to={mentorRedirect} replace />;
  }

  // Check if route has role requirements and user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
