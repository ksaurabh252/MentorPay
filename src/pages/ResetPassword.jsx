import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required')
});

const ResetPassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === values.email);

        if (userIndex === -1) {
          throw new Error('Email not found');
        }

        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          password: values.newPassword
        };

        localStorage.setItem('users', JSON.stringify(updatedUsers));

        formik.setStatus({
          success: 'Password reset successfully. Redirecting...'
        });

        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setFieldError('email', err.message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  if (user) {
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Enter your email and new password
          </p>
        </div>

        {formik.errors.email && formik.touched.email && (
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
            {formik.errors.email}
          </div>
        )}

        {formik.status?.success && (
          <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded">
            {formik.status.success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`appearance-none relative block w-full px-3 py-2 border ${formik.errors.email && formik.touched.email
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700`}
                placeholder="email@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className={`appearance-none relative block w-full px-3 py-2 border ${formik.errors.newPassword && formik.touched.newPassword
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700`}
                placeholder="New password (min 8 characters)"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
              />
              {formik.errors.newPassword && formik.touched.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formik.errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                className={`appearance-none relative block w-full px-3 py-2 border ${formik.errors.confirmNewPassword && formik.touched.confirmNewPassword
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700`}
                placeholder="Confirm new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmNewPassword}
              />
              {formik.errors.confirmNewPassword && formik.touched.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formik.errors.confirmNewPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;