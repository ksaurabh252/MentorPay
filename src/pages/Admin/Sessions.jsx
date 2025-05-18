import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CSVUpload from '../../components/sessions/CSVUpload';
import SessionList from '../../components/sessions/SessionList';
import DateRangePicker from '../../components/common/DateRangePicker';
import { subDays } from 'date-fns';

const sessionSchema = Yup.object().shape({
  mentorName: Yup.string().required('Required'),
  sessionDate: Yup.date().required('Required'),
  sessionTime: Yup.string().required('Required'),
  duration: Yup.number().min(0.25, 'Minimum 15 minutes').required('Required'),
  sessionType: Yup.string().required('Required'),
  ratePerHour: Yup.number().min(0, 'Must be positive').required('Required'),
});

const AdminSessions = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [sessions, setSessions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  });

  const handleSubmit = (values, { resetForm }) => {
    const payout = (values.duration / 60) * values.ratePerHour;
    const newSession = {
      ...values,
      id: Date.now(),
      payout,
      status: 'pending',
    };
    setSessions([...sessions, newSession]);
    resetForm();
  };

  const handleCSVUpload = (data) => {
    setSessions([...sessions, ...data]);
  };

  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.sessionDate);
    return (
      sessionDate >= dateRange.startDate && sessionDate <= dateRange.endDate
    );
  });

  const totalPayout = filteredSessions.reduce(
    (sum, session) => sum + session.payout,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Session Management
      </h1>

      <div className="mb-6">
        <DateRangePicker value={dateRange} onChange={(range) => setDateRange(range)} />
        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-300">
            Total Payout for Selected Range:
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{totalPayout.toFixed(2)}
          </p>
        </div>
      </div>

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
                  sessionDate: '',
                  sessionTime: '',
                  duration: 1,
                  sessionType: 'live',
                  ratePerHour: 4000,
                }}
                validationSchema={sessionSchema}
                onSubmit={handleSubmit}
              >

                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Mentor Name
                        </label>
                        <Field
                          name="mentorName"
                          as="select"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
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

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Session Date
                        </label>
                        <Field
                          type="date"
                          name="sessionDate"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <ErrorMessage
                          name="sessionDate"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Session Time
                        </label>
                        <Field
                          type="time"
                          name="sessionTime"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <ErrorMessage
                          name="sessionTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Duration (minutes)
                        </label>
                        <Field
                          type="number"
                          name="duration"
                          min="15"
                          step="15"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <ErrorMessage
                          name="duration"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Session Type
                        </label>
                        <Field
                          name="sessionType"
                          as="select"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        >
                          <option value="live">Live Session</option>
                          <option value="recorded">Recorded Review</option>
                          <option value="evaluation">Evaluation</option>
                        </Field>
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Rate per Hour (₹)
                        </label>
                        <Field
                          type="number"
                          name="ratePerHour"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <ErrorMessage
                          name="ratePerHour"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

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

                    <button
                      type="submit"
                      className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Add Session
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