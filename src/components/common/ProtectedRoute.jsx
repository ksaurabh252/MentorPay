
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], inverse = false }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if (inverse) {

    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;