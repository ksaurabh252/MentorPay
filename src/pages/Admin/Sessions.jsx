import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CSVUpload from '../../components/sessions/CSVUpload';
import SessionList from '../../components/sessions/SessionList';
import DateRangePicker from '../../components/common/DateRangePicker';
import { subDays } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const sessionSchema = Yup.object().shape({
  mentorName: Yup.string()
    .required('Mentor name is required')
    .min(3, 'Minimum 3 characters'),
  sessionDate: Yup.date()
    .required('Session date is required')
    .max(new Date(), 'Date cannot be in the future'),
  sessionTime: Yup.string()
    .required('Time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  duration: Yup.number()
    .required('Duration is required')
    .min(15, 'Minimum 15 minutes')
    .max(240, 'Maximum 4 hours')
    .test('is-multiple-of-15', 'Must be in 15-minute increments', value => value % 15 === 0),
  sessionType: Yup.string().required('Session type is required'),
  ratePerHour: Yup.number()
    .required('Rate is required')
    .min(500, 'Minimum ₹500/hour')
    .max(10000, 'Maximum ₹10,000/hour')
});

const AdminSessions = () => {

  const [activeTab, setActiveTab] = useState('manual');
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  });
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    filterSessions(dateRange);
  }, [sessions]);

  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }


  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      console.log('Form Submission:', values);
      const payout = (values.duration / 60) * values.ratePerHour;
      const newSession = {
        ...values,
        id: Date.now(),
        payout,
        status: 'pending'
      };
      setSessions([...sessions, newSession]);
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVUpload = (data) => {
    setSessions([...sessions, ...data]);
  };

  const filterSessions = (range) => {
    const filtered = sessions.filter((session) => {
      const sessionDate = new Date(session.sessionDate);
      return sessionDate >= range.startDate && sessionDate <= range.endDate;
    });
    setFilteredSessions(filtered);
  };

  const handleDateRangeChange = (range) => {
    console.log('New date range selected:', range);
    setDateRange(range);
    filterSessions(range);
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Session Management</h1>

      <div className="mb-6">
        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-300">Total Payout for Selected Range:</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{filteredSessions.reduce((sum, session) => sum + session.payout, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <SessionList sessions={filteredSessions} />

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'manual'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400'
              }`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Entry
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'csv'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400'
              }`}
            onClick={() => setActiveTab('csv')}
          >
            CSV Upload
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'manual' ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <Formik
                initialValues={{
                  mentorName: '',
                  sessionDate: new Date().toISOString().split('T')[0],
                  sessionTime: '',
                  duration: 60,
                  sessionType: 'live',
                  ratePerHour: 4000
                }}
                validationSchema={sessionSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Mentor Name */}
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Mentor Name
                        </label>
                        <Field
                          name="mentorName"
                          as="select"
                          className={`w-full p-2 border rounded ${errors.mentorName && touched.mentorName
                            ? 'border-red-500'
                            : 'dark:bg-gray-700 dark:border-gray-600'
                            }`}
                        >
                          <option value="">Select Mentor</option>
                          <option value="John Doe">John Doe</option>
                          <option value="Jane Smith">Jane Smith</option>
                        </Field>
                        <ErrorMessage
                          name="mentorName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Session Date */}
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Session Date
                        </label>
                        <Field
                          type="date"
                          name="sessionDate"
                          max={new Date().toISOString().split('T')[0]}
                          className={`w-full p-2 border rounded ${errors.sessionDate && touched.sessionDate
                            ? 'border-red-500'
                            : 'dark:bg-gray-700 dark:border-gray-600'
                            }`}
                        />
                        <ErrorMessage
                          name="sessionDate"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Session Time */}
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Session Time
                        </label>
                        <Field
                          type="time"
                          name="sessionTime"
                          className={`w-full p-2 border rounded ${errors.sessionTime && touched.sessionTime
                            ? 'border-red-500'
                            : 'dark:bg-gray-700 dark:border-gray-600'
                            }`}
                        />
                        <ErrorMessage
                          name="sessionTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Duration (minutes)
                        </label>
                        <Field
                          type="number"
                          name="duration"
                          min="15"
                          step="15"
                          className={`w-full p-2 border rounded ${errors.duration && touched.duration
                            ? 'border-red-500'
                            : 'dark:bg-gray-700 dark:border-gray-600'
                            }`}
                        />
                        <ErrorMessage
                          name="duration"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Session Type */}
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Session Type
                        </label>
                        <Field
                          name="sessionType"
                          as="select"
                          className={`w-full p-2 border rounded ${errors.sessionType && touched.sessionType
                            ? 'border-red-500'
                            : 'dark:bg-gray-700 dark:border-gray-600'
                            }`}
                        >
                          <option value="live">Live Session</option>
                          <option value="recorded">Recorded Review</option>
                          <option value="evaluation">Evaluation</option>
                        </Field>
                        <ErrorMessage
                          name="sessionType"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Rate per Hour */}
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Rate per Hour (₹)
                        </label>
                        <Field
                          type="number"
                          name="ratePerHour"
                          className={`w-full p-2 border rounded ${errors.ratePerHour && touched.ratePerHour
                            ? 'border-red-500'
                            : 'dark:bg-gray-700 dark:border-gray-600'
                            }`}
                        />
                        <ErrorMessage
                          name="ratePerHour"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* Payout Breakdown */}
                    <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Payout Breakdown
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Duration: {values.duration} minutes
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Rate: ₹{values.ratePerHour}/hour
                      </p>
                      <p className="font-medium mt-2">
                        Estimated Payout: ₹
                        {((values.duration / 60) * values.ratePerHour).toFixed(2)}
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`mt-6 px-4 py-2 text-white rounded ${isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Add Session'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <CSVUpload onUpload={handleCSVUpload} />
          )}
        </div>
      </div>

      <SessionList sessions={filteredSessions} />
    </div>
  );
};

export default AdminSessions;