import React, { useState } from 'react';
import axios from 'axios';

const Found = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null, // changed to file object
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // if file input, store file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('photo', formData.photo);
    data.append('location', formData.location);
    data.append('description', formData.description);
  
    try {
      const response = await axios.post('/api/found', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // optional: wait max 10 seconds
      });
  
      console.log('✅ Found item submitted successfully:', response.data);
      alert('✅ Item reported successfully!');
  
    } catch (error) {
      console.error('❌ Error submitting found item:', error);
      if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
        alert('❌ Server is not responding. Please try again later.');
      } else {
        alert('❌ Failed to submit. Please check your input or try again later.');
      }
    } finally {
      // Reset form in both success and failure
      setFormData({
        name: '',
        photo: null,
        location: '',
        description: '',
      });
      document.getElementById('photoInput').value = '';
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
          <label className="block mb-1 font-semibold">Attach Photo</label>
          <input
            type="file"
            name="photo"
            id="photoInput"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
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
