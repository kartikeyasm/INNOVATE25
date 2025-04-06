import React, { useState } from "react";
import axios from "axios";

const Found = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/found-request",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Found item submitted successfully:", response.data);
      alert("Item reported successfully!");
    } catch (error) {
      console.error("Error submitting found item:", error);
      if (
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        alert("Server is not responding. Please try again later.");
      } else {
        alert("Failed to submit. Please check your input or try again later.");
      }
    } finally {
      setFormData({
        name: "",
        location: "",
        description: "",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Report a Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Item Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="e.g., Water Bottle, Phone"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Found Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Where you found it"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full p-2 border rounded"
            placeholder="Details about the item"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Found;