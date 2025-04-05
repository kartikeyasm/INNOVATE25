import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const times = ["Breakfast", "Lunch", "Dinner"];

const vegetables = [
  "Potato", "Tomato", "Spinach", "Cauliflower", "Carrot", "Beans", "Cabbage"
];

const lentils = [
  "Toor Dal", "Moong Dal", "Chana Dal", "Masoor Dal", "Urad Dal"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlanMeal() {
  const [formData, setFormData] = useState({
    month: "",
    time: "",
    vegetable: "",
    lentil: "",
    day: "",
    holiday: "no",
    event: "no"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Menu:", formData);
    // You can send this data to an API or store it
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Month Dropdown */}
        <div>
          <label className="block font-medium mb-1">Month</label>
          <select name="month" value={formData.month} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select a month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Time Dropdown */}
        <div>
          <label className="block font-medium mb-1">Time</label>
          <select name="time" value={formData.time} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select time</option>
            {times.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Vegetable Dropdown */}
        <div>
          <label className="block font-medium mb-1">Vegetable</label>
          <select name="vegetable" value={formData.vegetable} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select vegetable</option>
            {vegetables.map((veg) => (
              <option key={veg} value={veg}>{veg}</option>
            ))}
          </select>
        </div>

        {/* Lentil Dropdown */}
        <div>
          <label className="block font-medium mb-1">Lentil</label>
          <select name="lentil" value={formData.lentil} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select lentil</option>
            {lentils.map((lentil) => (
              <option key={lentil} value={lentil}>{lentil}</option>
            ))}
          </select>
        </div>

        {/* Day Dropdown */}
        <div>
          <label className="block font-medium mb-1">Day</label>
          <select name="day" value={formData.day} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select day</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {/* Holiday Radio */}
        <div>
          <label className="block font-medium mb-1">Is it a holiday?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input type="radio" name="holiday" value="yes" checked={formData.holiday === "yes"} onChange={handleChange} />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="holiday" value="no" checked={formData.holiday === "no"} onChange={handleChange} />
              No
            </label>
          </div>
        </div>

        {/* Event Radio */}
        <div>
          <label className="block font-medium mb-1">Is there an event?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input type="radio" name="event" value="yes" checked={formData.event === "yes"} onChange={handleChange} />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="event" value="no" checked={formData.event === "no"} onChange={handleChange} />
              No
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Submit
        </button>

        {/* Navigate to AI-Canteen Button */}
        <button
          type="button"
          onClick={() => navigate("/AI-Canteen")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-4"
        >
          Go to AI Canteen
        </button>
      </form>
    </div>
  );
}
