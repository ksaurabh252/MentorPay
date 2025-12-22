/**
 * ResetPassword Component
 *
 * @description Handles user password reset functionality with email verification
 * @module pages/ResetPassword
 * @requires react, react-router-dom, react-icons
 *
 * Features:
 * - Email-based password reset
 * - Password confirmation validation
 * - Show/hide password toggle
 * - Loading states with visual feedback
 * - Role-based redirect for authenticated users
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiLock,
  FiMail,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const ResetPassword = () => {
  // ==================== Hooks ====================
  const { user } = useAuth();
  const navigate = useNavigate();

  // ==================== State Management ====================

  // Form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI control states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Status message state: { type: 'error' | 'success', message: string }
  const [status, setStatus] = useState({ type: "", message: "" });

  // ==================== Auth Guard ====================
  /**
   * Redirect authenticated users to their respective dashboards
   * Prevents access to reset password page when already logged in
   */
  if (user) {
    navigate(user.role === "admin" ? "/admin/dashboard" : "/mentor/dashboard");
    return null;
  }

  // ==================== Validation ====================
  /**
   * Validates form inputs before submission
   * @returns {string} Error message if validation fails, empty string if valid
   */
  const validateForm = () => {
    // Check for valid email format
    if (!email.includes("@")) return "Please enter a valid email";

    // Enforce minimum password length
    if (password.length < 6) return "Password must be at least 6 characters";

    // Ensure password confirmation matches
    if (password !== confirmPassword) return "Passwords don't match";

    return ""; // All validations passed
  };

  // ==================== Form Submission ====================
  /**
   * Handles form submission for password reset
   * Updates user password in localStorage after validation
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    const error = validateForm();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    // Set loading state and clear previous status
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Simulate API call delay (replace with actual API in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Retrieve existing users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Find user by email
      const userIndex = users.findIndex((u) => u.email === email);

      // Handle case when email is not found
      if (userIndex === -1) {
        throw new Error("Email not found");
      }

      // Update password for the found user
      users[userIndex].password = password;
      localStorage.setItem("users", JSON.stringify(users));

      // Show success message and redirect to login
      setStatus({
        type: "success",
        message: "Password updated! Redirecting to login...",
      });

      // Delay redirect to allow user to see success message
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      // Handle and display error message
      setStatus({
        type: "error",
        message: error.message || "Something went wrong",
      });
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  // ==================== Render ====================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* ========== Page Header ========== */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
        </div>

        {/* ========== Status Alert (Error/Success Messages) ========== */}
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              status.type === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            {/* Conditional icon based on status type */}
            {status.type === "error" ? (
              <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <FiCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                status.type === "error" ? "text-red-700" : "text-green-700"
              }`}
            >
              {status.message}
            </p>
          </div>
        )}

        {/* ========== Main Form Card ========== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ----- Email Input Field ----- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                {/* Email icon */}
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* ----- New Password Input Field ----- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New password
              </label>
              <div className="relative">
                {/* Lock icon */}
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="At least 6 characters"
                  required
                />
                {/* Password visibility toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ----- Confirm Password Input Field ----- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                {/* Lock icon */}
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Re-enter your password"
                  required
                />
              </div>
            </div>

            {/* ----- Submit Button with Loading State ----- */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow cursor-pointer"
            >
              {loading ? (
                // Loading spinner animation
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                  Resetting password...
                </div>
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          {/* ========== Back to Login Link ========== */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <FiArrowLeft className="mr-2" />
              Back to login
            </Link>
          </div>
        </div>

        {/* ========== Support Link Footer ========== */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?
          <a href="/support" className="text-blue-600 hover:text-blue-700">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
