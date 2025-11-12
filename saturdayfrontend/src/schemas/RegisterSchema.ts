import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number is too long."),
    email: z.string().email("Invalid email format."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    photo: z
      .instanceof(File, { message: "Photo is required" })
      .refine((file) => file.size > 0, {
        message: "Photo is required",
      })
      .refine(
        (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
        {
          message: "Invalid image format. Use PNG or JPEG.",
        }
      )
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Image size must be under 2MB.",
      })
      .optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match.",
    path: ["password_confirmation"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
