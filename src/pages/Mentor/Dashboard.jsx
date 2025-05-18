
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockSessions = [
    {
      id: 1,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'live',
      duration: 60,
      rate: 4000,
      payout: 4000,
      status: 'paid'
    },
    {
      id: 2,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'evaluation',
      duration: 30,
      rate: 3000,
      payout: 1500,
      status: 'pending'
    },
    {
      id: 3,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: 'recorded',
      duration: 45,
      rate: 3500,
      payout: 2625,
      status: 'under_review'
    }
  ];

  const filteredSessions = mockSessions.filter(session => {
    const matchesDate = session.date >= dateRange.startDate && session.date <= dateRange.endDate;
    const matchesStatus = filter === 'all' || session.status === filter;
    return matchesDate && matchesStatus;
  });

  const totalPayout = filteredSessions.reduce((sum, session) => sum + session.payout, 0);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Replace the mock downloadReceipt function with:
  const downloadReceipt = (sessionId) => {
    const session = mockSessions.find(s => s.id === sessionId);
    const receiptData = {
      mentorName: user?.name || "Mentor",
      date: new Date().toLocaleDateString(),
      sessions: [{
        date: session.date.toLocaleDateString(),
        type: session.type,
        duration: session.duration,
        payout: session.payout.toFixed(2),
      }],
      subtotal: session.payout.toFixed(2),
      deductions: { platformFee: "0.00", gst: "0.00", tds: "0.00" },
      total: session.payout.toFixed(2),
      message: "Thank you for your contribution!",
    };

    return (
      <PDFDownloadLink
        document={<ReceiptPDF receiptData={receiptData} />}
        fileName={`receipt_${sessionId}.pdf`}
      >
        {({ loading }) => (
          <span className="flex items-center gap-1">
            <FiDownload /> {loading ? 'Generating...' : 'Receipt'}
          </span>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Welcome, {user?.name || 'Mentor'}
        </h1>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sessions</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {filteredSessions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Payout</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ₹{totalPayout.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg. Rate</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ₹{(totalPayout / filteredSessions.length || 0).toFixed(2)}/hr
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value) })}
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="mx-2 text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({ ...dateRange, endDate: new Date(e.target.value) })}
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payout
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {session.date.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 capitalize">
                  {session.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {session.duration} mins
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  ₹{session.rate}/hr
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  ₹{session.payout.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${session.status === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : session.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                    {session.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  <button
                    onClick={() => downloadReceipt(session.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <FiDownload /> Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSessions.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No sessions found matching your filters
          </div>
        )}
      </div>
    </div>

  );
};

export default MentorDashboard;