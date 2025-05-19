import { useTaxContext } from "../../contexts/TaxContext";

export const MentorTaxView = () => {
  const { taxes } = useTaxContext();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-2">Current Deductions</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Platform Fee:</span>
          <span>{taxes.platformFee}%</span>
        </div>
        <div className="flex justify-between">
          <span>GST Rate:</span>
          <span>{taxes.gstRate}%</span>
        </div>
        <div className="flex justify-between">
          <span>TDS Rate:</span>
          <span>{taxes.tdsRate}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3">
        * Rates are set by administration
      </p>
    </div>
  );
};