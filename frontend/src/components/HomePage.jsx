import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const cardItems = [
    {
      title: "Canteen and Mess Management",
      description: "Plan your meals and manage your mess schedule efficiently.",
      path: "/plan-meal",
    },
    {
      title: "Lost and Found",
      description: "Report lost items or find something you've misplaced.",
      path: "/lostandfound/lost",
    },
  ];

  return (
    <main className="min-h-screen flex  justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-6 py-16">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white text-center mb-12 drop-shadow-md">
          Campus Services Hub
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cardItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 transform hover:scale-105 text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {item.title}
              </h2>
              <p className="text-gray-600 text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
