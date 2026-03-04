import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    user: z.object({
      fullName: z.string().min(1, "Full name is required"),
      profilePhoto: z.string().url().optional(),
      contactNumber: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

const createHostSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    host: z.object({
      fullName: z.string().min(1, "Full name is required"),
      profilePhoto: z.string().url().optional(),
      contactNumber: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

const createAdminSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    admin: z.object({
      fullName: z.string().min(1, "Full name is required"),
      profilePhoto: z.string().url().optional(),
      contactNumber: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .optional(),

  contactNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional(),

  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),

  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional(),

  profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),

  interests: z
    .array(z.string().min(2, "Interest must be at least 2 characters"))
    .optional(),
});

export const userValidation = {
  createUser: createUserSchema,
  createHost: createHostSchema,
  createAdmin: createAdminSchema,
  updateProfile: updateProfileSchema,
};
