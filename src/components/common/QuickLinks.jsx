import { Link } from 'react-router-dom';

const QuickLinks = ({ userRole }) => {
  const adminLinks = [
    { path: "/admin/sessions", name: "Sessions" },
    { path: "/admin/payouts", name: "Payouts" },
    { path: "/admin/taxes", name: "Taxes" },
    { path: "/admin/audit-logs", name: "Audit Logs" }
  ];

  const mentorLinks = [
    { path: "/mentor/dashboard", name: "Dashboard" },
    { path: "/mentor/sessions/new", name: "New Session" }
  ];

  const links = userRole === 'admin'
    ? [...adminLinks, ...mentorLinks]
    : mentorLinks;

  return (
    <div className="quick-links p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
      <h3 className="font-medium mb-2">Quick Links</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;