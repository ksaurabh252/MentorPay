
import { Formik, Field } from 'formik';
import { useAuth } from '../../contexts/AuthContext';

const MentorSessionForm = () => {
  const { user } = useAuth();
  const { permissions } = useAuth();
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Submit Session</h2>
      {permissions?.sessions.create ? (
        <Formik
          initialValues={{
            date: new Date().toISOString().split('T')[0],
            duration: 60,
            type: 'live',
            notes: ''
          }}
          onSubmit={(values) => {
            // Auto-fills mentor info from auth context
            const submission = {
              ...values,
              mentorId: user.id,
              mentorName: user.name,
              status: 'pending_review'
            };
            console.log('Session submission:', submission);
            // API call would go here
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Date</label>
                <Field
                  name="date"
                  type="date"
                  className="w-full p-2 border rounded"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Duration (minutes)</label>
                <Field
                  name="duration"
                  type="number"
                  min="15"
                  step="15"
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit for Approval
              </button>
            </form>
          )}
        </Formik>) : (
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <FiAlertTriangle className="mx-auto h-6 w-6 text-yellow-500" />
          <p className="mt-2">You don't have permission to submit sessions</p>
        </div>
      )}
    </div>
  );
};

export default MentorSessionForm