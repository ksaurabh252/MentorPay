import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm text-white transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white dark:text-white">
          MentorPay
        </Link>
        {user && (
          <div className="hidden md:flex gap-4">
            {user.role === "admin" && (
              <>
                <Link to="/admin/sessions" className="hover:text-blue-600">
                  Sessions
                </Link>
                <Link to="/admin/payouts" className="hover:text-blue-600">
                  Payouts
                </Link>
                <Link to="/admin/taxes" className="hover:text-blue-600">
                  Taxes
                </Link>
                <Link to="/admin/audit-logs" className="hover:text-blue-600">
                  Audit
                </Link>
              </>
            )}
            <Link to="/mentor/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/mentor/sessions/new" className="hover:text-blue-600">
              New Session
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
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
