import { useState } from "react";
import { ZodError } from "zod";
import api from "../utils/api";
import { entrySchema } from "../schemas/entrySchema";

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      entrySchema.parse(formData); // Validate

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => value && data.append(key, value));

      await api.post("/movies/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
    } catch (err) {
      if (err instanceof ZodError) {
        // Map Zod errors to a field-based object
        const fieldErrors = {};
        err.issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
        setErrors({ form: "Failed to submit" });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Movie/TV Show</h2>
        {errors.form && <p className="text-red-600">{errors.form}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
          {errors.type && <p className="text-red-600">{errors.type}</p>}

          <input
            name="director"
            placeholder="Director"
            value={formData.director}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.director && <p className="text-red-600">{errors.director}</p>}

          <input
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.budget && <p className="text-red-600">{errors.budget}</p>}

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.location && <p className="text-red-600">{errors.location}</p>}

          <input
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.duration && <p className="text-red-600">{errors.duration}</p>}

          <input
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.year && <p className="text-red-600">{errors.year}</p>}

          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleChange}
          />
          {errors.image && <p className="text-red-600">{errors.image}</p>}

          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Save
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
