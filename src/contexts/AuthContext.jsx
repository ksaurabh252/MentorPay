import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// AUTHENTICATION CONTEXT
// This module provides authentication state management for the
// entire application. It handles login, signup, logout, and
// password reset functionality using localStorage for persistence.

/**
 * Create the Authentication Context
 * This will be used to share auth state across all components
 */
export const AuthContext = createContext();

// ============================================================
// ROLE-BASED PERMISSIONS CONFIGURATION

/**
 * Generates permission object based on user role
 * Defines what actions each role can perform in the application
 *
 * @param {string} role - User role ('admin', 'mentor', etc.)
 * @returns {Object} - Permission configuration object
 *
 * Permission Structure:
 * - sessions: Controls session management access
 * - receipts: Controls receipt generation/viewing
 * - taxes: Controls tax modification access (admin only)
 * - audit: Controls audit log visibility
 */
const getRolePermissions = (role) => ({
  sessions: {
    create: ["admin", "mentor"].includes(role), // Only admin and mentor can create
    view: true, // Everyone can view
  },
  receipts: {
    generate: true, // All authenticated users can generate
    view: true, // All authenticated users can view
  },
  taxes: {
    modify: role === "admin", // Only admin can modify tax settings
    view: true, // Everyone can view
  },
  audit: {
    view_own: true, // Users can view their own audit logs
    view_all: role === "admin", // Only admin can view all audit logs
  },
});

// ============================================================
// AUTHENTICATION PROVIDER COMPONENT

/**
 * AuthProvider Component
 * Wraps the application and provides authentication context to all children
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const AuthProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---

  // Current authenticated user object (null if not logged in)
  const [user, setUser] = useState(null);

  // Loading state to prevent flash of unauthenticated content
  const [loading, setLoading] = useState(true);

  // Navigation hook for programmatic redirects
  const navigate = useNavigate();

  // --- INITIALIZATION EFFECT ---

  /**
   * Effect: Load user from localStorage on app initialization
   * Runs once on component mount to restore user session
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        // Attempt to retrieve stored user data
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          // Parse and set user state if data exists
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        // Handle corrupted JSON data gracefully
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user"); // Clear corrupted data
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    loadUser();
  }, []); // Empty dependency array = run once on mount

  // ========================================
  // AUTHENTICATION METHODS

  /**
   * LOGIN FUNCTION
   * Authenticates user with email and password
   * Supports both hardcoded demo accounts and registered users
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Authenticated user object
   * @throws {Error} - If credentials are invalid
   */
  const login = async (email, password) => {
    try {
      // Simulate network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ---------------------------------------------------------
      // STEP 1: Check Hardcoded Demo Users
      // These accounts always work for demonstration purposes
      // ---------------------------------------------------------

      // Demo Admin Account
      if (email === "admin@example.com" && password === "demo123") {
        const adminUser = {
          id: "1",
          name: "Admin User",
          email,
          role: "admin",
          isAdmin: true, // Convenience flag for admin checks
          isMentor: false,
        };
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        return adminUser;
      }

      // Demo Mentor Account
      if (email === "mentor@example.com" && password === "demo123") {
        const mentorUser = {
          id: "2",
          name: "Mentor User",
          email,
          role: "mentor",
          isAdmin: false,
          isMentor: true, // Convenience flag for mentor checks
        };
        setUser(mentorUser);
        localStorage.setItem("user", JSON.stringify(mentorUser));
        return mentorUser;
      }

      // ---------------------------------------------------------
      // STEP 2: Check Registered Users from LocalStorage
      // For users who signed up through the registration form
      // ---------------------------------------------------------

      // Retrieve all registered users
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Find user with matching email AND password
      const foundUser = storedUsers.find(
        (u) => u.email === email && u.password === password
      );

      // Throw error if no match found
      if (!foundUser) throw new Error("Invalid credentials");

      // Build user data object with convenience flags
      const userData = {
        ...foundUser,
        isAdmin: foundUser.role === "admin",
        isMentor: foundUser.role === "mentor",
      };

      // Update state and persist to localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      // Log error and re-throw for UI error handling
      console.error("Login error:", err);
      throw err;
    }
  };

  /**
   * SIGNUP FUNCTION
   * Registers a new user account
   *
   * @param {Object} formData - Registration form data
   * @param {string} formData.name - User's full name
   * @param {string} formData.email - User's email address
   * @param {string} formData.password - User's chosen password
   * @param {string} [formData.role='mentor'] - User's role (optional)
   * @returns {Promise<boolean>} - True if registration successful
   * @throws {Error} - If email already exists
   *
   * ⚠️ SECURITY NOTE: This stores passwords in plain text!
   * In a real application, NEVER store plain text passwords.
   * Use proper hashing (bcrypt, argon2) on the server side.
   */
  const signup = async (formData) => {
    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ---------------------------------------------------------
    // Validation: Check for duplicate email addresses
    // ---------------------------------------------------------
    if (users.some((u) => u.email === formData.email)) {
      throw new Error("Email already exists. Please login.");
    }

    // ---------------------------------------------------------
    // Create new user object with generated ID and timestamp
    // ---------------------------------------------------------
    const newUser = {
      id: Date.now().toString(), // Unique ID based on timestamp
      name: formData.name,
      email: formData.email,
      password: formData.password, // ⚠️ Plain text - not secure!
      role: formData.role || "mentor", // Default role is mentor
      createdAt: new Date().toISOString(), // Registration timestamp
    };

    // Add new user to array and persist to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return true; // Indicate successful registration
  };

  /**
   * RESET PASSWORD FUNCTION
   * Simulates password reset email functionality
   * In a real app, this would send an actual email with a reset link
   *
   * @param {string} email - Email address to send reset link to
   * @returns {Promise<void>} - Resolves if email exists
   * @throws {Error} - If email is not found in the system
   */
  const resetPassword = async (email) => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Get all registered users
          const users = JSON.parse(localStorage.getItem("users")) || [];

          // Check if user exists in localStorage OR is a demo account
          const userExists =
            users.some((u) => u.email === email) ||
            email === "admin@example.com" ||
            email === "mentor@example.com";

          // Resolve or reject based on user existence
          userExists ? resolve() : reject(new Error("Email not found"));
        } catch (error) {
          reject(new Error("Failed to access user data"));
        }
      }, 1000);
    });
  };

  /**
   * LOGOUT FUNCTION
   * Clears user session and redirects to home page
   */
  const logout = () => {
    // Clear user state
    setUser(null);

    // Remove persisted user data
    localStorage.removeItem("user");

    // Redirect to home/login page
    navigate("/");
  };

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  /**
   * Context value object containing all auth state and methods
   * This is what consuming components will access via useAuth()
   */
  const value = {
    // --- State ---
    user, // Current user object (null if not authenticated)
    loading, // Loading state for initial auth check

    // --- Methods ---
    login, // Login function
    logout, // Logout function
    signup, // Registration function
    resetPassword, // Password reset function

    // --- Computed Values ---
    permissions: user ? getRolePermissions(user.role) : null, // Role-based permissions

    // --- Utility Methods ---
    /**
     * Safely retrieves user from localStorage with error handling
     * Useful for components that need user data outside of React lifecycle
     * @returns {Object|null} - User object or null if not found/invalid
     */
    getSafeUser: () => {
      try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error("Failed to parse user data:", error);
        return null;
      }
    },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children after loading is complete
          This prevents flash of unauthenticated content */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK FOR CONSUMING AUTH CONTEXT
// ============================================================

/**
 * useAuth Hook
 * Custom hook for accessing authentication context
 * Provides type safety and ensures proper usage within AuthProvider
 *
 * @returns {Object} - Auth context value (user, login, logout, etc.)
 * @throws {Error} - If used outside of AuthProvider
 *
 * @example
 * // In a component:
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Ensure hook is used within AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthProvider;
