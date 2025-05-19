import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTestMode } from "../../contexts/TestModeContext";
import { utils, writeFile } from "xlsx";
import PayoutCalculator from "../../components/payouts/PayoutCalculator";
import TaxDeductionForm from "../../components/payouts/TaxDeductionForm";
import PayoutSummary from "../../components/payouts/PayoutSummary";
import WebhookConfig from "../../components/payouts/WebhookConfig";
import { FiPlay, FiStopCircle, FiDownload, FiShare2 } from "react-icons/fi";
import { createSignature } from "../../utils/webhookUtils";


const AdminPayouts = () => {
  const { testMode, setTestMode } = useTestMode();
  const location = useLocation();
  const sessionsFromState = location.state?.sessions || [];
  const [sessions, setSessions] = useState(sessionsFromState);
  const [taxes, setTaxes] = useState({
    gstRate: 18,
    platformFee: 10,
    tdsRate: 5,
  });
  const [manualAdjustment, setManualAdjustment] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [simulationResults, setSimulationResults] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [activeTab, setActiveTab] = useState('payouts');

  const toggleTestMode = () => {
    if (testMode) {
      setSimulationResults(null);
    }
    setTestMode(!testMode);
  };

  const runSimulation = () => {
    const results = {
      totalPayout: totalPayout,
      affectedMentors: [...new Set(sessions.map(s => s.mentorId))].length,
      taxDeductions: sessions.reduce((sum, s) => sum + s.gst + s.tds, 0),
      breakdown: sessions.map(s => ({
        mentor: s.mentorName,
        sessions: 1,
        amount: s.netAmount
      }))
    };
    setSimulationResults(results);
  };

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
  const totalPayout = calculatedSessions.reduce((sum, session) => sum + session.netAmount, 0);

  const exportToCSV = () => {
    const csvData = calculatedSessions.map(session => ({
      'Mentor ID': session.mentorId,
      'Mentor Name': session.mentorName,
      'Session Date': new Date(session.sessionDate).toLocaleDateString(),
      'Duration (mins)': session.duration,
      'Rate (₹/hr)': session.ratePerHour,
      'Gross Amount': session.payout,
      'Platform Fee': session.platformFee,
      'GST': session.gst,
      'TDS': session.tds,
      'Net Amount': session.netAmount,
      'Status': session.status
    }));

    const worksheet = utils.json_to_sheet(csvData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Payouts');
    writeFile(workbook, `payouts_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const triggerWebhooks = async () => {
    const payload = {
      event: 'payout_processed',
      data: {
        payout_date: new Date().toISOString(),
        total_amount: totalPayout,
        session_count: sessions.length,
        mentor_count: new Set(sessions.map(s => s.mentorId)).size,
        session_ids: sessions.map(s => s.id)
      }
    };

    for (const hook of webhooks.filter(h => h.active)) {
      try {
        await fetch(hook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-MentorPay-Signature': createSignature(hook.secret, payload)
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error(`Webhook to ${hook.url} failed:`, err);
      }
    }
  };

  const finalizePayouts = () => {
    triggerWebhooks();
    alert('Payouts finalized and webhooks triggered!');
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payout Management
          {testMode && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              TEST MODE
            </span>
          )}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            onClick={toggleTestMode}
            className={`flex items-center gap-2 px-4 py-2 rounded ${testMode
              ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
          >
            {testMode ? (
              <>
                <FiStopCircle /> Exit Test Mode
              </>
            ) : (
              <>
                <FiPlay /> Enter Test Mode
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'payouts' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('payouts')}
        >
          Payout Calculation
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'webhooks' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('webhooks')}
        >
          <FiShare2 className="inline mr-1" /> Webhooks
        </button>
      </div>

      {activeTab === 'payouts' ? (
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
                    Manual adjustment of ₹{manualAdjustment} ({adjustmentReason || "No reason provided"}) will be applied to all payouts.
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
              {!testMode ? (
                <button
                  onClick={finalizePayouts}
                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Confirm & Send Payouts
                </button>
              ) : (
                <button
                  onClick={runSimulation}
                  className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Run Simulation
                </button>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {webhooks.length} webhook(s) will be triggered
              </p>
            </div>
          </div>

          {testMode && simulationResults && (
            <div className="md:col-span-3 mt-6 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 px-6 py-4 border-b border-yellow-200 dark:border-yellow-800">
                <h2 className="text-lg font-medium">Simulation Results</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Payout</div>
                  <div className="text-xl font-bold">₹{simulationResults.totalPayout.toFixed(2)}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Affected Mentors</div>
                  <div className="text-xl font-bold">{simulationResults.affectedMentors}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tax Deductions</div>
                  <div className="text-xl font-bold">₹{simulationResults.taxDeductions.toFixed(2)}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Net Amount</div>
                  <div className="text-xl font-bold">
                    ₹{(simulationResults.totalPayout - simulationResults.taxDeductions).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <WebhookConfig webhooks={webhooks} setWebhooks={setWebhooks} />
      )}
    </div>
  );
};

export default AdminPayouts;