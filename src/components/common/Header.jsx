import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DarkModeToggle from "../../components/common/DarkModeToggle";
import { FiLogOut } from "react-icons/fi";

/**
 * Header Component
 *
 * Main navigation header for the application featuring:
 * - Logo/brand with navigation to home
 * - Dark mode toggle
 * - User authentication state display
 * - Login/logout functionality
 * - Responsive design (mobile-friendly)
 * - Role-based user information display
 */
const Header = () => {
  // Get current user and logout function from authentication context
  const { user, logout } = useAuth();

  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  /**
   * Handle user logout
   * Logs out the user and redirects to login page
   */
  const handleLogout = () => {
    logout(); // Clear user session
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo and Brand Section */}
        <Link to="/" className="flex items-center gap-2 group">
          {/* Circular logo with initials */}
          <div className="bg-blue-600 text-white p-1.5 rounded font-bold text-lg group-hover:bg-blue-700 transition-colors">
            MP
          </div>
          {/* Brand name */}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            MentorPay
          </span>
        </Link>

        {/* Right Side Navigation Actions */}
        <div className="flex items-center gap-4">
          {/* Dark/Light Mode Toggle */}
          <DarkModeToggle />

          {user ? (
            /* Authenticated User Section */
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              {/* User Information - Hidden on small screens for mobile optimization */}
              <div className="hidden sm:flex flex-col items-end">
                {/* Display user name or fallback to "User" */}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name || "User"}
                </span>
                {/* User role badge with styling */}
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>

              {/* Logout Button with Icon */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-md transition-colors"
                title="Logout" // Tooltip for accessibility
              >
                <FiLogOut className="h-4 w-4" />
                {/* Logout text - hidden on mobile screens */}
                <span className="hidden md:inline cursor-pointer">Logout</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated User Section */
            <div className="flex items-center gap-3">
              {/* Login Link - styled as text link */}
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1"
              >
                Login
              </Link>
              {/* Sign Up Link - styled as primary button */}
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
