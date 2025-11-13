import { z } from "zod";

export const settingsSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters.").optional().or(z.literal("")),
    phone: z.string().optional().refine((val) => {
      if (!val || val.length === 0) return true;
      return val.length >= 10 && val.length <= 15;
    }, {
      message: "Phone number must be between 10 and 15 digits.",
    }).or(z.literal("")),
    email: z.string().email("Invalid email format.").optional().or(z.literal("")),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    photo: z
      .custom<File | undefined>((file) => !file || file instanceof File, "Photo must be a file")
      .optional()
      .refine((file) => {
        if (!file) return true; // Optional field
        return ["image/png", "image/jpeg", "image/gif"].includes(file.type);
      }, {
        message: "Invalid image format. Use PNG, JPEG, or GIF.",
      })
      .refine((file) => {
        if (!file) return true; // Optional field
        return file.size <= 2 * 1024 * 1024;
      }, {
        message: "Image size must be under 2MB.",
      }),
  })
  .refine((data) => {
    // If name is provided, it must be at least 3 characters
    if (data.name && data.name.length > 0) {
      return data.name.length >= 3;
    }
    return true;
  }, {
    message: "Name must be at least 3 characters.",
    path: ["name"],
  })
  .refine((data) => {
    // If email is provided, it must be valid
    if (data.email && data.email.length > 0) {
      return z.string().email().safeParse(data.email).success;
    }
    return true;
  }, {
    message: "Invalid email format.",
    path: ["email"],
  })
  .refine((data) => {
    // If password is provided, it must be at least 6 characters
    if (data.password && data.password.length > 0) {
      return data.password.length >= 6;
    }
    return true;
  }, {
    message: "Password must be at least 6 characters.",
    path: ["password"],
  })
  .refine((data) => {
    // If password is provided, password_confirmation must match
    if (data.password && data.password.length > 0) {
      return data.password === data.password_confirmation;
    }
    return true;
  }, {
    message: "Passwords must match.",
    path: ["password_confirmation"],
  });

export type SettingsFormData = z.infer<typeof settingsSchema>;

