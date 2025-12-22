/**
 * Signup Component
 *
 * @description User registration page with role selection and form validation
 * @module pages/Signup
 * @requires react, react-router-dom, react-icons
 *
 * Features:
 * - Full name, email, password input fields
 * - Role selection (Mentor/Admin)
 * - Password visibility toggle
 * - Form validation with error handling
 * - Loading states with visual feedback
 * - Dark mode support
 * - Redirect to login on successful registration
 */

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBriefcase,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Signup = () => {
  // ==================== Hooks ====================
  const { signup } = useAuth();
  const navigate = useNavigate();

  // ================= State Management ==================

  /**
   * Form data state object containing all input fields
   * @property {string} name - User's full name
   * @property {string} email - User's email address
   * @property {string} password - User's password (min 6 characters)
   * @property {string} role - User role ('mentor' or 'admin')
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentor", // Default role for new signups
  });

  // UI control states
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [error, setError] = useState(""); // Error message display
  const [loading, setLoading] = useState(false); // Loading state for submit button

  // ================== Event Handlers ==================

  /**
   * Handles input field changes and updates form state
   * Clears any existing error messages on new input
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on new input
  };

  /**
   * Handles form submission for user registration
   * Validates input fields before sending signup request
   * Redirects to login page on successful registration
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== Input Validation =====

    // Check for empty required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Enforce minimum password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ===== Signup Process =====

    // Clear previous errors and set loading state
    setError("");
    setLoading(true);

    try {
      // Attempt to create user account
      await signup(formData);

      // Redirect to login with success message on successful signup
      navigate("/login", {
        state: {
          message: "Account created successfully! Please login.",
        },
      });
    } catch (err) {
      // Handle specific error messages from backend if available
      // Falls back to generic message if no specific error provided
      setError(
        err.response?.data?.message ||
          "Failed to create an account. Please try again."
      );
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  // ================== Render ==================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* ========== Header Section ========== */}
        <div className="text-center mb-8">
          {/* Gradient icon container */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>

        {/* ========== Error Alert ========== */}
        {/* Displays validation or server errors */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
            {/* Error icon indicator */}
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-300 text-sm font-bold">
                  !
                </span>
              </div>
            </div>
            <p className="ml-3 text-red-700 dark:text-red-300 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* ========== Signup Form ========== */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ----- Name Input Field ----- */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              {/* User icon */}
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ----- Email Input Field ----- */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative">
              {/* Mail icon */}
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ----- Password Input Field with Visibility Toggle ----- */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              {/* Lock icon */}
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {/* Password visibility toggle button */}
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {/* Password requirement hint */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Must be at least 6 characters
            </p>
          </div>

          {/* ----- Role Selection Dropdown ----- */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              I want to join as a
            </label>
            <div className="relative">
              {/* Briefcase icon */}
              <FiBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="role"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer dark:text-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="mentor">👨‍🏫 Mentor</option>
                <option value="admin">⚙️ Admin</option>
              </select>
              {/* Custom dropdown arrow icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ----- Submit Button with Loading State ----- */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none cursor-pointer"
          >
            {loading ? (
              // Loading spinner animation
              <div className="flex items-center justify-center">
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
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* ========== Terms and Conditions ========== */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our{" "}
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Privacy Policy
          </a>
        </p>

        {/* ========== Login Redirect Link ========== */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
