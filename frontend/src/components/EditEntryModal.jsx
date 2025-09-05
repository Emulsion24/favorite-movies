import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function EditEntryModal({ entry, onClose, refreshEntries }) {
  const [formData, setFormData] = useState({
    title: entry?.title || "",
    type: entry?.type || "Movie",
    director: entry?.director || "",
    year: entry?.year || "",
    budget: entry?.budget || "",
    location: entry?.location || "",
    image: entry?.image || "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.type) {
      toast.error("Title and Type are required!");
      setLoading(false);
      return;
    }

    const updateData = new FormData();
    updateData.append("title", formData.title);
    updateData.append("type", formData.type);
    updateData.append("director", formData.director);
    updateData.append("year", formData.year);
    updateData.append("budget", formData.budget);
    updateData.append("location", formData.location);
    updateData.append("status", "pending");

    if (file) {
      updateData.append("image", file);
    }
    try {
      await api.put(`/movies/${entry.id}`, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
          await fetchUserMovies();
      toast.success("Movie updated successfully!");
      if (refreshEntries) refreshEntries();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl w-[420px] shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          ✏️ Edit Movie / TV Show
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="Movie">🎥 Movie</option>
            <option value="TV Show">📺 TV Show</option>
          </select>

          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Director"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Filming Location"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          {/* Custom File Input */}
          <div>
            <label className="block text-gray-300 mb-1">Poster Image</label>
            <label className="flex items-center justify-between px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
              <span className="text-gray-200">
                {file ? file.name : "Choose File"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-red-600 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
