import { z } from "zod";

// Max file size in bytes (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed image types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const entrySchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["Movie", "TV Show"]),
  director: z.string().optional(),
  budget: z.string().optional(),  // store as string
  location: z.string().optional(),
  duration: z.string().optional(),
  year: z.string().optional(),    // store as string
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Image must be ≤ 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG, or WEBP files are allowed"
    ),
});
