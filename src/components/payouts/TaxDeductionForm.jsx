import { useAuth } from '../../contexts/AuthContext';

const TaxDeductionForm = ({ taxes, onChange }) => {
  const { permissions } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tax Configuration</h2>

      {permissions?.taxes.modify ? (
        <>
          <div className="mb-4">
            <label className="block mb-2">Platform Fee (%)</label>
            <input
              type="number"
              name="platformFee"
              value={taxes.platformFee}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Other tax inputs */}
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <FiLock className="mx-auto h-6 w-6" />
          <p>Tax configuration can only be modified by administrators</p>
        </div>
      )}
    </div>
  );
};

export default TaxDeductionForm