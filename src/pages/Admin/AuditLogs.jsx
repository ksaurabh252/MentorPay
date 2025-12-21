import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AuditFilters from "../../components/audit/AuditFilters";
import AuditDiffViewer from "../../components/audit/AuditDiffViewer";
import {
  FiX,
  FiClock,
  FiUser,
  FiActivity,
  FiServer,
  FiEye,
} from "react-icons/fi";
import DataTable from "../../components/common/DataTable";
import { getAuditLogs } from "../../services/mockApi";

/**
 * AuditLogs Component
 *
 * Comprehensive audit trail viewer for administrators featuring:
 * - Real-time audit log display with filtering
 * - Visual diff viewer for data changes
 * - Action-based color coding and icons
 * - Detailed modal view for individual log entries
 * - Date range and user-based filtering
 * - IP address tracking and user activity monitoring
 */
const AuditLogs = () => {
  // Get current user information from authentication context
  const { user } = useAuth();

  // ===== STATE MANAGEMENT =====

  // Audit logs data and loading state
  const [logs, setLogs] = useState([]); // Array of audit log entries
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // Modal state for detailed log viewing
  const [selectedLog, setSelectedLog] = useState(null); // Currently selected log for detail view

  // Filter configuration for log queries
  const [filters, setFilters] = useState({
    userId: "", // Filter by specific user ID
    dateRange: {
      // Default to last 30 days
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
    actionType: "", // Filter by action type
  });

  // ===== CONFIGURATION DATA =====

  // Mock admin users for filtering dropdown
  // TODO: Replace with real user data from API
  const adminUsers = [
    { id: "admin1", email: "admin@example.com" },
    { id: "admin2", email: "superadmin@example.com" },
  ];

  // ===== DATA FETCHING =====

  /**
   * Fetch audit logs based on current filters
   * Runs on component mount and when filters change
   */
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [filters]); // Re-fetch when filters change

  // ===== UI CONFIGURATION =====

  /**
   * Icon mapping for different action types
   * Provides visual indicators for various audit actions
   */
  const actionIcons = {
    SESSION_CREATED: "📅",
    SESSION_UPDATED: "✏️",
    SESSION_DELETED: "❌",
    PAYOUT_PROCESSED: "💰",
    USER_MODIFIED: "👤",
    SYSTEM_EVENT: "⚙️",
  };

  /**
   * Color scheme mapping for action types
   * Provides consistent visual theming across light/dark modes
   */
  const actionColors = {
    SESSION_CREATED:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    SESSION_UPDATED:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    SESSION_DELETED:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    PAYOUT_PROCESSED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  /**
   * Table column configuration for audit logs display
   * Defines how each log entry is rendered in the table
   */
  const columns = [
    {
      header: "Action",
      render: (log) => (
        /* Action badge with icon and color coding */
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            actionColors[log.action] || actionColors.default
          }`}
        >
          <span className="mr-1">{actionIcons[log.action] || "⚡"}</span>
          {log.action.replace(/_/g, " ")} {/* Convert underscores to spaces */}
        </span>
      ),
    },
    {
      header: "User",
      render: (log) => (
        /* User information with icon */
        <div className="flex items-center">
          <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
          {log.userEmail}
        </div>
      ),
    },
    {
      header: "Target",
      render: (log) => (
        /* Target object information in monospace font */
        <span className="font-mono text-sm">
          {log.targetType}:{log.targetId}
        </span>
      ),
    },
    {
      header: "When",
      render: (log) => (
        /* Timestamp with clock icon */
        <div className="flex items-center">
          <FiClock className="flex-shrink-0 mr-2 text-gray-400" />
          {new Date(log.timestamp).toLocaleString()}
        </div>
      ),
    },
    {
      header: "IP Address",
      render: (log) => (
        /* IP address in monospace font for better readability */
        <span className="font-mono text-sm">{log.ipAddress}</span>
      ),
    },
  ];

  // ===== COMPONENT RENDER =====

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audit Logs
        </h1>
        {/* Current user indicator */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Logged in as: <span className="font-medium">{user?.email}</span>
        </div>
      </div>

      {/* Filter Controls */}
      <AuditFilters
        users={adminUsers}
        initialDateRange={filters.dateRange}
        onFilter={(newFilters) => setFilters({ ...filters, ...newFilters })}
      />

      {/* Main Content Area */}
      {loading ? (
        /* Loading Spinner */
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Audit Logs Data Table */
        <DataTable
          columns={columns}
          data={logs}
          actions={(log) =>
            /* Conditional action button - only show for logs with change data */
            log.oldValue && log.newValue ? (
              <button
                onClick={() => setSelectedLog(log)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <FiEye /> View Changes
              </button>
            ) : (
              <span className="text-gray-400 text-xs italic">No Details</span>
            )
          }
        />
      )}

      {/* Detail Modal for Change Viewing */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Change Details
                </h2>
                {/* Action type display */}
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <FiActivity className="mr-2" />
                  {selectedLog.action.replace(/_/g, " ")}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              {/* Log metadata in two-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* User information */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center dark:text-white">
                    <FiUser className="mr-2" /> User
                  </h3>
                  <p className="dark:text-gray-300">{selectedLog.userEmail}</p>
                </div>

                {/* Target object information */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center dark:text-white">
                    <FiServer className="mr-2" /> Target
                  </h3>
                  <p className="font-mono dark:text-gray-300">
                    {selectedLog.targetType}:{selectedLog.targetId}
                  </p>
                </div>
              </div>

              {/* Changes Section */}
              <h3 className="font-medium mb-2 dark:text-white">Changes:</h3>
              {/* Diff viewer component for old vs new values */}
              <AuditDiffViewer
                oldVal={selectedLog.oldValue}
                newVal={selectedLog.newValue}
              />
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center">
                {/* Timestamp display */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
