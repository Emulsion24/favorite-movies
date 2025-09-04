import { useState } from "react";
import api from "../utils/api";

export default function EditEntryModal({ entry, onClose, refreshEntries }) {
  const [formData, setFormData] = useState({
    title: entry.title,
    type: entry.type,
    director: entry.director,
    year: entry.year,
    budget: entry.budget || "",
    image: entry.image || "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    updateData.append("title", formData.title);
    updateData.append("type", formData.type);
    updateData.append("director", formData.director);
    updateData.append("year", formData.year);
    updateData.append("budget", formData.budget);
    updateData.append("status", "pending"); // reset status

    if (file) {
      updateData.append("image", file); // upload new image if selected
    }

    try {
      await api.put(`/movies/${entry.id}`, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload()
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Movie</h2>
        <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
            required
          />
          <select
  name="type"
  value={formData.type}
  onChange={handleChange}
  className="w-full p-2 border rounded"
  required
>
  
  <option value="Movies">Movies</option>
  <option value="TV Show">TV Show</option>
</select>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Director"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full p-2 border rounded"
          />
          <div>
            <label className="block mb-1">Upload Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
