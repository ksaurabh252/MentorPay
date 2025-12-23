import { INITIAL_SESSIONS, INITIAL_AUDIT_LOGS } from "../data/mockData";

// ============================================================
// LOCAL STORAGE API SERVICE
// ============================================================
// This module simulates a backend API by using localStorage
// for data persistence. All operations are async to mimic
// real network requests and include artificial delays.
// ============================================================

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Safely retrieves and parses data from localStorage
 *
 * @param {string} key - The localStorage key to retrieve
 * @returns {any|null} - Parsed JSON data or null if not found/invalid
 *
 * @example
 * const sessions = getLocalData("sessions");
 * // Returns: [{id: 1, ...}, {id: 2, ...}] or null
 */
const getLocalData = (key) => {
  // Attempt to retrieve data from localStorage
  const data = localStorage.getItem(key);

  // Parse JSON if data exists, otherwise return null
  // This prevents JSON.parse(null) errors
  return data ? JSON.parse(data) : null;
};

/**
 * Saves data to localStorage as a JSON string
 *
 * @param {string} key - The localStorage key to set
 * @param {any} data - The data to store (will be stringified)
 *
 * @example
 * setLocalData("sessions", [{ id: 1, name: "Session 1" }]);
 */
const setLocalData = (key, data) => {
  // Convert data to JSON string and store in localStorage
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Simulates network latency for a more realistic API experience
 * This helps test loading states and async behavior in the UI
 *
 * @returns {Promise} - Resolves after 500ms delay
 */
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// ============================================================
// SESSIONS CRUD OPERATIONS
// ============================================================

/**
 * GET ALL SESSIONS
 * Retrieves all sessions from localStorage
 * Initializes with mock data on first load if storage is empty
 *
 * @async
 * @returns {Promise<Array>} - Array of session objects
 *
 * @example
 * const sessions = await getSessions();
 * console.log(sessions); // [{id: 1, mentorName: "John", ...}, ...]
 */
export const getSessions = async () => {
  // Simulate API network delay
  await simulateDelay();

  // Attempt to retrieve existing sessions from localStorage
  const stored = getLocalData("sessions");

  // Return stored sessions if they exist
  if (stored) {
    return stored;
  }

  // First time load: Initialize localStorage with mock data
  // This ensures the app has data to display on initial use
  setLocalData("sessions", INITIAL_SESSIONS);
  return INITIAL_SESSIONS;
};

/**
 * CREATE NEW SESSION
 * Creates a new session with auto-generated ID and default values
 *
 * @async
 * @param {Object} sessionData - The session data to create
 * @param {string} sessionData.mentorName - Name of the mentor
 * @param {string} sessionData.sessionType - Type of session (e.g., "live", "recorded")
 * @param {number} sessionData.duration - Duration in minutes
 * @param {number} sessionData.ratePerHour - Hourly rate for the session
 * @param {string} sessionData.sessionDate - Date of the session (ISO string)
 *
 * @returns {Promise<Object>} - The newly created session object with ID
 *
 * @example
 * const newSession = await createSession({
 *   mentorName: "John Doe",
 *   sessionType: "live",
 *   duration: 60,
 *   ratePerHour: 500
 * });
 */
export const createSession = async (sessionData) => {
  // Simulate network delay for realistic API behavior
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Step 1: Retrieve existing sessions from localStorage
  // Use empty array as fallback if no sessions exist
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  // Step 2: Create new session object with auto-generated fields
  const newSession = {
    ...sessionData, // Spread provided session data
    id: Date.now().toString(), // Generate unique ID using timestamp
    status: "pending", // Set default status as 'pending'
    createdAt: new Date().toISOString(), // Record creation timestamp
  };

  // Step 3: Add new session to the list and save back to localStorage
  sessions.push(newSession);
  localStorage.setItem("sessions", JSON.stringify(sessions));

  // Return the newly created session object
  return newSession;
};


/**
 * UPDATE SESSION
 * Modifies an existing session in storage
 *
 * @async
 * @param {Object} updatedSession - The session object with updated values
 * @param {number|string} updatedSession.id - Required: ID of session to update
 *
 * @returns {Promise<Array>} - Updated array of all sessions
 *
 * @example
 * const allSessions = await updateSession({
 *   id: 123,
 *   mentorName: "Updated Name",
 *   status: "paid"
 * });
 */
export const updateSession = async (updatedSession) => {
  // Simulate network delay
  await simulateDelay();

  // Retrieve current sessions from storage
  const sessions = getLocalData("sessions") || [];

  // Map through sessions and replace the matching one by ID
  // Non-matching sessions are returned unchanged
  const updatedList = sessions.map((session) =>
    session.id === updatedSession.id ? updatedSession : session
  );

  // Save updated list to localStorage
  setLocalData("sessions", updatedList);

  // Return the complete updated sessions array
  return updatedList;
};

/**
 * DELETE SESSION
 * Removes a session from storage by ID
 *
 * @async
 * @param {number|string} sessionId - The ID of the session to delete
 * @returns {Promise<Array>} - Updated array of remaining sessions
 *
 * @example
 * const remainingSessions = await deleteSession(123);
 */
export const deleteSession = async (sessionId) => {
  // Simulate network delay
  await simulateDelay();

  // Retrieve current sessions from storage
  const sessions = getLocalData("sessions") || [];

  // Filter out the session with the matching ID
  // All other sessions are kept in the array
  const updatedList = sessions.filter((session) => session.id !== sessionId);

  // Save filtered list to localStorage
  setLocalData("sessions", updatedList);

  // Return the remaining sessions array
  return updatedList;
};

// ============================================================
// AUDIT LOGS OPERATIONS
// ============================================================

/**
 * GET ALL AUDIT LOGS
 * Retrieves all audit logs from storage
 * Initializes with mock data on first load if storage is empty
 *
 * Audit logs track all changes made to sessions including:
 * - CREATE: New session creation
 * - UPDATE: Session modifications
 * - DELETE: Session removals
 *
 * @async
 * @returns {Promise<Array>} - Array of audit log objects
 *
 * @example
 * const logs = await getAuditLogs();
 * // Returns: [{
 * //   id: 1,
 * //   action: "UPDATE",
 * //   entityType: "session",
 * //   entityId: 123,
 * //   changes: { status: { old: "pending", new: "paid" } },
 * //   timestamp: "2024-01-15T10:30:00Z",
 * //   userId: "admin"
 * // }, ...]
 */
export const getAuditLogs = async () => {
  // Simulate network delay
  await simulateDelay();

  // Check for existing audit logs in localStorage
  const stored = getLocalData("auditLogs");

  // Return stored logs if they exist
  if (stored) return stored;

  // Initialize with mock data if no logs exist
  // This provides sample data for demonstration purposes
  setLocalData("auditLogs", INITIAL_AUDIT_LOGS);
  return INITIAL_AUDIT_LOGS;
};