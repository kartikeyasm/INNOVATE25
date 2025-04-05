import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function LostAndFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the path ends with '/found' to determine toggle state
  const isFoundView = location.pathname.endsWith("/found");

  const toggleView = () => {
    navigate(isFoundView ? "/lostandfound/lost" : "/lostandfound/found");
  };

  return (
    <div className="p-2 max-w-3xl mx-auto">
      {/* Toggle Switch */}
      <div className="flex items-center justify-center mb-4">
        <span className="mr-3 font-semibold text-lg text-gray-700">Lost</span>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isFoundView}
            onChange={toggleView}
          />
          <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition duration-300"></div>
          <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform peer-checked:translate-x-6 transition duration-300"></div>
        </label>

        <span className="ml-3 font-semibold text-lg text-gray-700">Found</span>
      </div>

      {/* Render Nested Route Component */}
      <Outlet />
    </div>
  );
}
