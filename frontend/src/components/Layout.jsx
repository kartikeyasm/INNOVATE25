import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Import the LogOut icon
import { FaHome } from "react-icons/fa"; // Import the Home icon for the logo

export default function Layout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
        <Link to="/home" className="flex items-center">
          {/* React Icon as Logo */}
          <FaHome className="h-12 w-auto text-blue-500 cursor-pointer" />{" "}
          {/* Logo icon */}
        </Link>

        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center"
        >
          <FiLogOut className="mr-2" /> {/* Icon added here */}
          Sign Out
        </button>
      </header>

      {/* Page content offset by header height */}
      <main className="pt-24 px-4">
        <Outlet />
      </main>
    </div>
  );
}
