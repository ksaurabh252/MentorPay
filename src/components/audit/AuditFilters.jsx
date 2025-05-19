import { FiFilter, FiCalendar, FiUser } from "react-icons/fi";
import DateRangePicker from "../common/DateRangePicker";
import { useState } from "react";

const AuditFilters = ({ users, initialDateRange, onFilter }) => {
  const [localFilters, setLocalFilters] = useState({
    userId: "",
    dateRange: initialDateRange,
    actionType: "",
  });

  const actionTypes = [
    "SESSION_CREATED",
    "SESSION_UPDATED",
    "SESSION_DELETED",
    "PAYOUT_PROCESSED",
    "USER_MODIFIED",
  ];

  const handleApply = () => {
    onFilter({
      userId: localFilters.userId,
      dateRange: localFilters.dateRange,
      actionType: localFilters.actionType,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className=" text-sm font-medium mb-1 flex items-center">
            <FiUser className="mr-2" /> User
          </label>
          <select
            value={localFilters.userId}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, userId: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center">
            <FiCalendar className="mr-2" /> Date Range
          </label>
          <DateRangePicker
            value={localFilters.dateRange}
            onChange={(range) =>
              setLocalFilters({ ...localFilters, dateRange: range })
            }
          />
        </div>

        <div>
          <label className=" text-sm font-medium mb-1 flex items-center">
            <FiFilter className="mr-2" /> Action Type
          </label>
          <select
            value={localFilters.actionType}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, actionType: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Actions</option>
            {actionTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditFilters;
