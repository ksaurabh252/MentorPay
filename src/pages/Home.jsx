
import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/common/DarkModeToggle';

import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Session Tracking',
      description: 'Easily track all mentor sessions with detailed breakdowns.',
      icon: () => <svg>...</svg>,
    },
    {
      title: 'Automated Payouts',
      description: 'Calculate payouts automatically with tax considerations.',
      icon: () => <svg>...</svg>,
    },
    {
      title: 'Transparent Receipts',
      description: 'Generate and share detailed receipts with mentors instantly.',
      icon: () => <svg>...</svg>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {user ? `Welcome back, ${user.name}!` : 'MentorPay Automation System'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {user
              ? `You're logged in as a ${user.role}. Access your dashboard to manage sessions and payouts.`
              : 'Streamline mentor payments with our secure, transparent, and efficient payout platform.'}
          </p>
          {user && ( // Only show "Go to Dashboard" if the user is logged in
            <div className="flex justify-center space-x-4">
              <Link
                to={user.role === 'admin' ? '/admin/sessions' : '/mentor/dashboard'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const features = [
  {
    title: 'Session Tracking',
    description: 'Easily track all mentor sessions with detailed breakdowns.',
    icon: () => <svg>...</svg>,
  },
  {
    title: 'Automated Payouts',
    description: 'Calculate payouts automatically with tax considerations.',
    icon: () => <svg>...</svg>,
  },
  {
    title: 'Transparent Receipts',
    description: 'Generate and share detailed receipts with mentors instantly.',
    icon: () => <svg>...</svg>,
  },
];

export default Home;