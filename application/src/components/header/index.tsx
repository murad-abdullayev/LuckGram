// src/components/header/index.tsx
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { logout } from "../../slices/authSlice";
import { CloverIcon } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center">
          <CloverIcon size={28} className="text-green-500" />
          <Link to="/" className="text-xl font-semibold ml-2 text-gray-800">
            LuckGram
          </Link>
        </div>

        <div className="hidden lg:flex lg:space-x-10">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Home
          </Link>
          <p className="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer">
            About
          </p>
          <p className="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer">
            Services
          </p>
          <p className="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer">
            Contact
          </p>
        </div>

        <div className="hidden lg:flex lg:items-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
