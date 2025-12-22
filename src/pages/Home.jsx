import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiCheckCircle, FiDollarSign, FiFileText } from "react-icons/fi";

/**
 * Home Component
 *
 * This is the landing page of the MentorPay application.
 * It displays a hero section, navigation, and feature highlights.
 * The content adapts based on whether a user is logged in or not.
 */
const Home = () => {
  // Destructuring user object from AuthContext to check authentication status
  const { user } = useAuth();

  /**
   * Features Array
   *
   * Contains the data for the three main feature cards displayed on the homepage.
   * Each feature has a title, description, and an associated icon component.
   */
  const features = [
    {
      title: "Session Tracking",
      description: "Easily track all mentor sessions with detailed breakdowns.",
      icon: FiCheckCircle, // Checkmark icon for tracking feature
    },
    {
      title: "Automated Payouts",
      description: "Calculate payouts automatically with tax considerations.",
      icon: FiDollarSign, // Dollar sign icon for payment feature
    },
    {
      title: "Transparent Receipts",
      description:
        "Generate and share detailed receipts with mentors instantly.",
      icon: FiFileText, // Document icon for receipts feature
    },
  ];

  return (
    // Main container with full screen height and responsive background colors for dark/light mode
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ==================== NAVIGATION BAR ==================== */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <div className="text-2xl font-bold text-blue-600 dark:text-white">
          MentorPay
        </div>

        {/* Navigation Links - Conditional rendering based on auth status */}
        <div className="space-x-4">
          {!user ? (
            // Show Login and Sign Up links when user is NOT authenticated
            <>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            // Show welcome message when user IS authenticated
            <span className="text-gray-600 dark:text-gray-300">
              Hi, {user.name}
            </span>
          )}
        </div>
      </nav>

      {/* ================ MAIN CONTENT AREA ================ */}
      <main className="container mx-auto px-4 py-16">
        {/* ========== HERO SECTION ========== */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            MentorPay Automation System
          </h1>

          {/* Subheadline/Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Streamline mentor payments with our secure, transparent, and
            efficient payout platform.
          </p>

          {/* ========== CALL-TO-ACTION BUTTONS ========== */}
          {/* Responsive flex container - stacks vertically on mobile, horizontal on larger screens */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {user ? (
              // If user is logged in, show dashboard link
              // Route changes based on user role (admin vs mentor)
              <Link
                to={
                  user.role === "admin"
                    ? "/admin/sessions" // Admin users go to sessions management
                    : "/mentor/dashboard" // Mentors go to their dashboard
                }
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1"
              >
                Go to Dashboard
              </Link>
            ) : (
              // If user is NOT logged in, show signup and login buttons
              <>
                {/* Primary CTA - Sign Up Button */}
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  Get Started Free
                </Link>

                {/* Secondary CTA - Login Button (outlined style) */}
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 border-2 border-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Login to Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ================ FEATURES GRID SECTION ================ */}
        {/* Responsive grid: 1 column on mobile, 3 columns on medium+ screens */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Map through features array to render each feature card */}
          {features.map((feature) => (
            <div
              key={feature.title} // Using title as unique key for React list rendering
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
            >
              {/* Icon Container - Styled circular background with icon */}
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-6">
                {/* Dynamically render the icon component from features array */}
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Feature Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
