import { useState, useEffect } from "react";
import { useTestMode } from "../../contexts/TestModeContext";
import { utils, writeFile } from "xlsx";
import TaxDeductionForm from "../../components/payouts/TaxDeductionForm";
import PayoutSummary from "../../components/payouts/PayoutSummary";
import WebhookConfig from "../../components/payouts/WebhookConfig";
import { FiPlay, FiStopCircle, FiDownload, FiShare2 } from "react-icons/fi";
import { createSignature } from "../../utils/webhookUtils";
import { calculatePayout, formatCurrency } from "../../utils/finance";
import DataTable from "../../components/common/DataTable";
import { getSessions } from "../../services/mockApi";

/**
 * AdminPayouts Component
 *
 * Comprehensive payout management system for administrators featuring:
 * - Session-based payout calculations with tax deductions
 * - Manual adjustment capabilities with reason tracking
 * - Test mode for safe simulation before actual payouts
 * - CSV export functionality
 * - Webhook integration for external system notifications
 * - Real-time financial calculations and summaries
 */
const AdminPayouts = () => {
  // Get test mode state and setter from context
  const { testMode, setTestMode } = useTestMode();

  // ===== STATE MANAGEMENT =====

  // Sessions data from API
  const [sessions, setSessions] = useState([]);

  // Tax configuration with default rates
  const [taxes, setTaxes] = useState({
    gstRate: 18, // Goods and Services Tax percentage
    platformFee: 10, // Platform commission percentage
    tdsRate: 5, // Tax Deducted at Source percentage
  });

  // Manual payout adjustments by session ID
  const [manualAdjustments, setManualAdjustments] = useState({});

  // Reasons for manual adjustments
  const [adjustmentReasons, setAdjustmentReasons] = useState({});

  // Results from payout simulation in test mode
  const [simulationResults, setSimulationResults] = useState(null);

  // Webhook configurations for external notifications
  const [webhooks, setWebhooks] = useState([]);

  // Active tab state (payouts or webhooks)
  const [activeTab, setActiveTab] = useState("payouts");

  // ===== DATA FETCHING =====

  /**
   * Fetch sessions data on component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Error loading payouts data:", error);
      }
    };
    fetchData();
  }, []);

  // ===== EVENT HANDLERS =====

  /**
   * Toggle between test mode and production mode
   * Clears simulation results when exiting test mode
   */
  const toggleTestMode = () => {
    if (testMode) {
      setSimulationResults(null); // Clear previous simulation data
    }
    setTestMode(!testMode);
  };

  /**
   * Handle manual adjustment amount changes
   * @param {string} sessionId - ID of the session being adjusted
   * @param {string} value - New adjustment value
   */
  const handleAdjustmentChange = (sessionId, value) => {
    setManualAdjustments((prev) => ({
      ...prev,
      [sessionId]: parseFloat(value) || 0,
    }));
  };

  /**
   * Handle adjustment reason changes
   * @param {string} sessionId - ID of the session
   * @param {string} reason - Reason for the adjustment
   */
  const handleReasonChange = (sessionId, reason) => {
    setAdjustmentReasons((prev) => ({
      ...prev,
      [sessionId]: reason,
    }));
  };

  // ===== FINANCIAL CALCULATIONS =====

  /**
   * Calculate final payout amounts for all sessions
   * Includes tax deductions, platform fees, and manual adjustments
   */
  const calculatedSessions = sessions.map((session) => {
    const financialData = calculatePayout(session, taxes);
    const adjustment = manualAdjustments[session.id] || 0;

    return {
      ...session,
      platformFee: parseFloat(financialData.deductions.platformFee),
      gst: parseFloat(financialData.deductions.gst),
      tds: parseFloat(financialData.deductions.tds),
      adjustment: adjustment,
      adjustmentReason: adjustmentReasons[session.id] || "",
      netAmount: parseFloat(financialData.net) + adjustment, // Final amount after all deductions and adjustments
      grossAmount: parseFloat(financialData.gross), // Original amount before deductions
    };
  });

  // Calculate total payout across all sessions
  const totalPayout = calculatedSessions.reduce(
    (sum, session) => sum + session.netAmount,
    0
  );

  // Calculate total manual adjustments
  const totalAdjustments = calculatedSessions.reduce(
    (sum, session) => sum + (manualAdjustments[session.id] || 0),
    0
  );

  // ===== SIMULATION AND PROCESSING =====

  /**
   * Run payout simulation to preview results before actual processing
   * Creates detailed breakdown of payouts, adjustments, and affected mentors
   */
  const runSimulation = () => {
    const results = {
      totalPayout,
      totalAdjustments,
      affectedMentors: [...new Set(sessions.map((s) => s.mentorId))].length, // Count unique mentors
      taxDeductions: sessions.reduce((sum, s) => sum + s.gst + s.tds, 0),
      breakdown: calculatedSessions.map((s) => ({
        mentor: s.mentorName,
        sessions: 1,
        amount: s.netAmount,
        adjustment: s.adjustment,
        reason: s.adjustmentReason,
      })),
    };
    setSimulationResults(results);
  };

  /**
   * Handle tax rate changes from the tax configuration form
   * @param {Event} e - Input change event
   */
  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxes({ ...taxes, [name]: parseFloat(value) || 0 });
  };

  /**
   * Export payout data to Excel/CSV format
   * Creates downloadable file with session details and calculations
   */
  const exportToCSV = () => {
    const csvData = calculatedSessions.map((session) => ({
      "Mentor ID": session.mentorId,
      "Mentor Name": session.mentorName,
      "Session Date": new Date(session.sessionDate).toLocaleDateString(),
      "Net Amount": session.netAmount,
      Adjustment: session.adjustment,
    }));

    // Create Excel workbook
    const worksheet = utils.json_to_sheet(csvData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Payouts");
    writeFile(workbook, `payouts.xlsx`);
  };

  /**
   * Send webhook notifications to configured external systems
   * Triggers when payouts are finalized
   */
  const triggerWebhooks = async () => {
    const payload = {
      event: "payout_processed",
      data: {
        payout_date: new Date().toISOString(),
        total_amount: totalPayout,
        session_count: sessions.length,
        mentor_count: new Set(sessions.map((s) => s.mentorId)).size,
        session_ids: sessions.map((s) => s.id),
        adjustments_total: totalAdjustments,
      },
    };

    // Send to all active webhooks
    for (const hook of webhooks.filter((h) => h.active)) {
      try {
        await fetch(hook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-MentorPay-Signature": createSignature(hook.secret, payload), // Security signature
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error(`Webhook to ${hook.url} failed:`, err);
      }
    }
  };

  /**
   * Finalize and process all payouts
   * Triggers webhooks and shows confirmation
   */
  const finalizePayouts = () => {
    triggerWebhooks();
    alert(
      `Payouts finalized!\nTotal: ${formatCurrency(
        totalPayout
      )}\nAdjustments: ${formatCurrency(totalAdjustments)}`
    );
  };

  // ===== TABLE CONFIGURATION =====

  /**
   * Define table columns for the sessions data table
   * Includes editable fields for adjustments and reasons
   */
  const columns = [
    { header: "Mentor", accessorKey: "mentorName" },
    {
      header: "Date",
      render: (row) => new Date(row.sessionDate).toLocaleDateString(),
    },
    { header: "Base Payout", render: (row) => formatCurrency(row.grossAmount) },
    {
      header: "Adjustment (₹)",
      render: (row) => (
        <input
          type="number"
          className="w-24 p-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="0"
          value={manualAdjustments[row.id] || ""}
          onChange={(e) => handleAdjustmentChange(row.id, e.target.value)}
        />
      ),
    },
    {
      header: "Reason",
      render: (row) => (
        <input
          type="text"
          className="w-32 p-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Bonus/Penalty"
          value={adjustmentReasons[row.id] || ""}
          onChange={(e) => handleReasonChange(row.id, e.target.value)}
        />
      ),
    },
    {
      header: "Net Amount",
      render: (row) => (
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(row.netAmount)}
        </span>
      ),
    },
  ];

  // ===== COMPONENT RENDER =====

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payout Management
          {/* Test mode indicator badge */}
          {testMode && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              TEST MODE
            </span>
          )}
        </h1>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white transition-colors"
          >
            <FiDownload className="inline mr-2" /> Export CSV
          </button>

          {/* Test mode toggle */}
          <button
            onClick={toggleTestMode}
            className={`px-4 py-2 rounded text-white transition-colors ${
              testMode
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {testMode ? (
              <>
                <FiStopCircle className="inline mr-2" /> Exit Test Mode
              </>
            ) : (
              <>
                <FiPlay className="inline mr-2" /> Enter Test Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6 border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium transition-colors ${
            activeTab === "payouts"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("payouts")}
        >
          Payouts
        </button>
        <button
          className={`py-2 px-4 font-medium transition-colors ${
            activeTab === "webhooks"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("webhooks")}
        >
          <FiShare2 className="inline mr-1" /> Webhooks
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "payouts" ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Sessions Table with Adjustments */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-bold mb-4 text-gray-700 dark:text-gray-200">
                Session Adjustments
              </h3>
              {/* Data table showing all sessions with editable adjustments */}
              <DataTable columns={columns} data={calculatedSessions} />
            </div>

            {/* Payout Summary Component */}
            <PayoutSummary
              sessions={calculatedSessions}
              totalPayout={totalPayout}
              totalAdjustments={totalAdjustments}
              taxes={taxes}
            />
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Tax Configuration Form */}
            <TaxDeductionForm taxes={taxes} onChange={handleTaxChange} />

            {/* Finalize/Simulate Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Finalize Payouts
              </h2>
              {!testMode ? (
                /* Production mode - actual payout processing */
                <button
                  onClick={finalizePayouts}
                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Confirm & Send
                </button>
              ) : (
                /* Test mode - simulation only */
                <button
                  onClick={runSimulation}
                  className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Run Simulation
                </button>
              )}
            </div>
          </div>

          {/* Simulation Results Display (Test Mode Only) */}
          {testMode && simulationResults && (
            <div className="md:col-span-3 mt-6 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-6">
              <h3 className="font-bold mb-2 dark:text-white">
                Simulation Results
              </h3>
              <p className="dark:text-gray-300">
                Total: {formatCurrency(simulationResults.totalPayout)}
              </p>
              <p className="dark:text-gray-300">
                Adjustments:{" "}
                {formatCurrency(simulationResults.totalAdjustments)}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Webhook Configuration Tab */
        <WebhookConfig webhooks={webhooks} setWebhooks={setWebhooks} />
      )}
    </div>
  );
};

export default AdminPayouts;
