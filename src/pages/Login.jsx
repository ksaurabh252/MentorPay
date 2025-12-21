import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

/**
 * Login Component
 *
 * A comprehensive login form with the following features:
 * - Email and password authentication
 * - Password visibility toggle
 * - Remember me functionality
 * - Demo credentials for testing
 * - Form validation and error handling
 * - Dark/light theme support
 * - Responsive design
 */
const Login = () => {
  // ===== STATE MANAGEMENT =====

  // Form input states
  const [email, setEmail] = useState(""); // User's email address
  const [password, setPassword] = useState(""); // User's password
  const [showPassword, setShowPassword] = useState(false); // Controls password visibility toggle
  const [rememberMe, setRememberMe] = useState(false); // Remember me checkbox state

  // UI state management
  const [error, setError] = useState(""); // Error messages for display
  const [loading, setLoading] = useState(false); // Loading state during authentication

  // ===== HOOKS AND CONTEXT =====

  // Get location state to check for redirect messages (e.g., "Please log in to continue")
  const location = useLocation();
  const redirectMessage = location.state?.message; // Message passed from previous route

  // Authentication context and navigation
  const { login } = useAuth(); // Login function from AuthContext
  const navigate = useNavigate(); // Navigation hook for programmatic routing

  // ===== EVENT HANDLERS =====

  /**
   * Handle form submission
   * Validates inputs, attempts login, and handles success/error states
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Clear any previous error messages
    setError("");

    // ===== FORM VALIDATION =====

    // Check for empty fields
    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate minimum password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Set loading state for UI feedback
    setLoading(true);

    try {
      // ===== AUTHENTICATION ATTEMPT =====

      // Call login function from AuthContext (likely Firebase or similar)
      await login(email, password);

      // ===== POST-LOGIN LOGIC =====

      // Handle "remember me" functionality
      if (rememberMe) {
        // Store remember preference in localStorage
        // Note: In production, consider more secure storage methods
        localStorage.setItem("rememberMe", "true");
      }

      // Navigate to dashboard after successful login
      // TODO: Implement redirect to originally requested page
      navigate("/dashboard");
    } catch (err) {
      // ===== ERROR HANDLING =====

      // Handle specific authentication errors with user-friendly messages
      switch (err.code || err.message) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        default:
          setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      // Always reset loading state regardless of success/failure
      setLoading(false);
    }
  };

  /**
   * Reset form to initial state
   * Clears all form fields and error messages
   */
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setRememberMe(false);
  };

  /**
   * Fill form with demo credentials for testing
   * @param {string} role - The role type ('mentor' or 'admin')
   */
  const fillDemoCredentials = (role) => {
    if (role === "mentor") {
      setEmail("mentor@example.com");
      setPassword("demo123");
    } else if (role === "admin") {
      setEmail("admin@example.com");
      setPassword("demo123");
    }
    setError(""); // Clear any existing error messages
  };

  // ===== COMPONENT RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Main Login Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your MentorPay account
          </p>

          {/* Success message from redirect (e.g., after successful signup) */}
          {redirectMessage && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm">
                {redirectMessage}
              </p>
            </div>
          )}
        </div>

        {/* Error Display Section */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start animate-fade-in">
            {/* Error icon */}
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-300 text-sm font-bold">
                  !
                </span>
              </div>
            </div>
            {/* Error message content */}
            <div className="ml-3">
              <p className="text-red-700 dark:text-red-300 font-medium">
                Login Failed
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Demo Credentials Section - Remove this section in production */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Try demo accounts:
          </p>
          <div className="flex space-x-3">
            {/* Mentor demo button */}
            <button
              onClick={() => fillDemoCredentials("mentor")}
              className="flex-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 border border-blue-200 dark:border-blue-800"
            >
              Mentor
            </button>
            {/* Admin demo button */}
            <button
              onClick={() => fillDemoCredentials("admin")}
              className="flex-1 px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-200 border border-purple-200 dark:border-purple-800"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              {/* Email icon */}
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              {/* Email input field */}
              <input
                type="email"
                required
                autoComplete="username" // Browser autofill hint
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear errors when user starts typing
                }}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-2">
            {/* Password label and forgot password link */}
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative group">
              {/* Lock icon */}
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />

              {/* Password input field */}
              <input
                type={showPassword ? "text" : "password"} // Toggle between text/password
                required
                autoComplete="current-password" // Browser autofill hint
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear errors when user starts typing
                }}
              />

              {/* Password visibility toggle button */}
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Form Options (Remember Me & Clear Form) */}
          <div className="flex items-center justify-between">
            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            {/* Clear form button */}
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
            >
              Clear form
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password} // Disable when loading or fields empty
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg group"
          >
            {loading ? (
              // Loading state with spinner
              <div className="flex items-center justify-center">
                {/* Animated loading spinner */}
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in...
              </div>
            ) : (
              // Normal state with icon and text
              <div className="flex items-center justify-center cursor-pointer">
                <FiLogIn className="mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                Sign In
              </div>
            )}
          </button>
        </form>

        {/* Sign Up Link Section */}
        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
