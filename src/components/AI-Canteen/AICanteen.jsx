import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AICanteen() {
  const [ingredients, setIngredients] = useState("");
  const navigate = useNavigate(); // navigation hook

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted ingredients:", ingredients);
    // Add your AI/recipe fetching logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          AI-Powered Canteen
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g., rice, tomato, onion)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Get Recipes & Suggestions
          </button>
        </form>

        {/* Plan Meal Button */}
        <button
          onClick={() => navigate("/plan-meal")}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
        >
          Plan a Meal
        </button>
      </div>
    </div>
  );
}
