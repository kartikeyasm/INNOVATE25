import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function LostAndFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFoundView = location.pathname.endsWith("/found");

  const toggleView = () => {
    navigate(isFoundView ? "/lostandfound/lost" : "/lostandfound/found");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lost & Found
        </h1>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center mb-6">
          <span className="mr-3 font-semibold text-lg text-gray-700">Lost</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              // ❗ remove checked={isFoundView} to make it work properly
              onChange={toggleView}
            />
            <div className="w-16 h-9 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition duration-300"></div>
            <div className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transform peer-checked:translate-x-7 transition-all duration-300"></div>
          </label>

          <span className="ml-3 font-semibold text-lg text-gray-700">
            Found
          </span>
        </div>

        {/* Nested Component */}
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}