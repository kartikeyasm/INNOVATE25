import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";

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
        <Link to="/home">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto cursor-pointer" />
        </Link>

        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
        >
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
