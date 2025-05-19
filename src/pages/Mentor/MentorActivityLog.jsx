import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAuditLogs } from '../api/auditLogs';

export const MentorActivityLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      const logs = await fetchAuditLogs(user.id);
      setLogs(logs);
      setLoading(false);
    };
    loadLogs();
  }, [user.id]);

  if (loading) return <div>Loading activity history...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4">Your Activity History</h3>
      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium capitalize">
                  {log.action.toLowerCase().replace(/_/g, ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              {log.details && (
                <p className="text-sm mt-1">{log.details}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No activity records found</p>
      )}
    </div>
  );
};