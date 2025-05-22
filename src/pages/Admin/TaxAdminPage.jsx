import { useTaxContext } from "../../contexts/TaxContext";
import { useAuth } from "../../contexts/AuthContext";

const TaxAdminPage = () => {
  const { taxes, setTaxes } = useTaxContext();
  const { permissions } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Tax settings updated successfully!");
  };

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
      <h1 className="text-2xl font-bold mb-6">Tax Configuration</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white p-6 rounded-lg shadow"
      >
        <div className="mb-4">
          <label className="block mb-2">Platform Fee (%)</label>
          <input
            type="number"
            value={taxes.platformFee}
            onChange={(e) =>
              setTaxes({ ...taxes, platformFee: e.target.value })
            }
            className="w-full p-2 border rounded"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">GST Rate (%)</label>
          <input
            type="number"
            value={taxes.gstRate}
            onChange={(e) => setTaxes({ ...taxes, gstRate: e.target.value })}
            className="w-full p-2 border rounded"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">TDS Rate (%)</label>
          <input
            type="number"
            value={taxes.tdsRate}
            onChange={(e) => setTaxes({ ...taxes, tdsRate: e.target.value })}
            className="w-full p-2 border rounded"
            min="0"
            max="30"
            step="0.1"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Tax Settings
        </button>
      </form>
    </div>
  );
};

export default TaxAdminPage;
