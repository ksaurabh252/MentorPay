// src/api/auditLogs.js
export const fetchAuditLogs = async (userId) => {
  try {
    // Mock implementation:
    return [
      {
        id: 1,
        action: "SESSION_SUBMITTED",
        userId,
        targetId: "session-123",
        timestamp: new Date().toISOString(),
        details: "Submitted new session",
      },
      {
        id: 2,
        action: "SESSION_UPDATED",
        userId,
        targetId: "session-123",
        timestamp: new Date().toISOString(),
        details: "Updated session details",
      },
      {
        id: 3,
        action: "SESSION_DELETED",
        userId,
        targetId: "session-456",
        timestamp: new Date().toISOString(),
        details: "Deleted a session",
      },
      {
        id: 4,
        action: "USER_LOGGED_IN",
        userId,
        targetId: "user-789",
        timestamp: new Date().toISOString(),
        details: "User logged in",
      },
      {
        id: 5,
        action: "USER_LOGGED_OUT",
        userId,
        targetId: "user-789",
        timestamp: new Date().toISOString(),
        details: "User logged out",
      },
      {
        id: 6,
        action: "PASSWORD_CHANGED",
        userId,
        targetId: "user-789",
        timestamp: new Date().toISOString(),
        details: "User changed password",
      },
      {
        id: 7,
        action: "PROFILE_UPDATED",
        userId,
        targetId: "user-789",
        timestamp: new Date().toISOString(),
        details: "User updated profile information",
      },
      {
        id: 8,
        action: "USER_ACCOUNT_DELETED",
        userId,
        targetId: "user-101",
        timestamp: new Date().toISOString(),
        details: "Deleted a user account",
      },
    ];
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }
};
