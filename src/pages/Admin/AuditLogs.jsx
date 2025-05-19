import { useState, useEffect } from "react";
import { useAuditLog } from "../../contexts/AuditLogContext";
import { useAuth } from "../../contexts/AuthContext";
import AuditFilters from "../../components/audit/AuditFilters";
import AuditDiffViewer from "../../components/audit/AuditDiffViewer";
import { FiX, FiClock, FiUser, FiActivity, FiServer } from "react-icons/fi";

const AuditLogs = () => {
  const { logs, fetchLogs, loading } = useAuditLog();
  const { user } = useAuth();
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    userId: "",
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
    },
    actionType: "",
  });

  // Mock admin users
  const adminUsers = [
    { id: "admin1", email: "admin@example.com" },
    { id: "admin2", email: "superadmin@example.com" },
  ];

  useEffect(() => {
    fetchLogs(filters);
  }, [filters]);

  const actionIcons = {
    SESSION_CREATED: "📅",
    SESSION_UPDATED: "✏️",
    SESSION_DELETED: "❌",
    PAYOUT_PROCESSED: "💰",
    USER_MODIFIED: "👤",
    SYSTEM_EVENT: "⚙️",
  };

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

  const handleRowClick = (log) => {
    if (log.oldValue && log.newValue) {
      setSelectedLog(log);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audit Logs
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Logged in as: <span className="font-medium">{user?.email}</span>
        </div>
      </div>

      <AuditFilters
        users={adminUsers}
        initialDateRange={filters.dateRange}
        onFilter={(newFilters) => setFilters({ ...filters, ...newFilters })}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <FiActivity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No audit logs found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your filters or perform some actions to generate logs.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    When
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${log.oldValue ? "cursor-pointer" : "cursor-default"
                      }`}
                    onClick={() => handleRowClick(log)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || actionColors.default
                          }`}
                      >
                        <span className="mr-1">
                          {actionIcons[log.action] || "⚡"}
                        </span>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
                        {log.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm">
                        {log.targetType}:{log.targetId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiClock className="flex-shrink-0 mr-2 text-gray-400" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm">{log.ipAddress}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Diff Viewer Modal */}
          {selectedLog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Change Details
                    </h2>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <FiActivity className="mr-2" />
                      {selectedLog.action.replace(/_/g, " ")}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FiUser className="mr-2" />
                        User
                      </h3>
                      <p>{selectedLog.userEmail}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FiServer className="mr-2" />
                        Target
                      </h3>
                      <p className="font-mono">
                        {selectedLog.targetType}:{selectedLog.targetId}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">Changes:</h3>
                  <AuditDiffViewer
                    oldVal={selectedLog.oldValue}
                    newVal={selectedLog.newValue}
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </div>
                    <button
                      onClick={() => setSelectedLog(null)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
