import React, { useState } from 'react';

const Found = () => {
  const [formData, setFormData] = useState({
    name: '',
    photoURL: '',
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Found Item Data:", formData);
    // You can send this data to your backend or store it in state
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
          <label className="block mb-1 font-semibold">Photo URL</label>
          <input
            type="url"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Paste image URL"
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
