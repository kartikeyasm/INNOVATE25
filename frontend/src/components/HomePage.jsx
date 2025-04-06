import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const cardItems = [
    {
      title: "Mess Management",
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
    <main className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 px-6 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {cardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="cursor-pointer p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-indigo-50"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {item.title}
            </h2>
            <p className="text-gray-700 text-lg">{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
