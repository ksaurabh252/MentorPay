import { useTaxContext } from "../../contexts/TaxContext";
import { useAuth } from "../../contexts/AuthContext";

/**
 * TaxAdminPage Component
 *
 * Administrative interface for configuring tax settings including:
 * - Platform fee percentage
 * - GST (Goods and Services Tax) rate
 * - TDS (Tax Deducted at Source) rate
 *
 * Features permission-based access control to ensure only authorized
 * users can modify tax configurations.
 */
const TaxAdminPage = () => {
  // Get tax settings and updater function from context
  const { taxes, setTaxes } = useTaxContext();

  // Get user permissions for access control
  const { permissions } = useAuth();

  /**
   * Handle form submission
   * Currently shows a success alert - in production this would
   * likely save to database and handle error cases
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // TODO: Add actual save logic with error handling
    alert("Tax settings updated successfully!");
  };

  // Permission check - show access denied if user lacks tax modification rights
  if (!permissions?.taxes.modify) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>You don't have permission to modify tax settings</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <h1 className="text-2xl font-bold mb-6">Tax Configuration</h1>

      {/* Tax settings form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white p-6 rounded-lg shadow"
      >
        {/* Platform Fee Input */}
        <div className="mb-4">
          <label className="block mb-2">Platform Fee (%)</label>
          <input
            type="number"
            value={taxes.platformFee}
            onChange={(e) =>
              setTaxes({ ...taxes, platformFee: e.target.value })
            }
            className="w-full p-2 border rounded"
            min="0" // Minimum 0%
            max="100" // Maximum 100%
            step="0.1" // Allow decimal increments
          />
        </div>

        {/* GST Rate Input */}
        <div className="mb-4">
          <label className="block mb-2">GST Rate (%)</label>
          <input
            type="number"
            value={taxes.gstRate}
            onChange={(e) => setTaxes({ ...taxes, gstRate: e.target.value })}
            className="w-full p-2 border rounded"
            min="0" // Minimum 0%
            max="100" // Maximum 100%
            step="0.1" // Allow decimal increments
          />
        </div>

        {/* TDS Rate Input */}
        <div className="mb-6">
          <label className="block mb-2">TDS Rate (%)</label>
          <input
            type="number"
            value={taxes.tdsRate}
            onChange={(e) => setTaxes({ ...taxes, tdsRate: e.target.value })}
            className="w-full p-2 border rounded"
            min="0" // Minimum 0%
            max="30" // Maximum 30% (typical TDS limit)
            step="0.1" // Allow decimal increments
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Save Tax Settings
        </button>
      </form>
    </div>
  );
};

export default TaxAdminPage;
