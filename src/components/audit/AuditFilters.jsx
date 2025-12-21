import { FiSearch, FiCalendar, FiRefreshCw } from "react-icons/fi";

/**
 * AuditFilters Component
 *
 * Provides filtering controls for audit logs including:
 * - User selection dropdown
 * - Date range picker (start and end dates)
 * - Reset/refresh functionality
 *
 * @param {Array} users - Array of user objects with id and email properties
 * @param {Object} initialDateRange - Initial date range object with startDate and endDate
 * @param {Function} onFilter - Callback function called when filters change
 */
const AuditFilters = ({ users = [], initialDateRange, onFilter }) => {
  /**
   * Handles user selection from dropdown
   * Calls onFilter with the selected user ID
   * @param {Event} e - Select change event
   */
  const handleUserChange = (e) => {
    onFilter({ userId: e.target.value });
  };

  /**
   * Handles date range changes (start or end date)
   * Merges new date with existing date range and calls onFilter
   * @param {string} type - Either 'startDate' or 'endDate'
   * @param {string} value - Date string from input field
   */
  const handleDateChange = (type, value) => {
    onFilter({
      dateRange: {
        ...initialDateRange, // Preserve existing date range values
        [type]: new Date(value), // Update specific date field
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      {/* Responsive grid layout - 1 column on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* User Filter Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by User
          </label>
          <div className="relative">
            {/* Search icon positioned absolutely inside the dropdown */}
            <FiSearch className="absolute left-3 top-3 text-gray-400" />

            <select
              onChange={handleUserChange}
              className="pl-10 w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
            >
              {/* Default option to show all users */}
              <option value="">All Users</option>

              {/* Dynamically generate options from users array */}
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <div className="relative">
            {/* Calendar icon positioned absolutely inside the input */}
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />

            <input
              type="date"
              className="pl-10 w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
          </div>
        </div>

        {/* End Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <div className="relative">
            {/* Calendar icon positioned absolutely inside the input */}
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />

            <input
              type="date"
              className="pl-10 w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Reset/Refresh Button */}
        <div>
          {/* Note: Consider implementing a more sophisticated reset that doesn't reload the entire page */}
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
          >
            <FiRefreshCw /> Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditFilters;
