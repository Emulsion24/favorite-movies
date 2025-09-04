// src/components/EntryFormModal.jsx
import { useState } from "react";
import { z } from "zod";
import api from "../utils/api";

const entrySchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["Movie", "TV Show"]),
  director: z.string().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear()).optional(),
});

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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const validated = entrySchema.parse({
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
        year: formData.year ? Number(formData.year) : undefined,
      });

      const data = new FormData();
      Object.entries(validated).forEach(([k, v]) => v && data.append(k, v));
      if (formData.image) data.append("image", formData.image);

      await api.post("/movies", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
    } catch (err) {
      setError(err.errors ? err.errors[0].message : "Failed to add entry");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Movie/TV Show</h2>
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="title" placeholder="Title" value={formData.title}
            onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <select name="type" value={formData.type} onChange={handleChange}
            className="w-full border px-3 py-2 rounded">
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
          <input name="director" placeholder="Director" value={formData.director}
            onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input name="budget" placeholder="Budget" type="number" value={formData.budget}
            onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input name="location" placeholder="Location" value={formData.location}
            onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input name="duration" placeholder="Duration" value={formData.duration}
            onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input name="year" placeholder="Year" type="number" value={formData.year}
            onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input name="image" type="file" accept="image/*" onChange={handleChange} />

          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
