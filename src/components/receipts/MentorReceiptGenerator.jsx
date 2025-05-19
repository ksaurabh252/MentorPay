import { useAuth } from '../../contexts/AuthContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPDF from './ReceiptPDF';

export const MentorReceiptGenerator = ({ sessions }) => {
  const { user } = useAuth();

  const generateReceiptData = (session) => ({
    mentorName: user?.name || 'Mentor',
    date: new Date().toLocaleDateString(),
    sessions: [{
      date: new Date(session.sessionDate).toLocaleDateString(),
      type: session.sessionType,
      duration: `${session.duration} mins`,
      rate: `₹${session.ratePerHour}/hr`,
      payout: `₹${session.payout.toFixed(2)}`
    }],
    subtotal: `₹${session.payout.toFixed(2)}`,
    deductions: {
      platformFee: `₹${session.platformFee?.toFixed(2) || (session.payout * 0.1).toFixed(2)}`,
      gst: `₹${session.gst?.toFixed(2) || (session.payout * 0.018).toFixed(2)}`,
      tds: `₹${session.tds?.toFixed(2) || (session.payout * 0.05).toFixed(2)}`
    },
    total: `₹${session.netAmount?.toFixed(2) || (
      session.payout -
      (session.platformFee || session.payout * 0.1) -
      (session.gst || session.payout * 0.018) -
      (session.tds || session.payout * 0.05)
    ).toFixed(2)}`,
    message: 'Thank you for your contribution!'
  });

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <p className="font-medium dark:text-white">
              {new Date(session.sessionDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {session.sessionType} • {session.duration} mins
            </p>
          </div>

          <PDFDownloadLink
            document={<ReceiptPDF receiptData={generateReceiptData(session)} />}
            fileName={`receipt_${session.id}.pdf`}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {({ loading }) => loading ? 'Generating...' : 'Download'}
          </PDFDownloadLink>
        </div>
      ))}
    </div>
  );
};