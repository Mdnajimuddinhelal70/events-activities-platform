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

export const userValidation = {
  createUser: createUserSchema,
  createHost: createHostSchema,
  createAdmin: createAdminSchema,
};
