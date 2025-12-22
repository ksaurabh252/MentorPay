/**
 * DashboardLayout Component
 *
 * A protected layout wrapper that provides:
 * - Authentication and authorization checks
 * - Role-based navigation sidebar
 * - Consistent header and layout structure
 * - Test mode banner display
 *
 * @param {Object} props - Component props
 * @param {string[]} props.allowedRoles - Array of roles permitted to access this layout
 */

import { Outlet, Navigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../common/Header";
import TestModeBanner from "../common/TestModeBanner";
import { useTestMode } from "../../contexts/TestModeContext";
import {
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiSettings,
  FiPlusCircle,
} from "react-icons/fi";

const DashboardLayout = ({ allowedRoles = [] }) => {
  // ============================================
  // HOOKS & CONTEXT
  // ============================================

  // Get current user and loading state from auth context
  const { user, loading } = useAuth();

  // Get test mode status for displaying warning banner
  const { testMode } = useTestMode();

  // Get current location for redirect state preservation
  const location = useLocation();

  // ============================================
  // ACCESS CONTROL CHECKS
  // ============================================

  /**
   * Step 1: Loading State
   * Show loading indicator while authentication status is being determined
   * This prevents flash of unauthorized content
   */
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  /**
   * Step 2: Authentication Check
   * Redirect unauthenticated users to login page
   * Preserves the attempted URL for post-login redirect
   */
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * Step 3: Role Permission Check
   * Verify user has required role to access this layout
   * Redirects to unauthorized page if role doesn't match
   */
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ============================================
  // NAVIGATION CONFIGURATION
  // ============================================

  /**
   * Admin Navigation Links
   * Links displayed in sidebar for admin users
   * Each link contains: path, display label, and icon component
   */
  const adminLinks = [
    { path: "/admin/sessions", label: "Sessions", icon: FiCalendar },
    { path: "/admin/payouts", label: "Payouts", icon: FiDollarSign },
    { path: "/admin/taxes", label: "Tax Config", icon: FiSettings },
    { path: "/admin/audit-logs", label: "Audit Logs", icon: FiActivity },
  ];

  /**
   * Mentor Navigation Links
   * Links displayed in sidebar for mentor users
   */
  const mentorLinks = [
    { path: "/mentor/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/mentor/sessions/new", label: "New Session", icon: FiPlusCircle },
  ];

  // Select appropriate navigation links based on user's role
  const links = user.role === "admin" ? adminLinks : mentorLinks;

  // ============================================
  // COMPONENT RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* ----------------------------------------
          TOP HEADER SECTION
          Contains logo, user menu, theme toggle, etc.
      ---------------------------------------- */}
      <Header />

      {/* ----------------------------------------
          TEST MODE WARNING BANNER
          Only displayed when application is in test mode
          Alerts users that they're not in production
      ---------------------------------------- */}
      {testMode && <TestModeBanner />}

      {/* ----------------------------------------
          MAIN LAYOUT CONTAINER
          Flex container for sidebar + content area
          Uses container class for max-width constraint
      ---------------------------------------- */}
      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6">
        {/* ----------------------------------------
            SIDEBAR NAVIGATION (LEFT SIDE)
            - Fixed width of 64 (256px)
            - Hidden on mobile (md:block)
            - Sticky positioning for scroll behavior
        ---------------------------------------- */}
        <aside className="w-64 hidden md:block flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-6">
            {/* Sidebar Header */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Menu
            </h3>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  // Dynamic className based on active state
                  // NavLink provides isActive boolean for styling
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? // Active link styles (highlighted)
                          "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        : // Inactive link styles (default + hover)
                          "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {/* Link Icon - rendered dynamically from config */}
                  <link.icon className="mr-3 h-5 w-5" />
                  {/* Link Label Text */}
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* ----------------------------------------
            MAIN CONTENT AREA (RIGHT SIDE)
            - flex-1: Takes remaining horizontal space
            - min-w-0: Prevents flex item from overflowing
            - Outlet renders nested route components
        ---------------------------------------- */}
        <main className="flex-1 min-w-0">
          {/* Renders child routes defined in router config */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
