import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;