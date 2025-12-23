import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { subDays } from "date-fns";
import { FiTrash2 } from "react-icons/fi";

// Components
import DateRangePicker from "../../components/common/DateRangePicker";
import DataTable from "../../components/common/DataTable";

// Context & Utils
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/finance";
import {
  getSessions,
  createSession,
  deleteSession,
} from "../../services/mockApi";

/**
 * AdminSessions Component
 *
 * Comprehensive session management interface for administrators featuring:
 * - Manual session entry with real-time payout calculation
 * - CSV bulk upload functionality
 * - Date range filtering and session overview
 * - CRUD operations (Create, Read, Delete) for sessions
 * - Form validation with React Hook Form
 * - Role-based access control (admin only)
 */
const AdminSessions = () => {
  // ===== STATE MANAGEMENT =====

  // Tab navigation state (manual entry vs CSV upload)
  const [activeTab, setActiveTab] = useState("manual");

  // Session data management
  const [sessions, setSessions] = useState([]); // All sessions from API
  const [filteredSessions, setFilteredSessions] = useState([]); // Sessions after date filtering

  // Date range filter configuration
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7), // Default to last 7 days
    endDate: new Date(), // Up to today
  });

  // Get current user for role validation
  const { user } = useAuth();

  // ===== FORM SETUP WITH REACT HOOK FORM =====

  /**
   * React Hook Form configuration with validation rules
   * Provides form state management, validation, and submission handling
   */
  const {
    register, // Register input fields with validation
    handleSubmit, // Form submission handler
    reset, // Reset form to default values
    watch, // Watch field values for real-time calculations
    formState: { errors, isSubmitting }, // Form state and validation errors
  } = useForm({
    // Default form values
    defaultValues: {
      sessionDate: new Date().toISOString().split("T")[0], // Today's date
      duration: 60, // 1 hour default
      ratePerHour: 4000, // Default rate in rupees
      sessionType: "live", // Default session type
    },
  });

  // ===== REAL-TIME CALCULATIONS =====

  // Watch duration and rate fields for live payout preview
  const duration = watch("duration");
  const ratePerHour = watch("ratePerHour");

  // Calculate estimated payout based on current form values
  const estimatedPayout = ((duration || 0) / 60) * (ratePerHour || 0);

  // ===== DATA FETCHING AND FILTERING =====

  /**
   * Load sessions data on component mount
   */
  useEffect(() => {
    const fetch = async () => {
      const data = await getSessions();
      setSessions(data);
    };
    fetch();
  }, []);

  /**
   * Filter sessions based on selected date range
   * Runs when sessions data or date range changes
   */
  useEffect(() => {
    filterSessions(dateRange);
  }, [sessions, dateRange]);

  /**
   * Apply date range filtering to sessions
   * @param {Object} range - Object containing startDate and endDate
   */
  const filterSessions = (range) => {
    const filtered = sessions.filter((session) => {
      const sessionDate = new Date(session.sessionDate);
      return sessionDate >= range.startDate && sessionDate <= range.endDate;
    });
    setFilteredSessions(filtered);
  };

  // ===== EVENT HANDLERS =====

  /**
   * Handle manual session creation form submission
   * Validates data, calculates payout, and saves to API
   * @param {Object} data - Form data from React Hook Form
   */
  const onSubmit = async (data) => {
    try {
      // Calculate final payout based on duration and rate
      const payout = (data.duration / 60) * data.ratePerHour;

      // Create new session object
      const newSession = {
        ...data,
        sessionType: data.sessionType,
        payout,
        status: "pending", // Default status for new sessions
      };

      // Save to database and update local state
      const updatedList = await createSession(newSession);
      setSessions(updatedList);

      // Reset form and show success message
      reset();
      alert("Session Added Successfully!");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  /**
   * Handle session deletion with confirmation
   * @param {string} id - Session ID to delete
   */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        const updatedList = await deleteSession(id); // API call
        setSessions(updatedList); // Update UI
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  /**
   * Handle CSV upload data processing
   * @param {Array} data - Array of session objects from CSV
   */
  const handleCSVUpload = (data) => {
    setSessions([...sessions, ...data]);
  };

  // ===== ACCESS CONTROL =====

  // Redirect non-admin users to unauthorized page
  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // ===== TABLE CONFIGURATION =====

  /**
   * Define table columns for sessions display
   * Includes formatted data rendering and action buttons
   */
  const columns = [
    {
      header: "Mentor",
      accessorKey: "mentorName",
    },
    {
      header: "Date",
      render: (row) => new Date(row.sessionDate).toLocaleDateString(),
    },
    {
      header: "Type",
      render: (row) => <span className="capitalize">{row.sessionType}</span>,
    },
    {
      header: "Duration",
      render: (row) => `${row.duration} mins`,
    },
    {
      header: "Rate",
      render: (row) => `${formatCurrency(row.ratePerHour)}/hr`,
    },
    {
      header: "Payout",
      render: (row) => formatCurrency(row.payout),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-800 p-2 transition-colors"
          title="Delete Session"
        >
          <FiTrash2 />
        </button>
      ),
    },
  ];

  // ===== COMPONENT RENDER =====

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Session Management
      </h1>

      {/* Date Range Filter */}
      <div className="mb-6">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Tab Navigation and Content */}
      <div className="mb-6">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "manual"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("manual")}
          >
            Manual Entry
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "csv"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("csv")}
          >
            CSV Upload
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "manual" ? (
            /* Manual Entry Form */
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Form Fields Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mentor Selection Dropdown */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Mentor Name
                    </label>
                    <select
                      {...register("mentorName", {
                        required: "Mentor name is required",
                      })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select Mentor</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                    </select>
                    {/* Validation Error Display */}
                    {errors.mentorName && (
                      <p className="text-red-500 text-sm">
                        {errors.mentorName.message}
                      </p>
                    )}
                  </div>

                  {/* Session Date Input */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Session Date
                    </label>
                    <input
                      type="date"
                      {...register("sessionDate", {
                        required: "Date is required",
                      })}
                      max={new Date().toISOString().split("T")[0]} // Prevent future dates
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.sessionDate && (
                      <p className="text-red-500 text-sm">
                        {errors.sessionDate.message}
                      </p>
                    )}
                  </div>

                  {/* Duration Input with Validation */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      {...register("duration", {
                        required: "Required",
                        min: { value: 15, message: "Min 15 mins" },
                        validate: (value) =>
                          value % 15 === 0 || "Must be multiple of 15", // 15-minute increments
                      })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  {/* Hourly Rate Input */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Rate (₹/hr)
                    </label>
                    <input
                      type="number"
                      {...register("ratePerHour", {
                        required: "Required",
                        min: 500, // Minimum rate validation
                      })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.ratePerHour && (
                      <p className="text-red-500 text-sm">
                        {errors.ratePerHour.message}
                      </p>
                    )}
                  </div>

                  {/* Session Type Selection */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      {...register("sessionType")}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="live">Live Session</option>
                      <option value="recorded">Recorded Review</option>
                      <option value="evaluation">Evaluation</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Payout Preview */}
                <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Payout Preview
                  </h3>
                  <p className="font-medium text-xl text-blue-600 dark:text-blue-400">
                    Est. Payout: {formatCurrency(estimatedPayout)}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Adding..." : "Add Session"}
                </button>
              </form>
            </div>
          ) : (
            /* CSV Upload Component */
            <CSVUpload onUpload={handleCSVUpload} />
          )}
        </div>
      </div>

      {/* Sessions Data Table */}
      <DataTable columns={columns} data={filteredSessions} />
    </div>
  );
};

export default AdminSessions;
