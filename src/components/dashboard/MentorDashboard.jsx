import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FiDownload, FiFilter, FiRefreshCw } from "react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";

// ============================================
// COMPONENT IMPORTS
// ============================================
// ReceiptPDF - PDF document component for generating session receipts
import ReceiptPDF from "../../components/receipts/ReceiptPDF";
// ExportButton - Reusable button for exporting data (CSV/Excel)
import ExportButton from "../../components/common/ExportButton";
// DataTable - Reusable table component for displaying tabular data
import DataTable from "../common/DataTable";

// ============================================
// UTILITY & SERVICE IMPORTS
// ============================================
// formatCurrency - Helper function to format numbers as currency (e.g., ₹1,000.00)
import { formatCurrency } from "../../utils/finance";
// getSessions - API service function to fetch session data
import { getSessions } from "../../services/mockApi";

/**
 * MentorDashboard Component
 *
 * Main dashboard for mentors to view and manage their sessions.
 * Features include:
 * - Session statistics (total sessions, payouts, average rate)
 * - Filtering by status and date range
 * - Data export functionality (CSV/Excel)
 * - Individual receipt download for each session
 * - Real-time data refresh capability
 *
 * @component
 * @example
 * // Used in routing configuration
 * <Route path="/mentor/dashboard" element={<MentorDashboard />} />
 */
const MentorDashboard = () => {
  // ============================================
  // HOOKS & CONTEXT
  // ============================================
  // Get current authenticated user from AuthContext
  const { user } = useAuth();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  /**
   * Filter state for session status
   * Options: "all" | "paid" | "pending" | "under_review"
   */
  const [filter, setFilter] = useState("all");

  /**
   * Date range state for filtering sessions
   * Default: Last 30 days from current date
   */
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(), // Today
  });

  /**
   * Loading state for API calls
   * Used to show loading indicators during data fetch
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sessions data array
   * Stores all sessions fetched from the API (filtered by user)
   */
  const [sessions, setSessions] = useState([]);

  // ============================================
  // DATA FETCHING FUNCTIONS
  // ============================================

  /**
   * Fetches session data from the API
   *
   * Process:
   * 1. Sets loading state to true
   * 2. Fetches all sessions from API
   * 3. Filters sessions based on user role:
   *    - Admin: Gets all sessions
   *    - Mentor: Gets only their own sessions (matched by name or ID)
   * 4. Updates sessions state with filtered data
   * 5. Handles errors and resets loading state
   *
   * @async
   * @function loadData
   */
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch all sessions from mock API
      const data = await getSessions();

      // Filter sessions based on user role
      // Note: In production, this filtering should be done server-side
      const userSessions =
        user.role === "admin"
          ? data // Admin sees all sessions
          : data.filter(
              (s) => s.mentorName === user.name || s.mentorId === user.id
            ); // Mentor sees only their sessions

      setSessions(userSessions);
    } catch (error) {
      console.error("Failed to load sessions", error);
      // TODO: Add user-facing error notification (toast/alert)
    } finally {
      // Always reset loading state, whether success or failure
      setIsLoading(false);
    }
  };

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Initial data fetch on component mount
   * Re-fetches when user changes (e.g., login/logout, role change)
   */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ============================================
  // FILTERING LOGIC
  // ============================================

  /**
   * Filtered sessions based on current filter criteria
   *
   * Filters applied:
   * 1. Date range filter - Sessions within selected start and end dates
   * 2. Status filter - Sessions matching selected status (or all)
   *
   * @type {Array} - Array of session objects matching all filter criteria
   */
  const filteredSessions = sessions.filter((session) => {
    // Convert session date string to Date object for comparison
    const sessionDate = new Date(session.sessionDate);

    // Check if session falls within selected date range
    const matchesDate =
      sessionDate >= dateRange.startDate && sessionDate <= dateRange.endDate;

    // Check if session matches selected status filter
    // "all" matches everything, otherwise exact status match required
    const matchesStatus = filter === "all" || session.status === filter;

    // Session must match BOTH date and status criteria
    return matchesDate && matchesStatus;
  });

  // ============================================
  // CALCULATED STATISTICS
  // ============================================

  /**
   * Total payout amount from all filtered sessions
   * Sums up the 'payout' field from each session
   * Handles cases where payout might be undefined or string
   */
  const totalPayout = filteredSessions.reduce(
    (sum, session) => sum + parseFloat(session.payout || 0),
    0 // Initial accumulator value
  );

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Refreshes session data from the API
   * Triggered by the refresh button in the header
   */
  const refreshData = () => {
    loadData(); // Re-fetch from "DB"
  };

  // ============================================
  // RECEIPT GENERATION
  // ============================================

  /**
   * Generates a PDF receipt download link for a specific session
   *
   * @param {string|number} sessionId - The ID of the session to generate receipt for
   * @returns {JSX.Element|null} - PDFDownloadLink component or null if session not found
   *
   * Receipt includes:
   * - Mentor name and date
   * - Session details (date, type, duration, payout)
   * - Financial breakdown (subtotal, deductions, total)
   * - Thank you message
   */
  const downloadReceipt = (sessionId) => {
    // Find the session in our data array
    const session = sessions.find((s) => s.id === sessionId);

    // Return null if session not found (prevents errors)
    if (!session) return null;

    // Prepare receipt data object for PDF generation
    const receiptData = {
      mentorName: user?.name || "Mentor",
      date: new Date().toLocaleDateString(), // Current date as receipt date
      sessions: [
        {
          date: new Date(session.sessionDate).toLocaleDateString(),
          type: session.sessionType,
          duration: session.duration,
          payout: Number(session.payout).toFixed(2),
        },
      ],
      subtotal: Number(session.payout).toFixed(2),
      // Deductions - currently set to zero (can be calculated based on business logic)
      deductions: { platformFee: "0.00", gst: "0.00", tds: "0.00" },
      total: Number(session.payout).toFixed(2),
      message: "Thank you for your contribution!",
    };

    // Return PDF download link component
    return (
      <PDFDownloadLink
        document={<ReceiptPDF receiptData={receiptData} />}
        fileName={`receipt_${sessionId}.pdf`}
      >
        {/* Render prop pattern - receives loading state from PDFDownloadLink */}
        {({ loading }) => (
          <span className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            <FiDownload /> {loading ? "..." : "Receipt"}
          </span>
        )}
      </PDFDownloadLink>
    );
  };

  // ============================================
  // TABLE COLUMN CONFIGURATION
  // ============================================

  /**
   * Column definitions for the DataTable component
   *
   * Each column object contains:
   * - header: Display text for column header
   * - render: Custom render function for cell content
   *
   * Note: Using render functions instead of accessorKey
   * for custom formatting of all columns
   */
  const columns = [
    // Date column - Formats ISO date string to locale date
    {
      header: "Date",
      render: (row) => new Date(row.sessionDate).toLocaleDateString(),
    },

    // Session type column - Capitalizes first letter
    {
      header: "Type",
      render: (row) => <span className="capitalize">{row.sessionType}</span>,
    },

    // Duration column - Appends "mins" suffix
    {
      header: "Duration",
      render: (row) => `${row.duration} mins`,
    },

    // Hourly rate column - Formats as currency with "/hr" suffix
    {
      header: "Rate",
      render: (row) => `${formatCurrency(row.ratePerHour)}/hr`,
    },

    // Payout column - Formats as currency
    {
      header: "Payout",
      render: (row) => formatCurrency(row.payout),
    },

    // Status column - Renders colored badge based on status
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            // Conditional styling based on status value
            row.status === "paid"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" // Green for paid
              : row.status === "pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" // Yellow for pending
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" // Blue for under_review/other
          }`}
        >
          {/* Replace underscores with spaces for display (e.g., "under_review" -> "under review") */}
          {row.status ? row.status.replace("_", " ") : "Unknown"}
        </span>
      ),
    },
  ];

  // ============================================
  // COMPONENT RENDER
  // ============================================
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ----------------------------------------
          HEADER SECTION
          Contains welcome message and refresh button
      ---------------------------------------- */}
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        {/* Welcome message with user's name */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Welcome, {user?.name || "Mentor"}
        </h1>

        {/* Refresh data button with loading state */}
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
        >
          {/* Spin animation when loading */}
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* ----------------------------------------
          STATISTICS CARDS SECTION
          Displays key metrics: Total Sessions, Total Payout, Average Rate
      ---------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sessions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Total Sessions
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {filteredSessions.length}
          </p>
        </div>

        {/* Total Payout Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Total Payout
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(totalPayout)}
          </p>
        </div>

        {/* Average Rate Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Avg. Rate
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {/* Calculate average only if there are sessions, otherwise show ₹0.00 */}
            {filteredSessions.length > 0
              ? formatCurrency(totalPayout / filteredSessions.length) + "/hr"
              : "₹0.00/hr"}
          </p>
        </div>
      </div>

      {/* ----------------------------------------
          FILTERS SECTION
          Contains status dropdown and date range pickers
      ---------------------------------------- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            {/* Start Date Input */}
            <input
              type="date"
              value={dateRange.startDate.toISOString().split("T")[0]} // Convert Date to YYYY-MM-DD format
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  startDate: new Date(e.target.value),
                })
              }
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <span className="mx-2 text-gray-500">to</span>
            {/* End Date Input */}
            <input
              type="date"
              value={dateRange.endDate.toISOString().split("T")[0]} // Convert Date to YYYY-MM-DD format
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  endDate: new Date(e.target.value),
                })
              }
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* ----------------------------------------
          EXPORT BUTTONS SECTION
          Provides CSV and Excel export functionality
      ---------------------------------------- */}
      <div className="flex justify-end mb-4 gap-2">
        {/* CSV Export Button */}
        <ExportButton
          data={filteredSessions}
          fileName="my_sessions"
          fileType="csv"
        />
        {/* Excel Export Button */}
        <ExportButton
          data={filteredSessions}
          fileName="my_sessions"
          fileType="excel"
        />
      </div>

      {/* ----------------------------------------
          DATA TABLE SECTION
          Displays session data with actions column
          Shows loading state while fetching data
      ---------------------------------------- */}
      {isLoading ? (
        // Loading state indicator
        <div className="text-center py-10 text-gray-500">
          Loading records...
        </div>
      ) : (
        // Data table with sessions and receipt download action
        <DataTable
          columns={columns}
          data={filteredSessions}
          actions={(row) => downloadReceipt(row.id)} // Render receipt download link for each row
        />
      )}
    </div>
  );
};

export default MentorDashboard;
