import { useState } from "react";
import { ZodError } from "zod";
import api from "../utils/api";
import { entrySchema } from "../schemas/entrySchema";
import toast from "react-hot-toast";
import useMovieStore from "../store/movieStore"; // ✅ zustand store

export default function EntryFormModal({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const fetchUserMovies = useMovieStore((state) => state.fetchUserMovies);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      entrySchema.parse(formData);

      const data = new FormData();
      Object.entries(formData).forEach(
        ([key, value]) => value && data.append(key, value)
      );

      await api.post("/movies/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie added successfully!");
      await fetchUserMovies();
      onClose();
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          toast.error(issue.message);
        });
      } else {
        console.error(err);
        toast.error("Failed to submit movie");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl w-[420px] shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          🎬 Add Movie / TV Show
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Movie/Show Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          >
            <option value="Movie">🎥 Movie</option>
            <option value="TV Show">📺 TV Show</option>
          </select>

          <input
            name="director"
            placeholder="Director"
            value={formData.director}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            name="budget"
            placeholder="Budget (in USD)"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            name="location"
            placeholder="Filming Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            name="duration"
            placeholder="Duration (mins)"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            name="year"
            placeholder="Release Year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          />

          {/* Custom file input */}
          <div className="mt-3">
            <label className="block text-gray-300 mb-1">Poster Image</label>
            <label className="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
              <span className="text-gray-200">
                {formData.image ? formData.image.name : "Choose File"}
              </span>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-between mt-6">
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
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
