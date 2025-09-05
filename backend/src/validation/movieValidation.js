// src/validation/movieValidation.js
const { z } = require("zod");

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
  type: z.enum(["Movie", "TV Show"]), // or your two options
  year: z.string().min(1,"Year is Required"),
  budget: z.string().optional(),
  location:z.string().optional(),
  // Don't validate file here, Multer handles it
});

module.exports = { movieSchema };
