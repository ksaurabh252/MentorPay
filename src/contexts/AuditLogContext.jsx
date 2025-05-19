
import { createContext, useState, useContext } from 'react';

const AuditLogContext = createContext();

export const AuditLogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (filters = {}) => {
    setLoading(true);
    // Simulated API call
    const mockLogs = [
      {
        id: 1,
        action: 'SESSION_UPDATED',
        userId: 'admin123',
        userEmail: 'admin@example.com',
        targetId: 'session-456',
        targetType: 'session',
        oldValue: { ratePerHour: 3000 },
        newValue: { ratePerHour: 3500 },
        timestamp: new Date('2023-06-15T10:30:00'),
        ipAddress: '192.168.1.1'
      },

    ];

    setLogs(mockLogs.filter(log => {
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.dateRange && (
        new Date(log.timestamp) < filters.dateRange.start ||
        new Date(log.timestamp) > filters.dateRange.end
      )) return false;
      return true;
    }));
    setLoading(false);
  };

  return (
    <AuditLogContext.Provider value={{ logs, fetchLogs, loading }}>
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLog = () => useContext(AuditLogContext);