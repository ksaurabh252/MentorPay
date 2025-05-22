import { Link } from "react-router-dom";
import { FiDollarSign } from "react-icons/fi";

const AdminSidebar = () => {
  return (
    <nav>
      <Link
        to="/admin/taxes"
        className="flex items-center gap-2 p-2 hover:bg-gray-100"
      >
        <FiDollarSign /> Tax Configuration
      </Link>
    </nav>
  );
};

export default AdminSidebar;
