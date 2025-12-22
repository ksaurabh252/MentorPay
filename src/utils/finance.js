/**
 * Centralized logic for calculating payouts and taxes.
 * Used by: AdminPayouts, MentorDashboard, and ReceiptGenerator.
 */
export const calculatePayout = (session, taxes = { platformFee: 10, gstRate: 18, tdsRate: 5 }) => {
  // 1. Calculate Gross Amount (Rate * Duration in Hours)
  const durationInHours = session.duration / 60;
  const grossAmount = session.payout || (durationInHours * session.ratePerHour);

  // 2. Calculate Deductions
  const platformFeeAmount = (grossAmount * taxes.platformFee) / 100;
  const gstAmount = (platformFeeAmount * taxes.gstRate) / 100; // GST usually on Platform Fee
  const tdsAmount = (grossAmount * taxes.tdsRate) / 100;       // TDS on Gross Amount

  // 3. Calculate Net Payable
  const totalDeductions = platformFeeAmount + gstAmount + tdsAmount;
  const netAmount = grossAmount - totalDeductions;

  // 4. Return structured data
  return {
    gross: Number(grossAmount).toFixed(2),
    deductions: {
      platformFee: Number(platformFeeAmount).toFixed(2),
      gst: Number(gstAmount).toFixed(2),
      tds: Number(tdsAmount).toFixed(2),
      total: Number(totalDeductions).toFixed(2)
    },
    net: Number(netAmount).toFixed(2)
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};