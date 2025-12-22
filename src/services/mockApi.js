import { INITIAL_SESSIONS, INITIAL_AUDIT_LOGS } from "../data/mockData";

// ============================================================
// LOCAL STORAGE API SERVICE
// ============================================================
// This module simulates a backend API by using localStorage
// for data persistence. All operations are async to mimic
// real network requests and include artificial delays.
// ============================================================

// --- HELPERS ---

/**
 * Safely retrieves and parses data from localStorage
 * @param {string} key - The localStorage key to retrieve
 * @returns {any|null} - Parsed JSON data or null if not found
 */
const getLocalData = (key) => {
  const data = localStorage.getItem(key);
  // Parse JSON if data exists, otherwise return null
  return data ? JSON.parse(data) : null;
};

/**
 * Saves data to localStorage as a JSON string
 * @param {string} key - The localStorage key to set
 * @param {any} data - The data to store (will be stringified)
 */
const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Simulates network latency for a more realistic API experience
 * @returns {Promise} - Resolves after 500ms delay
 */
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// ============================================================
// SESSIONS CRUD OPERATIONS
// ============================================================

/**
 * GET - Retrieves all sessions from storage
 * Initializes with mock data on first load if storage is empty
 * @returns {Promise<Array>} - Array of session objects
 */
export const getSessions = async () => {
  // Simulate API call delay
  await simulateDelay();

  // Try to get existing sessions from localStorage
  const stored = getLocalData("sessions");
  if (stored) {
    return stored;
  }

  // First time load: Initialize localStorage with mock data
  // This ensures the app has data to display on initial use
  setLocalData("sessions", INITIAL_SESSIONS);
  return INITIAL_SESSIONS;
};

/**
 * ADD - Creates a new session and adds it to storage
 * @param {Object} newSession - The session object to add (without ID)
 * @returns {Promise<Array>} - Updated array of all sessions
 */
export const addSession = async (newSession) => {
  await simulateDelay();

  // Get current sessions or initialize empty array
  const sessions = getLocalData("sessions") || [];

  // Generate unique ID using timestamp and merge with session data
  // Note: Date.now() provides millisecond precision for uniqueness
  const sessionWithId = { ...newSession, id: Date.now() };

  // Append new session to the existing list
  const updatedSessions = [...sessions, sessionWithId];

  // Persist updated list to localStorage
  setLocalData("sessions", updatedSessions);
  return updatedSessions;
};

/**
 * UPDATE - Modifies an existing session in storage
 * @param {Object} updatedSession - The session object with updated values (must include ID)
 * @returns {Promise<Array>} - Updated array of all sessions
 */
export const updateSession = async (updatedSession) => {
  await simulateDelay();

  const sessions = getLocalData("sessions") || [];

  // Map through sessions and replace the matching one by ID
  // Non-matching sessions are returned unchanged
  const updatedList = sessions.map((session) =>
    session.id === updatedSession.id ? updatedSession : session
  );

  setLocalData("sessions", updatedList);
  return updatedList;
};

/**
 * DELETE - Removes a session from storage by ID
 * @param {number} sessionId - The ID of the session to delete
 * @returns {Promise<Array>} - Updated array of remaining sessions
 */
export const deleteSession = async (sessionId) => {
  await simulateDelay();

  const sessions = getLocalData("sessions") || [];

  // Filter out the session with the matching ID
  // All other sessions are kept in the array
  const updatedList = sessions.filter((session) => session.id !== sessionId);

  setLocalData("sessions", updatedList);
  return updatedList;
};

// ============================================================
// AUDIT LOGS OPERATIONS
// ============================================================

/**
 * GET - Retrieves all audit logs from storage
 * Initializes with mock data on first load if storage is empty
 * @returns {Promise<Array>} - Array of audit log objects
 */
export const getAuditLogs = async () => {
  await simulateDelay();

  // Check for existing audit logs in localStorage
  const stored = getLocalData("auditLogs");
  if (stored) return stored;

  // Initialize with mock data if no logs exist
  setLocalData("auditLogs", INITIAL_AUDIT_LOGS);
  return INITIAL_AUDIT_LOGS;
};