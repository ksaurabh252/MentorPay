import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PayoutCalculator from '../../components/payouts/PayoutCalculator';
import TaxDeductionForm from '../../components/payouts/TaxDeductionForm';
import PayoutSummary from '../../components/payouts/PayoutSummary';

const AdminPayouts = () => {
  const location = useLocation();
  const sessionsFromState = location.state?.sessions || [];
  // eslint-disable-next-line no-unused-vars
  const [sessions, setSessions] = useState(sessionsFromState);
  const [taxes, setTaxes] = useState({
    gstRate: 18,
    platformFee: 10,
    tdsRate: 5,
  });
  const [manualAdjustment, setManualAdjustment] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxes({
      ...taxes,
      [name]: parseFloat(value) || 0,
    });
  };

  const calculatePayouts = () => {
    return sessions.map((session) => {
      const grossAmount = session.payout;
      const platformFee = (grossAmount * taxes.platformFee) / 100;
      const gst = (platformFee * taxes.gstRate) / 100;
      const tds = (grossAmount * taxes.tdsRate) / 100;
      const netAmount = grossAmount - platformFee - gst - tds + manualAdjustment;

      return {
        ...session,
        platformFee,
        gst,
        tds,
        netAmount,
      };
    });
  };

  const calculatedSessions = calculatePayouts();
  const totalPayout = calculatedSessions.reduce(
    (sum, session) => sum + session.netAmount,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payout Calculation
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PayoutCalculator sessions={calculatedSessions} />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Manual Adjustment
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Adjustment Amount (₹)
                </label>
                <input
                  type="number"
                  value={manualAdjustment}
                  onChange={(e) => setManualAdjustment(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Bonus, Penalty, etc."
                />
              </div>
            </div>
            {manualAdjustment !== 0 && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-gray-700 rounded text-sm">
                <p className="font-medium">Note:</p>
                <p>
                  Manual adjustment of ₹{manualAdjustment} ({adjustmentReason || 'No reason provided'}) will be applied to all payouts.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <TaxDeductionForm taxes={taxes} onChange={handleTaxChange} />

          <PayoutSummary
            sessions={calculatedSessions}
            totalPayout={totalPayout}
            taxes={taxes}
            manualAdjustment={manualAdjustment}
          />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Finalize Payouts
            </h2>
            <button
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              onClick={() => alert('Payouts finalized!')}
            >
              Confirm & Send Payouts
            </button>
            <button
              className="w-full mt-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => alert('Test mode activated')}
            >
              Run Test Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayouts;