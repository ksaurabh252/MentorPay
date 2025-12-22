// Helper to get dates relative to today
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const INITIAL_SESSIONS = [
  {
    id: 101,
    mentorId: "mentor-1",
    mentorName: "John Doe",
    sessionDate: daysAgo(2),
    sessionType: "live",
    duration: 60,
    ratePerHour: 4000,
    payout: 4000,
    status: "paid",
  },
  {
    id: 102,
    mentorId: "mentor-1",
    mentorName: "John Doe",
    sessionDate: daysAgo(5),
    sessionType: "recorded",
    duration: 30,
    ratePerHour: 2000,
    payout: 1000,
    status: "pending",
  },
  {
    id: 103,
    mentorId: "mentor-2",
    mentorName: "Jane Smith",
    sessionDate: daysAgo(1),
    sessionType: "evaluation",
    duration: 45,
    ratePerHour: 3000,
    payout: 2250,
    status: "pending_review",
  },
  {
    id: 104,
    mentorId: "mentor-1",
    mentorName: "John Doe",
    sessionDate: daysAgo(10),
    sessionType: "live",
    duration: 90,
    ratePerHour: 4000,
    payout: 6000,
    status: "paid",
  },
  {
    id: 105,
    mentorId: "mentor-3",
    mentorName: "Amit Kumar",
    sessionDate: daysAgo(0), // Today
    sessionType: "live",
    duration: 60,
    ratePerHour: 5000,
    payout: 5000,
    status: "pending",
  },
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 1,
    action: "SESSION_CREATED",
    userEmail: "admin@mentorpay.com",
    targetType: "Session",
    targetId: "105",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    ipAddress: "192.168.1.1"
  },
  {
    id: 2,
    action: "PAYOUT_PROCESSED",
    userEmail: "system",
    targetType: "Session",
    targetId: "101",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    ipAddress: "10.0.0.5"
  }
];