import { useState } from "react";

export default function AICanteen() {
  const [ingredients, setIngredients] = useState("");

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
      </div>
    </div>
  );
}
