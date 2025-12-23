import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { FiAlertTriangle } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import { createSession } from "../../services/mockApi";
/**
 * MentorSessionForm Component
 *
 * A form component that allows mentors to submit their session details.
 * Features include:
 * - Role-based access control (mentor only)
 * - Permission-based form rendering
 * - Form validation using react-hook-form
 * - Dark mode support
 */
const MentorSessionForm = () => {
  // Destructuring user object and permissions from AuthContext
  const { user, permissions } = useAuth();
  const navigate = useNavigate();
  /**
   * React Hook Form Setup
   *
   * - register: Function to register input fields for validation
   * - handleSubmit: Function to handle form submission
   * - reset: Function to reset form to default values
   * - formState: Object containing form state (errors, isSubmitting)
   */
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    // Setting default values for all form fields
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      duration: 60, // Default session duration: 60 minutes
      type: "live", // Default session type: live session
      ratePerHour: 4000, // Default rate per hour
      notes: "", // Empty notes by default
    },
  });

  // Watch duration and ratePerHour so estimated payout updates in real-time
  const duration = watch("duration");
  const ratePerHour = watch("ratePerHour");

  // Calculate estimated payout based on duration and rate per hour
  const estimatedPayout =
    ((Number(duration) || 0) / 60) * (Number(ratePerHour) || 0);

  {
    /* =============== ROLE-BASED ACCESS CONTROL ================ */
  }
  // Redirect non-mentor users to unauthorized page
  // This ensures only mentors can access this form
  if (user?.role !== "mentor") {
    return <Navigate to="/unauthorized" replace />;
  }

  /**
   * Form Submission Handler
   *
   * Processes the form data when submitted.
   * Currently simulates an API call with a timeout.
   *
   * @param {Object} data - Form data containing date, duration, type, and notes
   */
  const onSubmit = async (data) => {
    // Simulate API submission with 1 second delay
    // TODO: Replace with actual API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const duration = parseInt(data.duration);
    const ratePerHour = Number(data.ratePerHour);
    const payout = (duration / 60) * ratePerHour;
    // Construct submission object with form data and user info
    const sessionPayload = {
      ...data, // Spread form data (date, duration, type, notes)
      mentorId: user.id, // Add mentor's user ID
      mentorName: user.name, // Add mentor's name
      sessionDate: data.date, // Session date from form
      sessionType: data.type, // Session type from form
      duration: data.duration,
      payout,
      ratePerHour: Number(data.ratePerHour),
      notes: data.notes || "",
      status: data.status || "pending", // Set initial status for admin review
    };

    try {
      const saved = await createSession(sessionPayload);
      console.log("Saved session:", saved);
      alert("Session submitted successfully!");
      reset();
      navigate("/mentor/dashboard");
    } catch (e) {
      console.error("createSession failed:", e);
      alert("Save failed. Please try again.");
    }
  };
  const uid = JSON.parse(localStorage.getItem("user") || "{}").id;
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  console.log("Total sessions:", sessions.length);
  console.log(
    "My sessions:",
    sessions.filter((s) => s.mentorId === uid)
  );
  return (
    // {/*================ FORM CONTAINER ================*/ }
    // Centered card with max width, padding, and dark mode support
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-8">
      {/* Form Title */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Submit Session
      </h2>

      {/* ================= PERMISSION CHECK ================ */}
      {/* Conditionally render form or permission denied message */}
      {permissions?.sessions?.create ? (
        // User HAS permission to create sessions - show the form
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ========== DATE + RATE (SIDE BY SIDE) ========== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ========== DATE FIELD ========== */}
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                // Register field with validation rules
                {...register("date", { required: "Date is required" })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                // Prevent selecting future dates
                max={new Date().toISOString().split("T")[0]}
              />
              {/* Display validation error if date is invalid */}
              {errors.date && (
                <span className="text-red-500 text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>

            {/* ========== RATE FIELD ========== */}
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Rate (₹/hr)
              </label>
              <input
                type="number"
                inputMode="numeric"
                // Register field with validation rules
                {...register("ratePerHour", {
                  required: "Rate is required",
                  min: { value: 0, message: "Rate must be 0 or more" },
                })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 4000"
              />
              {/* Display validation error if rate is invalid */}
              {errors.ratePerHour && (
                <span className="text-red-500 text-sm">
                  {errors.ratePerHour.message}
                </span>
              )}
            </div>
          </div>

          {/* ========== DURATION FIELD ========== */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              // Register with validation: required and minimum 15 minutes
              {...register("duration", {
                required: "Duration is required",
                min: { value: 15, message: "Minimum 15 minutes" },
                // Optional: 15-min steps enforce
                validate: (v) =>
                  Number(v) % 15 === 0 || "Duration must be multiple of 15",
              })}
              min="15"
              step="15" // Increment/decrement by 15 minutes
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Display validation error if duration is invalid */}
            {errors.duration && (
              <span className="text-red-500 text-sm">
                {errors.duration.message}
              </span>
            )}
          </div>

          {/* ========== SESSION TYPE FIELD ========== */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Session Type
            </label>
            <select
              // Register without validation (has default value)
              {...register("type")}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              {/* Available session type options */}
              <option value="live">Live Session</option>
              <option value="recorded">Recorded Review</option>
              <option value="evaluation">Evaluation</option>
            </select>
          </div>

          {/* ========== NOTES FIELD (OPTIONAL) ========== */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              // Register without validation (optional field)
              {...register("notes")}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Any specific details..."
            />
          </div>

          {/* ========== ESTIMATED PAYOUT PREVIEW (LIVE) ========== */}
          <div className="p-4 rounded border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Estimated Payout
              </span>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                ₹
                {Number.isFinite(estimatedPayout)
                  ? estimatedPayout.toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Based on Duration × Rate
            </p>
          </div>

          {/* ========== SUBMIT BUTTON ========== */}
          <button
            type="submit"
            // Disable button while form is submitting to prevent double submission
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {/* Show loading text while submitting */}
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      ) : (
        //  ================ PERMISSION DENIED MESSAGE ================
        // User does NOT have permission to create sessions
        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          {/* Warning icon */}
          <FiAlertTriangle className="mx-auto h-6 w-6 text-yellow-500" />
          {/* Permission denied message */}
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            You don't have permission to submit sessions
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorSessionForm;
