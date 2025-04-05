import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const cardItems = [
    { title: "Canteen and Mess Management", description: "Plan your meals and manage your mess schedule efficiently.", path: "/plan-meal" },
    { title: "Lost and Found", description: "Report lost items or find something you've misplaced.", path: "/lostandfound/lost" },
  ];

  return (
    <main className="flex items-center justify-center h-screen px-4 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {cardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="cursor-pointer p-6 bg-gray-100 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-100 transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
